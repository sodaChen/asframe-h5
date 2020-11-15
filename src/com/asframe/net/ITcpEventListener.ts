
import { NetErrorData } from './NetErrorData';

/**
 * tcp相关事件的监听接口，这个会比纯事件监听性能高一些，因为是直接回调
 * @author sodaChen
 * @date 2020/10/23
 */
export interface ITcpEventListener
{
    /**
     * socket连接成功
     */
    onSocketOpen():void;
    /**
     * socket关闭事件
     */
    onSocketClose():void;
    /**
     * socket连接异常事件
     */
    onSocketError():void;
    /**
     * 服务器返回的错误回调
     * @param errorData 包括相关的错误消息
     */
    errorBack(errorData:NetErrorData):void;
}