/**
 * http请求返回的协议结果对象。实际用户使用的对象
 * @author sodaChen
 * @Date 2020年5月1日
 */
export interface IHttpResponse
{
    /**
     * 服务器返回的编码.0是成功，其他都是错误码
     */
    code:number;
    /**
     * 当前协议的唯一编码
     */
    cmd:number;
    /**
     * code不为0时，返回错误消息
     */
    errorMsg:string;
    /**
     * code为0时，前端收到的具体消息是这个data内容
     */
    data:any;
}