import { ISocket } from './ISocket';
import { BaseSocket } from './BaseSocket';

/**
 * 框架内置基于Html5的WebScoekt对象
 * @author sodaChen
 * #Date:2020-10-20
 */
declare global {
    interface Window {
        WebSocket: any
    }
}
export class HTML5WebSocket extends BaseSocket implements ISocket 
{
    constructor() {
        super();
        let win:any = window;
        if (win && !win["WebSocket"]) {
            console.error("window没有WebSocket对象");
        }
    }
    /**
     * 创建H5的专属WebScoekt
     * @param url 
     */
    protected createSocket(url:string)
    {
        let win:any = window;
        this.socket = new win["WebSocket"](url);
        this.socket.binaryType = "arraybuffer";
    }
    /**
     * 绑定H5eboscket的相关事件
     */
    protected bindEvent():void {
        let that:any = this;
        let socket:any = this.socket;
        socket.onopen = function () {
            console.info("socket.onopen");
            if (that.onConnect) {
                that.onConnect.call(that.thisObject);
            }
        };
        socket.onclose = function (e:any) {
            console.info("socket.onclose");
            if (that.onClose) {
                that.onClose.call(that.thisObject);
            }
        };
        socket.onerror = function (e:any) {
            console.info("socket.onerror");
            if (that.onError) {
                that.onError.call(that.thisObject);
            }
        };
        socket.onmessage = function (e:any) {
            console.info("socket.onmessage");
            if (that.onSocketData) {
                that.onSocketData.call(that.thisObject, e.data);
            }
        };
    }

    public send(message:any):void {
        this.socket.send(message);
    }

    public close():void {
        this.socket.close();
    }
    public disconnect():void {
        if (this.socket.disconnect) {
            this.socket.disconnect();
        }
    }
}