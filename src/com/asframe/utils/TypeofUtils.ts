/**
 * 类型判断工具类
 * @author sodaChen
 * Date:2020-10-19
 */
export class TypeofUtils
{
    /**
     * 是否为数字
     * @param value 
     */
    static isNumber(value: any): boolean
    {
        return typeof value === "number";
    }
    /**
     * 是否为字符串
     * @param value 
     */
    static isString(value: any): boolean
    {
        return typeof value === "string";
    }
    /**
     * 是否为数组
     * @param value 
     */
    static isArray(value: any): boolean
    {
        var str: string = typeof value;
        return str === "array";
    }
    /**
     * 是否为布尔值
     * @param value 
     */
    static isBoolean(value: any): boolean
    {
        return typeof value === "boolean";
    }
}