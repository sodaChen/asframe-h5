/**
 * @Global.as
 *
 * @author sodaChen mail:sujun10#21cn.com
 * @version 1.0
 * <br>Copyright (C), 2013 asFrame.com
 * <br>This program is protected by copyright laws.
 * <br>Program Name:ASFrame
 * <br>Date:2020-10-29
 */
import { Dictionary } from "../maps/Dictionary";

/**
 * 全局对象，用于存放全局使用的东西，主要是提供一些公共的数据，以及做防止垃圾回收的措施
 * 游戏中最好不要直接在这里增加内容，这里维护的是属于框架通用的属性
 * @author sodaChen
 * Date:2020-10-29
 */
export class Global
{
    /** 用于存放引用的公共集合 **/
    static refMap: Dictionary<any, any> = new Dictionary<any, any>();
    /** 通用公共存放数据的集合 **/
    static dataMap: Dictionary<any, any> = new Dictionary<any, any>();
    /**
     *正常游戏帧频
        */
    static FRAMERATE_NORMAL: number = 30;

    static addRef(target: Object): void
    {
        this.refMap.put(target, target);
    }
    static removeRef(target: Object): void
    {
        this.refMap.remove(target);
    }
    static hasValue(key: any): boolean
    {
        return this.dataMap.hasKey(key);
    }
    static addValue(key: any, value: any): void
    {
        this.dataMap.put(key, value);
    }
    static getValue(key: any): any
    {
        return this.dataMap.get(key);
    }
    static removeValue(key: any): any
    {
        return this.dataMap.remove(key);
    }

    static createAny(): any
    {
        var a: any = {}
        return a
    }

    static getObjValue<K>(obj: any): Array<K>
    {
        let values: Array<K> = [];
        for (let key in obj)
        {
            values.push(obj[key]);
        }
        return values;
    }


    static getObjKey<K>(obj: any): Array<K>
    {
        let values: any[] = [];
        for (let key in obj)
        {
            values.push(key as any);
        }
        return values;
    }

}