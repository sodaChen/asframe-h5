/**
 * Http请求出现错误的返回接口
 * 
 * @author sodaChen
 * @date 2020年4月29日
 */ 
export interface IHttpError
{
    /**
     * 拦截处理http的错误数据，需要对错误进行相应的逻辑处理时
     * 比如token失效，或者需要做一些跳转之类的操作。正常是采用通用的弹窗处理
     * @param code 编码
     * @param errorMsg 错误消息
     */
    httpError(code:number,errorMsg:string):void;
}