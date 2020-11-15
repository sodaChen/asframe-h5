import { HashMap } from '../maps/HashMap';
import { IHttp } from '../net/http/IHttp';
import { asf } from '../asf';
import { IHttpResponse } from '../net/http/IHttpResponse';
import { IHttpError } from '../net/http/IHttpError';

/**
 * Http管理器，主要是用来处理http请求的相关处理，内部封装了具体的处理，做了统一的逻辑处理
 * @author sodaChen
 * Date:2020/10/7
 */
export class HttpMgr
{

    // private static token:string = "8252beaa12707e4c85a76596c487e3a8";
    private static token:string = "";
    private static urlHead:string;
    private static httpRequest:IHttp;
    private static httpError:IHttpError;
    /**
     * 版本信息
     */
    private static ver:string = "1.0";
    
    private static callBackMap:HashMap<string,HttpRequestModel> = new HashMap<string,HttpRequestModel>();

    private static checkRestUrlMap:HashMap<string,number> = new HashMap<string,number>();
    

    /**
     * 初始化Http管理器，需要相应的http请求接口实例，根据不同的环境传入不同的实现对象
     * @param httpRequest 
     */
    static init(httpRequest:IHttp,httpError:IHttpError):void
    {
        this.httpRequest = httpRequest;
        this.httpError = httpError;
    }
    /**
     * 设置token放到协议头
     */
    static initHeaders(token:string,ver:string):void
    {
        this.token = token;
        this.ver = ver;
        this.httpRequest.addHeader("X-Access-Token",token);
        this.httpRequest.addHeader("token",token);
        this.httpRequest.addHeader("ver",ver);
    }
 
    static clearUrl(url:string):void
    {
        this.checkRestUrlMap.remove(url);
    }
    
    static postHttp(url:string,params:any,succeedFun:Function,that:Object,errorFun?:Function)
    {
        if(this.checkUrl(url))
            return ;

        if(!params)
        {
            params = {};
        }
        //todo 正式环境需要注释掉
        params["token"] = this.token;
        params["ver"] = this.ver;
        this.callBackMap.put(url,new HttpRequestModel(succeedFun,that,errorFun));
        //进行网络请求
        this.httpRequest.postHttp(url,params,this.onSucceed,this.onError,this);
    }

    private static checkUrl(url:string):boolean
    {
        if(this.checkRestUrlMap.hasKey(url))
        {
            let lastTime:number = this.checkRestUrlMap.get(url);
            let addTime:number = asf.getDateTime() - lastTime;
            //100毫秒以内不再请求
            if(addTime < 100)
            {
                console.info(url + "重复请求了");
                return true;
            }
            else
            {
                console.info(url + "距离上次请求超过200毫秒了，可以重新请求");
            }
        }
        this.checkRestUrlMap.put(url,asf.getDateTime());
        return false;
    }
    private static onError(error:any,url:string):void
    {   
        console.log(error);
        let callBack = this.callBackMap.remove(url);
        console.error(url + "无法请求到数据");
        if(callBack && callBack.errorFun)
        {
            callBack.errorFun(error,url);
        }
    }
    private static onSucceed(response:any,url:string):void
    {
        let callBack = this.callBackMap.remove(url);
        //初步分析结果
        let result:IHttpResponse = response.data;
        console.info(url + "返回结果:",result);
        if(!callBack)
        {
            return ;
        }
        if(result.code == 0)
        {
            try
            {
                callBack.succeedFun.call(callBack.that,result.data);
            }
            catch(error)
            {
                console.error(error);
            }
            return ;
        }
        //通过错误接口来返回处理对象，不同的应用，处理错误的编码之类的机制也不一样
        else if(callBack.errorFun)
        {
            callBack.errorFun.call(callBack.that,result.code,result.errorMsg);
            return ;
        }
        //通用的错误逻辑处理
        this.httpError.httpError(result.code,result.errorMsg);
    }
}
class HttpRequestModel
{
    /**
     * 成功回调函数
     */
    succeedFun:Function;
    /**
     * 回调函数绑定的执行对象
     */
    that:Object;
    /**
     * 错误回调函数
     */
    errorFun?:Function;
    // constructor(url:string,params:any,succeedFun:Function,that:Object,errorFun?:Function)
    constructor(succeedFun:Function,that:Object,errorFun?:Function)
    {
        this.succeedFun = succeedFun;
        this.errorFun = errorFun;
        this.that = that;
    }
}
