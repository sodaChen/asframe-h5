
/**
 * socket接口，tcp即时通讯技术
 * @author sodaChen
 * #Date:2020-10-20 
 */
export interface ISocket {

    /**
     * 连接
     */
    connect(host:string, port:number):void;

    /**
     * 连接
     */
    connectByUrl(url:string):void;

 
    /**
     * 
     * @param onConnect 
     * @param onClose 
     * @param onSocketData 
     * @param onError 
     * @param thisObject 
     */
    addCallBacks(onConnect:Function, onClose:Function, onSocketData:Function, onError:Function, thisObject:any):void;

    /**
     * 
     * @param message 
     */
    send(message:any):void;


    /**
     * 
     */
    close():void;

    /**
     * 
     */
    disconnect():void;
}