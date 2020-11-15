import { TimeMgr } from './mgr/TimeMgr';
/**
 * 最基础的函数包名，大量基础通用的方法
 * @author sodaChen
 * Date:2020-10-19
 */
export class asf
{
    /**
     * 跨平台的socket实例。根据不同环境进行赋值
     */
    static ISocket:any;
    /**
     * 基础的时间管理器对象
     */
    static timer:TimeMgr = new TimeMgr();
    /**
     * 程序的运行时间
     */
    static $runTime:number = 0;

    /**
     * 创建一个通用的any类型的Object对象，主要是用来应用d.ts里面对应的数据结构
     */
    static create():any
    {
        return {};
    }
    /**
     * 把有类型的数据转换成没
     * @param a 对象
     */
    static asAny(a: any): any
    {
        return a;
    }
    /**
     * 初始化底层框架引擎，必须在项目运行之初就调用这个方法，否则可能会导致调用某些底层api出现异常
     */
    static init()
    {
        //获得系统刚初始化的运行时间
        this.$runTime = new Date().getTime();
    }
    /**
     * 获取当前日期的时间戳
     */
    static getDateTime():number
    {
        return new Date().getTime();
    }
    /**
     * 获取当前系统的运行时间
     */
    static getTimer():number
    {
        return new Date().getTime() - this.$runTime;
    }
}