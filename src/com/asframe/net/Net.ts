/**
 * @Net.ts
 * @author sodaChen mail:asframe@qq.com
 * @version 1.0
 * <br> Copyright (c) 2012-present, asframe.com
 * <br>Program Name:ASFrameTS
 * <br>Date:2020/10/10
 */
import { Subjects } from "../mode/observers/Subjects";
import { ITcpEventListener } from "./ITcpEventListener";
import { CallBack } from "../fun/CallBack";
import { IOErrorEvent } from "../events/IOErrorEvent";
import { ByteArray } from "../bytes/ByteArray";
import { HashMap } from "../maps/HashMap";
import { ASFProgressEvent } from "../events/ASFProgressEvent";
import { ASFEvent } from "../events/ASFEvent";
import { CoreNotice } from "../CoreNotice";
import { ASFWebSocket } from '../socket/ASFWebSocket';
import { NetErrorData } from './NetErrorData';
import { IMsgCodec } from "./codec/IMsgCodec";


/**
 * webScocket通讯类
 * @author sodaChen
 */
export class Net
{
    /** 默认socket，即主socket **/
    static DEFAULE: string = "default";

    // /** 消息头的长度 **/
    // static HEAD_LEN: number = 7;
    /**
     * 网络数据主题对象，notice都是cmd的数值
     */
    static cmds: Subjects;
    /** 通讯接口 **/
    static socket: ASFWebSocket;
    /**
     * 是否开启网关
     */
    static openGateway:boolean;
    /** 一次性回调函数集合 **/
    private static backFuns: HashMap<number, NetFunData>;
    // /** 一次性错误回调函数集合 **/
    private static onceErrorFuns: HashMap<number, NetFunData>;
    /** 服务器主动推送数据的回调函数集合 **/
    private static passiveFuns: HashMap<number, NetFunData>;
    /** 错误函数回调 **/
    private static errorFuns: HashMap<number, NetFunData>;
    /** 允许重复发送的指令集合 **/
    private static soloCmds: HashMap<number, number>;
    /** 已经发送出去的指令，服务器返回时需要删除验证 **/
    private static sendCmds: HashMap<number, number>;
    /** 编码解码接口的列表 **/
    private static codecList: IMsgCodec[];
    /** 服务器IP **/
    private static host: string;
    /** cmd和对应的socket进行绑定 ***/
    private static cmdSocket: any;

    private static errorBack: ITcpEventListener | undefined;
    private static errorData:NetErrorData;

    /**发协议前的拦截判断，返回的值为true时通过 */
    private static sendInterceptHandler: CallBack;

    static init(errorBack?: ITcpEventListener): void
    {
        this.errorBack = errorBack;
        this.errorData = new NetErrorData(0,0,"");
        this.cmds = new Subjects();
        this.backFuns = new HashMap<number, NetFunData>();
        this.onceErrorFuns = new HashMap<number, NetFunData>();
        this.errorFuns = new HashMap<number, NetFunData>();
        // this.backThisMap = new HashMap<number, Object>();
        this.passiveFuns = new HashMap<number, NetFunData>();
        this.soloCmds = new HashMap<number, number>();
        this.sendCmds = new HashMap<number, number>();
        this.codecList = new Array<IMsgCodec>();
        this.cmdSocket = {};
        this.socket = new ASFWebSocket();
    }

    static connected(): boolean
    {
        if(this.socket)
            return this.socket.connected;
        return false;
    }

    static initSocket(): void
    {
        //设置数据格式为二进制，默认为字符串
        this.socket.type = ASFWebSocket.TYPE_BINARY;
        //添加收到数据侦听，收到数据会调用此方法
        this.socket.addEventListener(ASFProgressEvent.SOCKET_DATA, this.onReceive, this);
        //添加链接打开侦听，连接成功会调用此方法
        this.socket.addEventListener(ASFEvent.CONNECT, this.onConnect, this);
        //添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
        this.socket.addEventListener(ASFEvent.CLOSE, this.onSocketClose, this);
        //添加异常侦听，出现异常会调用此方法
        this.socket.addEventListener(IOErrorEvent.IO_ERROR, this.onSocketError, this);
    }

