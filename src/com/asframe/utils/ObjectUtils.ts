/**
 * @ObjectUtils.ts
 * @author sodaChen mail:asframe@qq.com
 * @version 1.0
 * <br> Copyright (c) 2012-present, asframe.com
 * <br>Program Name:ASFrameTS
 * <br>Date:2020/20/18
 */
/**
 * 对象工具类
 * @author sodaChen
 * Date:2020-10-21 
 */
export class ObjectUtils
{
    /**
     * 判断对象是否拥有指定的属性
     * @param target 
     * @param property 
     */
    static hasProperty(target: any, property: string): boolean
    {
        if (target.hasOwnProperty(property))
            return true;
        //主要是继承来的
        if (target[property] == undefined)
            return false;
        return true;
    }

    /**
     * 字符串的属性不为空
     * @param target
     * @param property
     * @returns {boolean}
     */
    static strNoNull(target: any, property: string): boolean
    {
        if (target[property] == undefined)
            return false;
        if (target[property] == null)
            return false;
        if (target[property] == "")
            return false;

        return true;
    }
    /**
     * 简单的复制object对象。只是object新的，里面的属性没有深度复制
     * @param target 
     * @param obj 
     */
    static easyCopy(target: any, obj?: any):any
    {
        if (!obj)
        obj = {};
        for (var key in target)
        {
            obj[key] = target[key];
        }
        return obj;
    }

    static copyObject(target: any, obj?: any): any
    {
        if (!obj)
            obj = {};
        for (var key in target)
        {
            if (target[key] instanceof Array)
            {
                obj[key] = this.copyObject(target[key], [])
            }
            else if (target[key] instanceof Object)
            {
                obj[key] = this.copyObject(target[key])
            }
            else
            {
                obj[key] = target[key];
            }
        }
        return obj;
    }

    /**调用类方法进行销毁 */
    public static destroyObj(obj: any, funcName: string = "destroy")
    {
        if (obj instanceof Array)
        {
            for (let i in obj)
            {
                if (obj[i])
                {
                    if (this.hasProperty(obj[i], funcName))
                    {
                        obj[i][funcName]();
                        obj[i] = null;
                    }
                    else
                    {
                        console.error("Destroy Error ! --> Object: " + obj[i].toString() + " --> Undefined Function: " + funcName);
                    }
                }
            }
            obj = null;
        }
        else
        {
            if (obj)
            {
                if (this.hasProperty(obj, funcName))
                {
                    obj[funcName]();
                    obj = null;
                }
                else
                {
                    console.error("Destroy Error ! --> Object: " + obj.toString() + " --> Undefined Function: " + funcName);
                }
            }
        }
    }
}