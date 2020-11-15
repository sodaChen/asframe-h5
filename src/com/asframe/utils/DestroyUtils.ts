/**
 * @DestroyUtils.as
 * 
 * @author sodaChen mail:asframe@qq.com
 * @version 1.0
 * <br>Copyright (C), 2013 FeiYin.com
 * <br>This program is protected by copyright laws.
 * <br>Program Name:Game3DAnd2D
 * <br>Date:2020-10-27
 */
/**
 * 销毁对象的工具方法，会自动寻找数组以及"destroy","dispose"这个几个因素来销毁对象
 * @author sodaChen
 * #Date:2020-10-27
 */
export class DestroyUtils
{
	/**
	 * 固定的销毁函数方法名
	 */
	private  static keyNames: string[] = ["destroy", "dispose"];
	static destroy(obj: any): void
	{
		if (obj instanceof Array)
		{
			for (var i: number = 0; i < obj.length; i++)
			{
				this.destroy(obj[i]);
			}
			return;
		}
		for (var i: number = 0; i < this.keyNames.length; i++)
		{
			if (obj[this.keyNames[i]])
			{
				obj[this.keyNames[i]]();
				return;
			}
		}
	}
}