    /**
     * 删除掉cmd数组绑定的socket
     * @param {number[]} cmds
     */
    static delSocketCmd(cmds: number[]): void
    {
        //注意，一个cmd不可能同时对应有两个socket，所以是唯一的
        var len: number = cmds.length;
        for (var i: number = 0; i < len; i++)
        {
            delete this.cmdSocket[cmds[i]];
        }
    }

    /**
     * 连接
     *
     * @static
     *
     * @memberOf Net
     */
    static connect(host: string): void
    {
        if(this.socket.connected)
        {
            console.info("Net socket已经连接，不重复连接");
            return ;
        }
        console.info("Net:connect ===>" + host);
        this.host = host;
        //websocket进行初始化
        this.initSocket();
        this.socket.connectByUrl(host);
    }

    static close(): void
    {
        console.info( "客户端自己中断服务器");
        this.socket.close();
    }

    /**
     * 删除callback回调函数
     * @param cmd
     */
    static delCallBack(cmd: number): void
    {
        this.backFuns.remove(cmd);
    }

    /**
     * 注册不允许连续重复发送的指令cmd。只能等只能有返回结果之后才允许下一次发送
     * @param cmd
     */
    static regSoloCmd(cmd: number): void
    {
        this.soloCmds.put(cmd, cmd);
    }
    static delSoloCmd(cmd: number): void
    {
        this.soloCmds.remove(cmd);
    }

    /**
     * 注册监听错误码
     * @param cmd 错误指令
     * @param fun 回调函数（返回false可不走统一处理方法，默认为true）
     * @param thisObj this对象
     */
    static regError(cmd: number, fun: Function, thisObj: Object, isOnce: boolean = true): void
    {
        if (isOnce)
            this.onceErrorFuns.put(cmd, new NetFunData(fun, thisObj));
        else
            this.errorFuns.put(cmd, new NetFunData(fun, thisObj));
    }


    /**
     * 取消监听错误码
     * @param cmd 错误指令
     */
    static offError(cmd: number, isOnce: boolean = true): void
    {
        if (isOnce)
            this.onceErrorFuns.remove(cmd);
        else
            this.errorFuns.remove(cmd);
    }
    /**
     * 登陆网关
     * @param gameId 游戏ID
     */
    static loginGateway(gameId:number):void
    {
        var bytes: ByteArray = new ByteArray();
        bytes.writeShort(0);
        bytes.writeShort(gameId);
        this.socket.writeBytes(bytes);
        this.socket.flush();
    }


    /**
     * 注册服务端主动推送的回调函数
     * @param backCmd 返回指令
     * @param backFun 回调函数
     * @param thisObj this对象,如果backFun是闭包函数，则不需要
     */
    static regPassive(backCmd: number, backFun: Function, thisObj: Object): void
    {
        this.passiveFuns.put(backCmd, new NetFunData(backFun, thisObj));
    }
    /**
     * 添加一个解码器
     * @param type 解码类型
     * @param msgCodec 解码器
     */
    static addCodec(type: number, msgCodec: IMsgCodec): void
    {
        this.codecList[type] = msgCodec;
    }
    /**
     * 根据类型获得一个解码器
     * @param type
     */
    static getCodec(type:number):IMsgCodec
    {
        return this.codecList[type];
    }

