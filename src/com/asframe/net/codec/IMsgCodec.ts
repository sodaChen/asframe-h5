import { ByteArray } from "../bytes/ByteArray";

/**
 * 消息的编码和解码接口
 * @author sodaChen
 * Date:2020/10/23
 */
export interface IMsgCodec
{
    /**
     * 编码
     * @param data
     */
    code(data:any):ByteArray;
    /**
     * 解码
     * @param bytes
     */
    decode(backCmd:number,bytes:ByteArray):any;
    /**
     * 本地二进制解析器解码。和网络需要判断字节长度的不一样
     * @param bytes
     */
    localDecode(backCmd:number,bytes:ByteArray):any;
}