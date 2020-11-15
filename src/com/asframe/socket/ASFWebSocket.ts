import { EventDispatcher } from "../events/EventDispatcher";
import { ASFEvent } from "../events/ASFEvent";
import { IOErrorEvent } from "../events/IOErrorEvent";
import { ByteArray } from "../bytes/ByteArray";
import { ASFProgressEvent } from "../events/ASFProgressEvent";
import { ISocket } from './ISocket';
import { asf } from '../asf';


/**
 * ASFWebSocket 类启用代码以建立传输控制协议 (TCP) 套接字连接，用于发送和接收字符串或二进制数据。
 * 要使用 ASFWebSocket 类的方法，请先使用构造函数 new ASFWebSocket 创建一个 ASFWebSocket 对象。
 * 套接字以异步方式传输和接收数据。
 * 参考egret
 * @author sodaChen
 * #Date:2020-10-20 
 * @event ASFEvent.CONNECT 连接服务器成功。
 * @event egret.ASFProgressEvent.SOCKET_DATA 接收服务器数据。
 * @event ASFEvent.CLOSE 在服务器关闭连接时调度。
 * @event IOErrorEvent.IO_ERROR 在出现输入/输出错误并导致发送或加载操作失败时调度。。
 */
export class ASFWebSocket extends EventDispatcher {

    /**
     * 以字符串格式发送和接收数据
     */
    public static TYPE_STRING:string = "webSocketTypeString";
    /**
     * 以二进制格式发送和接收数据
     */
    public static TYPE_BINARY:string = "webSocketTypeBinary";

    /**
     * @private
     */
    private socket:ISocket;

    /**
     * @private
     */
    private _writeMessage:string = "";
    /**
     * @private
     */
    private _readMessage:string = "";

    /**
     * @private
     */
    private _connected:boolean = false;
    /**
     * @private
     */
    private _connecting:boolean = false;

    /**
     * 创建一个 WebSocket 对象
     * 连接地址和端口号在 connect 函数中传入
     */
    constructor(host:string = "", port:number = 0) {
        super();
        this._connected = false;
        this._writeMessage = "";
        this._readMessage = "";

        this.socket = new asf.ISocket();
        this.socket.addCallBacks(this.onConnect, this.onClose, this.onSocketData, this.onError, this);
    }
    
    /**
     * 将套接字连接到指定的主机和端口
     * @param host 要连接到的主机的名称或 IP 地址
     * @param port 要连接到的端口号
     */
    public connect(host:string, port:number):void {
        if(!this._connecting && !this._connected) {
            this._connecting = true;
            this.socket.connect(host, port);
        }
    }

    /**
     * 根据提供的url连接
     * @param url 全地址。如ws://echo.websocket.org:80
     */
    public connectByUrl(url:string):void {
        if(!this._connecting && !this._connected) {
            this._connecting = true;
            this.socket.connectByUrl(url);
        }
    }

    /**
     * 关闭套接字
     */
    public close():void {
        if(this._connected) {
            this.socket.close();
        }
    }

    /**
     * @private
     * 
     */
    private onConnect():void {
        this._connected = true;
        this._connecting = false;
        this.dispatchEventWith(ASFEvent.CONNECT);
    }

    /**
     * @private
     * 
     */
    private onClose():void {
        this._connected = false;
        this.dispatchEventWith(ASFEvent.CLOSE);
    }

    /**
     * @private
     * 
     */
    private onError():void {
        if(this._connecting) {
            this._connecting = false;
        }
        this.dispatchEventWith(IOErrorEvent.IO_ERROR);
    }

    /**
     * @private
     * 
     * @param message 
     */
    private onSocketData(message:any):void {
        if (typeof message == "string") {
            this._readMessage += message;
        }
        else {
            this._readByte._writeUint8Array(new Uint8Array(message));
        }
        ASFProgressEvent.dispatchProgressEvent(this, ASFProgressEvent.SOCKET_DATA);
    }

    /**
     * 对套接字输出缓冲区中积累的所有数据进行刷新
     */
    public flush():void {
        if (!this._connected) {
            return;
        }
        if (this._writeMessage) {
            this.socket.send(this._writeMessage);
            this._writeMessage = "";
        }
        if (this._bytesWrite) {
            this.socket.send(this._writeByte.buffer);
            this._bytesWrite = false;
            this._writeByte.clear();
        }
        this._isReadySend = false;
    }

    /**
     * @private
     */
    private _isReadySend:boolean = false;

    /**
     * 将字符串数据写入套接字
     * @param message 要写入套接字的字符串
     */
    public writeUTF(message:string):void {
        if (!this._connected) {
            // egret.$warn(3101);
            return;
        }
        if (this._type == ASFWebSocket.TYPE_BINARY) {
            this._bytesWrite = true;
            this._writeByte.writeUTF(message);
        }
        else {
            this._writeMessage += message;
        }
        this.flush();
    }

    /**
     * 从套接字读取一个 UTF-8 字符串
     * @returns {string}
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public readUTF():string {
        let message:string;
        if (this._type == ASFWebSocket.TYPE_BINARY) {
            this._readByte.position = 0;
            message = this._readByte.readUTF();
            this._readByte.clear();
        }
        else {
            message = this._readMessage;
            this._readMessage = "";
        }
        return message;
    }

    /**
     * @private
     */
    private _readByte:any = null;
    /**
     * @private
     */
    private _writeByte:any = null;
    /**
     * @private
     */
    private _bytesWrite:boolean = false;

    /**
     * 从指定的字节数组写入一系列字节。写入操作从 offset 指定的位置开始。
     * 如果省略了 length 参数，则默认长度 0 将导致该方法从 offset 开始写入整个缓冲区。
     * 如果还省略了 offset 参数，则写入整个缓冲区。
     * @param bytes 要从中读取数据的 ByteArray 对象
     * @param offset ByteArray 对象中从零开始的偏移量，应由此开始执行数据写入
     * @param length 要写入的字节数。默认值 0 导致从 offset 参数指定的值开始写入整个缓冲区
     */
    public writeBytes(bytes:ByteArray, offset:number = 0, length:number = 0):void {
        if (!this._connected) {
            // egret.$warn(3101);
            return;
        }
        if (!this._writeByte) {
            // egret.$warn(3102);
            return;
        }
        this._bytesWrite = true;
        this._writeByte.writeBytes(bytes, offset, length);
        this.flush();
    }

    /**
     * 从套接字读取 length 参数指定的数据字节数。从 offset 所表示的位置开始，将这些字节读入指定的字节数组
     * @param bytes 要将数据读入的 ByteArray 对象
     * @param offset 数据读取的偏移量应从该字节数组中开始
     * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
     */
    public readBytes(bytes:ByteArray, offset:number = 0, length:number = 0):void {
        if (!this._readByte) {
            return;
        }
        this._readByte.position = 0;
        this._readByte.readBytes(bytes, offset, length);
        this._readByte.clear();
    }

    /**
     * 表示此 Socket 对象目前是否已连接
     */
    public get connected():boolean {
        return this._connected;
    }

    /**
     * @private
     */
    private _type:string = ASFWebSocket.TYPE_STRING;

    /**
     * 发送和接收数据的格式，默认是字符串格式
     */
    public get type():string {
        return this._type;
    }

    public set type(value:string) {
        this._type = value;
        if (value == ASFWebSocket.TYPE_BINARY && !this._writeByte) {
            this._readByte = new ByteArray();
            this._writeByte = new ByteArray();
        }
    }
}
