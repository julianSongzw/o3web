/**

 * @Title: windRose.js
 * @Description:  分速玫瑰图
 * @author jiezd@ahtsoft.com （揭志东）
 * @date 2017年12月12日
 * @version V1.0
 * @Revision : $Rev$
 * @Id: $Id$
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
import React from "react";
// 引入 ECharts 主模块
import echarts from 'echarts'

class WindRose extends React.Component {



    componentDidMount(){
        let arr=[[0,1,200],[0,2,130],[0,3,220],[0,4,230],[0,5,320],[0,6,420],[0,15,520],[0,20,620],[0,30,720],[0,40,802],[0,50,920],[0,60,1000],[0,70,20],[0,80,102],[0,90,220],[0,100,230],[0,110,320],[0,120,420],[0,130,520],[0,140,620],[0,150,720],[0,160,820],[0,170,920],[0,180,120],[0,190,120],[0,200,220],[0,210,120],[0,220,120],[0,230,120],[0,240,120],[4,4,230],[4,5,320],[4,6,420],[4,15,520],[4,20,620],[4,30,702],[4,40,820],[4,50,920],[4,60,1000],[4,70,20],[4,80,120],[4,90,220],[4,100,230],[4,110,320],[4,120,420],[4,130,520],[4,140,620],[4,150,720],[4,160,820],[4,170,920],[4,180,120],[8,1,20],[8,2,130],[8,3,220],[8,4,230],[8,5,320],[8,6,420],[8,15,520],[8,20,620],[8,30,702],[8,40,802],[8,50,902],[8,60,1000],[8,70,20],[8,80,102],[8,90,202],[8,100,203],[8,110,302],[8,120,402],[8,130,502],[8,140,620],[8,150,702],[8,160,802],[8,170,920],[8,180,102],[16,1,20],[16,2,103],[16,3,202],[16,4,230],[16,5,320],[16,6,420],[16,15,502],[16,20,602],[16,30,702],[16,40,802],[16,50,902],[16,60,1000],[16,70,800],[16,80,880],[16,90,202],[16,100,203],[16,110,320],[16,120,402],[16,130,502],[16,140,620],[16,150,720],[16,160,802],[16,170,920],[16,180,102],[24,1,20],[24,2,103],[24,3,202],[24,4,230],[24,5,320],[24,6,402],[24,15,520],[24,20,602],[24,30,702],[24,40,802],[24,50,902],[24,60,1000],[24,70,20],[24,80,120],[24,90,220],[24,100,230],[24,110,320],[24,120,402],[24,130,502],[24,140,602],[24,150,702],[24,160,820],[24,170,920],[24,180,102],[30,1,20],[30,2,130],[30,3,202],[30,4,203],[30,5,320],[30,6,420],[30,15,520],[30,20,602],[30,30,720],[30,40,820],[30,50,920],[30,60,1000],[30,70,20],[30,80,120],[30,90,220],[30,100,203],[30,110,302],[30,120,402],[30,130,502],[30,140,620],[30,150,720],[30,160,820],[30,170,920],[30,180,120],[38,1,20],[38,2,130],[38,3,220],[38,4,203],[38,5,302],[38,6,42],[38,15,52],[38,20,62],[38,30,72],[38,40,82],[38,50,92],[38,60,100],[38,70,2],[38,80,1211],[38,90,2211],[38,100,1323],[38,110,1755],[38,120,1942],[38,130,1520],[38,140,1620],[38,150,1702],[38,160,1802],[38,170,1920],[38,180,1120],[46,1,1223],[46,2,1134],[46,3,1223],[46,4,1234],[46,5,1342],[46,6,1423],[46,15,52],[46,20,62],[46,30,72],[46,40,82],[46,50,92],[46,60,100],[46,70,2],[46,80,12],[46,90,22],[46,100,263],[46,110,328],[46,120,42],[52,1,200],[52,2,103],[52,3,292],[52,4,283],[52,5,362],[52,6,425],[52,15,525],[52,20,625],[52,30,725],[52,40,844],[52,50,922],[52,60,1020],[52,70,789],[52,80,12],[52,90,220],[52,100,523],[52,110,321]];
        /*
         设置一些canvas常量
         */
        let myCanvas = document.getElementById("myCanvas");
        let ctx = myCanvas.getContext("2d");
        ctx.translate(myCanvas.width/2, myCanvas.height/2); //移动canvas的中心店

        //new一个windrose对象
        let windrose=new DrawWindRose(myCanvas);

        windrose.drawDiskAndLine(arr);
    }


    render(){
        return (
            <div id="windRose" style={{height:"500px",width:"90%",marginLeft:"5%",textAlign:"center"}}>
                <canvas  id="myCanvas" width="500"  height="500">正在查询...</canvas>
            </div>
        );
    }
}