    private static onReceive(evt: ASFEvent): void
    {
        // return;
        var socket: any = this.socket;
        let bytes: ByteArray = new ByteArray();
        socket.readBytes(bytes);
        let cmd: number = bytes.readShort();
        if(cmd == -1)
        {
            console.log("收到网关返回结果");
            //抛出网关接口
            this.cmds.send(CoreNotice.Gateway_Result, bytes.readByte());
            return ;
        }
        let type: number = bytes.readByte();
        let code: number = bytes.readShort();
        let netData: any;
        //注册过才删除，返回是比发送多10000（存的是发送指令，所以减）
        if (this.soloCmds.hasKey(cmd - 10000))
            this.sendCmds.remove(cmd - 10000);

        //10000是请求服务端操作成功 0
        if (code != 0)
        {
            //读取错误消息
            let errorMsg = bytes.readUTF();
            //var runDefalutErrorBack: boolean = true;
            netData = this.onceErrorFuns.remove(cmd);
            if (!netData)
            {
                netData = this.errorFuns.get(cmd);
            }
            this.errorData.cmd = cmd;
            this.errorData.code = code;
            this.errorData.errorMsg = errorMsg;
            //没有isDestroy属性或者isDestroy为false
            if (netData && !netData.thisObj["isDestroy"])
            {
                let re: boolean = netData.fun.call(netData.thisObj, this.errorData);
                //如果没返回值则用默认，有返回则赋值
                // if (re != undefined && re != null)
                //     runDefalutErrorBack = re;
            }
            else
            {
                //错误消息派发出去
                this.cmds.send(CoreNotice.Cmd_Error_Code, code, cmd);
            }
            if(this.errorBack)
                this.errorBack.errorBack(this.errorData);
            console.info("收到cmd:" + cmd + " 返回的错误码code:" + code + " errorMsg:" + errorMsg);
            return;
        }
        //根据类型解码数据
        var data = this.codecList[type].decode(cmd, bytes);
        //先看有没有回到函数
        netData = this.backFuns.remove(cmd);
        //查看是否有主动推送的消息
        if (!netData)
            netData = this.passiveFuns.get(cmd);


        //先判断是否有回调函数，有的话，则先抛出给回调函数
        if (netData && !netData.thisObj["isDestroy"])
        {
            let callFun: Function = netData.fun;
            let thisObj: Object = netData.thisObj;
            //长度为3时，表示需要接收cmd参数
            if (callFun.length == 3)
                callFun.call(thisObj, data, code, cmd);
            else
                callFun.call(thisObj, data, code);

            //todo 这里还有点bug，错误和正确接受函数得统一处理，不然会出现无法回收的情况
            //如果有错误回调函数，也进行清除

        }
        else
        {
            //抛出数据，目前是只有没有回调函数的时候才全局广播，减少性能的损耗
            this.cmds.send(cmd, data, code);
        }
    }
    private static onConnect(evt: ASFEvent): void
    {
        console.info("onSocketOpen" );
        this.cmds.send(CoreNotice.SOCEKT_OPEN, "default");
        if(this.errorBack)
            this.errorBack.onSocketOpen();
    }

    private static onSocketClose(evt: ASFEvent): void
    {
        console.log("Net:connect ===> onSocketClose");
        this.cmds.send(CoreNotice.SOCEKT_CLOSE, "default");
        if(this.errorBack)
            this.errorBack.onSocketClose();
    }

    private static onSocketError(evt: IOErrorEvent): void
    {
        console.error("Net:connect ===> onSocketError");
        this.cmds.send(CoreNotice.SOCEKT_CLOSE, "default");//SOCEKT_ERROR
        if(this.errorBack)
            this.errorBack.onSocketError();
    }

    /**
     * 发送网络数据
     * @param cmd 消息的cmd唯一值
     * @param data 任意消息体
     * @param type 指定消息体的类型，为空则是按照默认值
     */
    static send(cmd: number, data: any, type: number, callBack?: Function, thisObj?: Object): void
    {
        if (data == null)
        {
            //没有任何参数
            this.sendBinary(cmd, type, null);
            return;
        }
        //对应类型的编码函数
        var bytes: ByteArray = this.codecList[type].code(data);
        this.sendBinary(cmd, type, bytes);
    }
    static sendBytes(cmd: number, bytes: ByteArray, callBack: Function, thisObj: Object, errorFun: Function): void
    {
        if (callBack)
            this.backFuns.put(cmd + 10000, new NetFunData(callBack, thisObj));
        if (errorFun)
            this.onceErrorFuns.put(cmd + 10000, new NetFunData(errorFun, thisObj));
        this.sendBinary(cmd, 0, bytes);
    }

