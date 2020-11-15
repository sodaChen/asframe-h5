/**
 * Created by sodaChen on 2020/10/10.
 */
import { ByteArray } from "../bytes/ByteArray";

/**
 * 网络工具类，封装了可变数值的读写
 * @author sodaChen
 */
export class NetUtils
{
    /**
     * 写可变的number数值
     * @param bytearr
     * @param element
     */
    static writeVaryNum(bytearr: ByteArray, element: number): void
    {
        // try
        // {
            if (element < 122 && element > -128)
            {//byte
                bytearr.writeByte(element);
            }
            else if (element < 128 && element > 122)
            {//byte，主要是处理 122~127的byte
                bytearr.writeByte(122);
                bytearr.writeByte(element);
            }
            else if (element < 32768 && element > -32768)
            {//short
                bytearr.writeByte(123);
                bytearr.writeShort(element);
            }
            else if (element < 2147483647 && element > -2147483648)
            {//int
                bytearr.writeByte(124);
                bytearr.writeInt(element);
            }
            else
            {//long
                bytearr.writeByte(125);
                bytearr.writeDouble(element);
            }
        // }
        // catch (Error)
        // {
        //     alert(Error.stack);
        // }
    }
    // if(val < 122 && val > -128){//byte
    //     out.writeByte((byte)val);
    // }else if(val < 128 && val > 122){//byte
    //     out.writeByte(122);
    //     out.writeByte((byte)val);
    // }else if(val < 32767 && val > -32768){//short
    //     out.writeByte(123);
    //     out.writeShort((short)val);
    // }else if(val < 2147483647 && val > -2147483648){//int
    //     out.writeByte(124);
    //     out.writeInt((int)val);
    // }else{
    //     out.writeByte(125);
    //     out.writeDouble((double)val);
    // }



    /**
     * 读可变的number数值
     * @param buf
     * @returns {number}
     */
    static readVaryNum(buf: ByteArray)
    {
        var type = buf.readByte();
        if (type < 122 && type > -128) return type;
        else if (type == 122) return buf.readByte();
        else if (type == 123) return buf.readShort();
        else if (type == 124) return buf.readInt();
        else if (type == 125) return buf.readDouble();
        else if (type == 126) return buf.readFloat();
        else if (type == 127) return buf.readDouble();
        return 0;
    }
}