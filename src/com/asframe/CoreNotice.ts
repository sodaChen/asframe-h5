/**
 * @CoreNotice.ts
 *
 * @author sodaChen mail:asframe#qq.com
 * @version 1.0
 * <br>Copyright (C), 2012 ASFrame.com
 * <br>This program is protected by copyright laws.
 * <br>Program Name:Collections
 * <br>Date:2020/10/17
 */
/**
 * 核心库定义的常量集
 * @author sodaChen
 * Date:2020/10/17
 */
export class CoreNotice
{
    ///////////////////////socket相关事件/////////////////////
    /** 服务器返回错误的事件派发 **/
    static Cmd_Error_Code: string = "Cmd_Error_Code";
    /** socket打开 **/
    static SOCEKT_OPEN: string = "socketOpen";
    /** socket关闭 **/
    static SOCEKT_CLOSE: string = "socketClose";
    /** socket链接失败，服务器没开 **/
    static SOCEKT_ERROR: string = "socketError";
    /** socket链接失败，服务器没开 **/
    static Send_Data_ERROR: string = "Send_Data_ERROR";
    /** 网关结果 **/
    static Gateway_Result: string = "Gateway_Result";
    // /** 取消断线重连 **/
    // static Cancel_Socket_Link: string = "Cancel_Socket_Link";
    // /** 断线重连 **/
    // static Socket_Break_Link: string = "Socket_Break_Link";
}