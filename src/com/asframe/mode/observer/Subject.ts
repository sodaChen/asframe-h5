/**
 * @Subjects.as
 *
 * @author sodaChen mail:sujun10@qq.com
 * @version 1.0
 * <br>Program Name:ASFrame
 * <br>Date:2020-10-7
 */
import {ISubject} from "./ISubject";
import {IObserver} from "./IObserver";
import {NoticeData} from "./NoticeData";
/**
 * 观察者主题，单一主题
 * @author sodaChen
 * #Date:2020-10-7
 */
export class Subject implements ISubject
{
	/** 存放监听函数的集合 **/
	private listenerList:Array<NoticeData>;
	private noticeStr:any;

	constructor(notice?:string | undefined)
	{
		this.listenerList = new Array<NoticeData>();
		this.noticeStr = notice;
	}

	private addNoticeData(listener:Function,thisObj:Object,isOnce:boolean):void
	{
		if(thisObj == null)
			throw new Error("thisObj不能为空");
		var listeners:Array<NoticeData> = this.listenerList;
		var len:number = listeners.length;
		for(var i:number = 0; i < len; i++)
		{
			if(listeners[i].listener == listener)
				return ;
		}
		//添加新的
		listeners.push(new NoticeData(listener,thisObj,isOnce));
	}
	private getObserverFun(observer:IObserver):Function
	{
		var listener:any = observer.update;
		var obs:any = observer;
		if(obs.hasOwnProperty(this.noticeStr)
			&& obs[this.noticeStr] instanceof Function)
			listener = obs[this.noticeStr];
		return listener;
	}
	/**
	 * 设置一个通知主题
	 * @param notice
	 */
	setNotice(notice:string):void
	{
		this.noticeStr = notice;
	}
	/**
	 * 针对主题进行广播
	 * @param params 接受参数
	 */
	notice(params:Array<Object>):void
	{
		var listeners:Array<NoticeData> = this.listenerList;
		//函数注册的调用
		var length:number;
		var data:NoticeData;
		if(listeners != null && (length = listeners.length) > 0)
		{
			for(var i:number = 0; i < length; i++)
			{
				data = listeners[i];
				data.listener.apply(data.thisObj,params);
				if(data.isOnce)
				{
					//即时删除
					listeners.splice(i, 1);
					i--;
					length--;
				}
			}
		}
	}
	/**
	 * 发送一起通知
	 * @param notice 通知
	 * @param params 通知附带的参数
	 *
	 */
	send(...args:any[]):void
	{
		this.notice(args);
	}
	/**
	 * 添加一个观察者通知
	 * @param notice 通知名称
	 * @param listener 通知监听函数
	 *
	 */
	on(listener:Function,thisObj:Object):void
	{
		this.addNoticeData(listener,thisObj,false);
	}
	onObserver(observer:IObserver,isOnce:boolean):void
	{
		this.addNoticeData(this.getObserverFun(observer),observer,isOnce);
	}

	/**
	 * 删除一个观察者通知
	 * @param notice 通知名称
	 * @param listener 删除指定监听函数，为空则表示删除这个通知下的所有监听函数
	 *
	 */
	off(listener:Function):void
	{
		var listeners:Array<NoticeData> = this.listenerList;
		if(listeners == null)
				return ;
		var len:number = listeners.length;
		for(var i:number = 0; i < len; i++)
		{
			if(listeners[i].listener == listener)
			{
				listeners.splice(i, 1);
				return;
			}
		}
	}
	offObserver(observer:IObserver):void
	{
		this.off(this.getObserverFun(observer));
	}
	once(listener:Function,thisObj:Object):void
	{
		this.addNoticeData(listener,thisObj,true);
	}
}