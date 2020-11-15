/**
 * http请求返回的通用结果对象
 * @author sodaChen
 * @Date 2020年5月1日
 */
export interface IHttpResult
{
    /** 相关配置信息 **/
    config:any;
    /** 服务器返回的实际数据结构  **/
    data:any;
    /** 消息头  **/
    headers:any;
    /** 服务器请求对象，一般是xmlrequest  **/
    request:any;
    /** 结果状态  **/
    statuts:number;
    /**  状态描述 **/
    statusText:string;
}