    /**
     * 协议工具生成的发送代码时调用的代码
     * @param cmd 发送唯一指令
     * @param args 参数列表
     * @param type 编码类型
     */
    static autoMsg(cmd: number, args: any, type: number): void
    {
        if(!this.socket)
        {
            console.error("socket没有初始化却调用发送请求了, cmd:" + cmd);
            return ;
        }
        if(!this.socket.connected)
        {
            //游戏已经断开了，发出时间，通知前端是否要做其他时间
            console.info("socket已经断开,cmd:" + cmd + " args:" + args);
            this.cmds.send(CoreNotice.Send_Data_ERROR);
            return ;
        }
        //只有开启了单独发送的指令才会做这个检测，提高发送性能
        if (this.soloCmds.hasKey(cmd))
        {
            if (this.sendCmds.hasKey(cmd))
            {
                console.log("cmd:" + cmd + " 重复发送了！");
                return;
            }
            //对指令进行检测，已经发送过了，并且不能重复发送指令，则返回不处理
            this.sendCmds.put(cmd, cmd);
        }
        var len: number = args.length - 1;
        if (len >= 0)
        {
            let callBack: any;
            let thisObj: any;
            //最后一个参数是函数的处理，没有this对象，最后一个函数
            if (args[len] instanceof Function)
            {
                //最后一个function肯定是错误的回调函数，往前两个分别是thisObj和succfun
                if (args[len - 1] == null)
                    throw new Error(cmd + "如果有回调函数，必须带thisObj参数");
                //必定是回调函数
                if (args[len - 2] != null && !(args[len - 2] instanceof Function))
                {
                    throw new Error(cmd + "如果有回调函数，必须带thisObj参数");
                }
                thisObj = args[len - 1];
                this.onceErrorFuns.put(cmd + 10000, new NetFunData(args[len], thisObj));
                callBack = args[len - 2];
            }
            //看倒数第二个是不是函数
            else if (len >= 1 && args[len - 1] instanceof Function)
            {
                callBack = args[len - 1];
                //最后一个一定是this对象，不然请报错
                thisObj = args[len];
            }
            //加载返回cmd的通用值,回调函数缓存起来.这里存的是一次性的回调函数
            if (callBack)
                this.backFuns.put(cmd + 10000, new NetFunData(callBack, thisObj));
        }


        //拦截并判断是否继续发协议
        var checker: boolean = true;
        if (this.sendInterceptHandler)
            checker = this.sendInterceptHandler.execute(cmd, args);

        if (checker)
        {
            if (len < 0)
            {
                //没有任何参数
                this.sendBinary(cmd, type, null);
            }
            else
            {
                //对应类型的编码函数
                var bytes: ByteArray = this.codecList[type].code(args);
                this.sendBinary(cmd, type, bytes);
            }
        }
    }

    private static sendBinary(cmd: number, type: number, data: ByteArray | null): void
    {
        // if (!this.socket)
        //     return;
        var bytes: ByteArray = new ByteArray();
        if(this.openGateway)
        {
            //编写网关发送数据的特殊标记,暂时定为10
            bytes.writeShort(10);
        }
        bytes.writeShort(cmd);
        bytes.writeByte(type);
        if (data == null)
        {
            bytes.writeShort(0);
        }
        else
        {
            bytes.writeShort(data.length);
            bytes.writeBytes(data);
        }
        this.socket.writeBytes(bytes);
        this.socket.flush();
    }

    /**设置发协议前的拦截方法，默认参数：(协议号,参数列表) */
    public static setSendInterceptHandler(func: Function, thisObj: Object): void
    {
        if (this.sendInterceptHandler)
            this.sendInterceptHandler.destroy();
        this.sendInterceptHandler = new CallBack(func, thisObj);
    }

    /**获取当前的发协议前的拦截方法 */
    public static getSendInterceptHandler(): CallBack
    {
        return this.sendInterceptHandler;
    }
}

export class NetFunData
{
    /** 回调函数 **/
    fun: Function;
    errorFun: any = null;
    /** this对象 **/
    thisObj: any;
    /** 是否只使用一次 **/
    isOnce: boolean = false;
    constructor(fun: Function, thisObj: Object)
    {
        this.fun = fun;
        this.thisObj = thisObj;
    }
}