class DrawWindRose{
    // 构造
    constructor(canvas){
        this.diskAndLineColor='#e3e3e3';
        this.canvas=canvas;
        this.ctx=canvas.getContext("2d");
        this.width=canvas.width;
        this.height=canvas.height;
        this.dis=this.width/12-4;
    }
    //绘制基础圆盘总方法
    drawDiskAndLine (arr){
        //6个圆圈
        this.drawSolidDisk(0,0,this.dis*6);
        this.drawSolidDisk(0,0,this.dis,true);
        this.drawSolidDisk(0,0,this.dis*2,true);
        this.drawSolidDisk(0,0,this.dis*3,true);
        this.drawSolidDisk(0,0,this.dis*4,true);
        this.drawSolidDisk(0,0,this.dis*5,true);


        this.drawDashedLineAndDir(0,0,0,-this.dis*6,"N",-8,-this.dis*6-3);//正北
        let nex=this.dis*6*Math.cos(Math.PI/180*45),
            ney=-this.dis*6*Math.sin(Math.PI/180*45);
        this.drawDashedLineAndDir(0,0,nex,ney,"NE",nex+4,ney); //东北
        this.drawDashedLineAndDir(0,0,this.dis*6,0,"E",this.dis*6+3,6); //正东
        let sex=this.dis*6*Math.cos(Math.PI/180*45),
            sey=this.dis*6*Math.sin(Math.PI/180*45);
        this.drawDashedLineAndDir(0,0,sex,sey,"SE",sex+4,sey+14); //东南
        this.drawDashedLineAndDir(0,0,0,this.dis*6,"S",-5,this.dis*6+18); //正南
        let swx=-this.dis*6*Math.cos(Math.PI/180*45),
            swy=this.dis*6*Math.sin(Math.PI/180*45);
        this.drawDashedLineAndDir(0,0,swx,swy,"SW",swx-36,swy+15); //西南
        this.drawDashedLineAndDir(0,0,-this.dis*6,0,"W",-this.dis*6-25,5); //正西
        let nwx=-this.dis*6*Math.cos(Math.PI/180*45),
            nwy=-this.dis*6*Math.sin(Math.PI/180*45);
        this.drawDashedLineAndDir(0,0,nwx,nwy,"NW",nwx-36,nwy-3); //西北


        //调用添加坐标方法
        this.drawPoint(arr);

    }

    //绘制实心圆  lineDash:true 表示是虚线圆
    drawSolidDisk(x,y,r,lineDash){
        if(lineDash){
            this.ctx.setLineDash([12, 5]);
        }
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2*Math.PI);
        this.ctx.strokeStyle = this.diskAndLineColor;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    //绘制虚线和写方向 开始坐标 结束坐标
    drawDashedLineAndDir(sx,sy,ex,ey,text,tx,ty){
        this.ctx.setLineDash([12, 5]);
        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(ex,ey);
        this.ctx.stroke();
        this.ctx.font = "20px 微软雅黑";
        this.ctx.fillStyle = this.diskAndLineColor;
        this.ctx.fillText(text,tx,ty);
    }

    //根据数值0-100生成颜色值
    getColorByBaiFenBi(bili){
        let colorArr=[['rgba(0,0,255,1)','rgba(0,0,255,0)'],['rgba(0,114,247,1)','rgba(0,114,247,0)'],['rgba(5,219,255,1)','rgba(5,219,255,0)'],['rgba(46,255,250,1)','rgba(46,255,250,0)'],['rgba(108,253,255,1)','rgba(108,253,255,0)'],['rgba(144,250,228,1)','rgba(144,250,228,0)'],['rgba(69,255,116,1)','rgba(69,288,116,0)'],['rgba(5,253,16,1)','rgba(5,253,16,0)'],['rgba(81,250,7,1)','rgba(81,250,7,0)'],['rgba(155,255,2,1)','rgba(155,255,2,0)'],['rgba(212,254,0,1)','rgba(212,254,0,0)'],['rgba(233,255,0,1)','rgba(233,255,0,0)'],['rgba(242,253,0,1)','rgba(242,253,0,0)'],['rgba(255,244,0,1)','rgba(255,244,0,0)'],['rgba(255,101,3,1)','rgba(255,101,3,0)'],['rgba(255,161,0,1)','rgba(255,161,0,0)'],['rgba(255,122,0,1)','rgba(255,122,0,0)'],['rgba(246,83,4,1)','rgba(246,83,4,0)'],['rgba(255,39,0,1)','rgba(255,39,0,0)'],['rgba(252,0,5,1)','rgba(252,0,5,0)']];
        let ceng=parseInt(bili/100);
        ceng = ceng >19 ? 19:ceng;
        return colorArr[ceng];
    }


    //根据数据绘制渐变点图
    drawPoint(arr){
        for(let i=0,le=arr.length;i<le;i++){
            let point=arr[i],
                x=point[0],
                y=point[1],
                color=this.getColorByBaiFenBi(point[2]);
            let color1=color[0],
                color2=color[1];
            let radgrad = this.ctx.createRadialGradient(x, y,0,x, y,10);
            radgrad.addColorStop( 0, color1);
            radgrad.addColorStop( 1, color2);
            this.ctx.fillStyle = radgrad;
            this.ctx.fillRect( x - 8, y - 8, 16, 16);
        }
    }

}








export default  WindRose;