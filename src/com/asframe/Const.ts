/**
 * @Const.as
 *
 * @author sodaChen mail:asframe#163.com
 * @version 1.0
 * <br>Copyright (C), 2012 ASFrame.com
 * <br>This program is protected by copyright laws.
 * <br>Program Name:ASFrame
 * <br>Date:2020-10-20
 */
/**
 * 框架里自带的常量，供其他应用直接调用
 * @author sodaChen
 * Date:2020-10-20
 */
export class Const
{
	//////////////////////数值的最大和最小值////////////////
	/** 场景形式存在 **/
	static SCENE_CACHE:number = 0;
	/** 永久存在 **/
	static LONG_CACHE:number = 1;
	/** 引用计数的缓存机制 **/
	static COUNT_CACHE:number = 2;


	/** 构造器的属性名称 **/
	static CONSTRUCTOR_NAME:String = "constructor";
	/** 对象 **/
	static VALUE:Object = {};
	/** true **/
	static TRUE:boolean = true;
	/** false **/
	static FALSE:boolean = false;
	/** 播放特效 **/
	static PLAY_EFFECT:String = "play";
	/**
	 * 将弧度转换为度时乘以的值。
	 */
	static RADIANS_TO_DEGREES : Number = 180 / Math.PI;
	/**
	 * 将度转换为弧度时乘以的值
	 */
	static DEGREES_TO_RADIANS : Number = Math.PI / 180;

	/**
	 * 资源解析的时间，指的是在一帧的时间里，可以用多少时间来进行解析资源（默认是15毫秒）
	 * 注意，解析时间消耗多，则会影响其他程序运行，有可能会掉帧。时间少，解析又慢。
	 * 可以根据实际情况来动态调节这个值。
	 **/
	static resParseTime:number = 15;
	/**
	 * 共享池的引用完毕之后的延迟销毁时间。默认是30秒
	 * @see com.asframe.share.SharingPool
	 */
	static sharingPoolDelay:number = 30000;
	/** 是否启动共享缓存策略（一般用于工具开发） **/
	static isResSharing:Boolean = true;
	/** 是否使用内存缓存二进制字节 **/
	static isCacheBytes:Boolean = true;
}
