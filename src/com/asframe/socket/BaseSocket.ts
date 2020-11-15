import { ISocket } from './ISocket';

/**
 * 框架内置基础的Scoekt对象
 * @author sodaChen
 * #Date:2020-10-20
 */
export class BaseSocket
{
    protected socket:any = null;
    protected onConnect:any = null;
    protected onClose:any = null;
    protected onSocketData:any = null;
    protected onError:any = null;
    protected thisObject:any = null;

    private host:string = "";
    private port:number = 0;
    
    /**
     * 注册socket的相关回调函数
     * @param onConnect 
     * @param onClose 
     * @param onSocketData 
     * @param onError 
     * @param thisObject 
     */
    public addCallBacks(onConnect:Function, onClose:Function, onSocketData:Function, onError:Function, thisObject:any):void {
        this.onConnect = onConnect;
        this.onClose = onClose;
        this.onSocketData = onSocketData;
        this.onError = onError;
        this.thisObject = thisObject;
    }

    
    public connect(host:string, port:number):void {
        this.host = host;
        this.port = port;
        this.connectByUrl("ws://" + this.host + ":" + this.port);
    }

    public connectByUrl(url:string):void {
        this.createSocket(url);
        this.bindEvent();
    }

    protected createSocket(url:string)
    {
        
    }

    protected bindEvent():void {

    }

}