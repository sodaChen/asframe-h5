/**
 * @IObserver.as
 *
 * @author sodaChen mail:asframe#163.com
 * @version 1.0
 * <br>Copyright (C), 2012 ASFrame.com
 * <br>This program is protected by copyright laws.
 * <br>Program Name:ASFrame
 * <br>Date:2012-1-19
 */
/**
 * 观察者接口
 * @author sodaChen
 * Date:2020-10-19
 */
export interface IObserver
{
	/**
	 * 相应观察者
	 * @param notice 触发此次相应的通知
	 * @param args 相关参数数组
	 *
	 */
	update(args:any[]):void;
}
