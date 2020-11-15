/**
 * @ASFrame.ts
 *
 * @author sodaChen mail:asframe#qq.com
 * @version 1.0
 * <br>Copyright (C), 2012-present ASFrame.com
 * <br>This program is protected by copyright laws.
 * <br>Program Name:Collections
 * <br>Date:2020-10-7
 */
/**
 * @private
 * 哈希计数，全局使用，外部不可更改
 */
export let $hashCount:number = 1;


/**
 * 顶级对象。框架内所有对象的基类，为对象实例提供唯一的hashCode值。
 */
export class ASFObject //implements IHashObject,ICloneable
{
	/**
	 * @private
	 */
	_hashCode: number;

	/**
	 * 创建一个 HashObject 对象
	 */
	public constructor() {
		this._hashCode = $hashCount++;
	}

	/**
	 * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
	 */
	public get hashCode(): number
	{
		return this._hashCode;
	}

	// public equals(object:ASFObject):boolean
	// {
	// 	return this._hashCode == object.hashCode;
	// }
	//
	// public getClass():Object
	// {
	// 	return ASFObject;
	// }
	public clone():any
	{
		return new ASFObject();
	}
}

export interface IDestory
{
	/**
	* 释放对象相关资源
	* @param o:释放时需要的参数（不是必须的）
	*
	*/
	destroy(o?: any): void;
}

