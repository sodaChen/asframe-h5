/**
 * 网络错误消息数据结构
 *
 * @author sodaChen
 * @date 2020年10月29日
 */
export class NetErrorData
{
    cmd:number;
    code:number;
    errorMsg:string;

    constructor(cmd:number,code:number,errorMsg:string)
    {
        this.cmd = cmd;
        this.code = code;
        this.errorMsg = errorMsg;
    }
}
