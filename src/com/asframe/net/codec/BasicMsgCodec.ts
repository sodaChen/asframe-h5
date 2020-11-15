import { ByteArray } from "../../bytes/ByteArray";

/**
 * @BasicMsgCoder.ts
 * @author sodaChen mail:asframe#qq.com
 * @version 1.0
 * <br> Copyright (c) 2012-present, asframe.com
 * <br>Program Name:ASFrameTS
 * <br>Date:2020/10/23
 */
/**
 * 实现基础的消息解码。二进制，长度是short类型
 * @author sodaChen
 * Date:2020/10/23
 */
export class BasicMsgCodec
{
    /** 
     * 消息长度，子类可以根据需要进行设置
     **/
    protected msgLen:number = 12;

    public constructor()
    {
    }

    /**
     * 检测能否继续解析消息体
     * @param bytes
     * @returns {boolean}
     */
    protected isCheckout(bytes:ByteArray):boolean
    {
        this.msgLen = bytes.readShort();
        if(this.msgLen == bytes.bytesAvailable)
            return true;
        return false;
    }
}