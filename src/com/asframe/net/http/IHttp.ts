/**
 * Http请求协议的接口
 * 
 * @author sodaChen
 * @date 2020年4月28日
 */ 
export interface IHttp
{
    /**
     * 添加一个消息头
     * @param key 头的key
     * @param context 头的内容
     */
    addHeader(key:string,context:string):void;
    /**
     * 初始化http请求对象
     * @param urlRoot 请求地址根目录
     * @param contentType 内容类型
     * @param timeout 超时处理
     */
    init(urlRoot:string,contentType:string,timeout:number):void;
    /**
     * post请求数据给服务端
     * @param url 指定的地址
     * @param param 参数
     * @param succeedFun 成功回调函数 
     * @param errorFun 失败回调函数
     * @param that 作用域对象
     */
    postHttp(url:string,param:any,succeedFun:Function,errorFun:Function,that:Object):void;
}