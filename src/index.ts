import { asf } from "./com/asframe/asf";
import { HTML5WebSocket } from "./com/asframe/socket/HTML5WebSocket";

console.log("Hello TypeScript!");
//初始化平台框架
asf.init();
asf.ISocket = HTML5WebSocket;
asf.timer.doLoop(1000,function()
{
    console.log("1秒中执行一次:" + asf.getTimer());
},this);