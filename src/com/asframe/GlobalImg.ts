/**
 * 全局图像Image的设置，这个主要用于http相关的处理
 * @author sodaChen
 * Date:2020-10-20
 */
/** 普通图片的路径头 */
var imgRoot:string = "";
/** 普通图片的版本号 */
var imgRootVer:string = "2020426";
/** 本地图片的路径头 */
var imgLocalRoot:string = "";
/** 本地图片的版本号 */
var imgLocalRootVer:string = "2020426";

/**
 * 初始化设置图像url的相关基础参数
 * @param _imgRoot 
 * @param _imgRootVer 
 * @param _imgLocalRoot 
 * @param _imgLocalRootVer 
 */
export function initImgParam(_imgRoot:string,_imgRootVer:string,_imgLocalRoot:string,_imgLocalRootVer:string):void
{
    imgRoot = _imgRoot;
    imgRootVer = _imgRootVer;
    imgLocalRoot = _imgLocalRoot;
    imgLocalRootVer = _imgLocalRootVer;
}
/**
 * 对远程图像的url进行一个封装，主要是封装图像的头和版本控制
 * @param url 
 * @returns 新的图像url
 */
export function imgUrl(url:string):string
{
    if (!url) return '';
    // url = url.slice(0, 1) !== '/' ? '/' + url : url;
    url = url.slice(0, 1) !== '/' ? url.slice(0, 1) !== 'h' ? '/' + url : url : url;
    return _createImageUrl(url,imgRoot,imgRootVer);
}
export function imgUrlSmall(url:string):string
{
    if (!url) return '';
    let index = url.lastIndexOf(".");
    if(index != -1)
    {
        let first = url.substring(0,index);
        let subxx = url.substring(index,url.length);
        url = first+ '_small' + subxx;
    }
    url = url.slice(0, 1) !== '/' ? url.slice(0, 1) !== 'h' ? '/' + url : url : url;
    return _createImageUrl(url,imgRoot,imgRootVer);
}
export function imgUrlBig(url:string):string
{
    if (!url) return '';
    let index = url.lastIndexOf(".");
    if(index != -1)
    {
        let first = url.substring(0,index);
        let subxx = url.substring(index,url.length - 1);
        url = first+ '_big' + subxx;
    }
    url = url.slice(0, 1) !== '/' ? url.slice(0, 1) !== 'h' ? '/' + url : url : url;
    return _createImageUrl(url,imgRoot,imgRootVer);
}
/**
 * 对本地图像的url进行一个封装，主要是封装图像的头和版本控制
 * @param url 
 * @returns 新的图像url
 */
export function imgLocalUrl(url:string):string
{
    return _createImageUrl(url,imgLocalRoot,imgLocalRootVer);
}
/**
 * 检测图像的url信息
 * @param url 
 * @param ver 
 */
function _createImageUrl(url:string,root:string,ver:string):string
{
    if(!url)
    {
        console.error("出现加载的图像url为空的情况:" + url);
        return url;
    }
    if (url.indexOf("http") >= 0) 
    {
        if(url.indexOf("?") >=0)
        {
            if(url.indexOf("v=") >=0)
            {
                return url;
            }
        }
        return url + "?v=" + ver;
    }
    if(url.indexOf("v=") >=0)
    {
        return root + url;
    }
    //两种都需要添加的方式
    return root + url + "?v=" + ver;
}