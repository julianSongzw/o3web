using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using LESSAIS.Common;
using LESSAIS.Common.Log;
using Newtonsoft.Json;
using System.Web;
using System.IO;
using System.Xml;
using System.Text;
using System.Threading;
using LidarFileAndData;
using PaintServiceAccess.BLL;
using System.Drawing;
using Newtonsoft.Json.Linq;
namespace PaintServiceAccess
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Single, IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class Rest:IRest
    {
        private static readonly Logger Log = LogManager.GetLogger("PaintLog", "PaintLog");

        public void Init()
        {
            MonitorPaint mp = new MonitorPaint();
            mp.Init();
        }
        public string WctPaint(string warnStr)
        {
            Log.Info("收到伪彩图绘制请求："+warnStr);
            if (ConfigurationManager.AppSettings["isWct"].ToString() == "1")
            {

                try
                {

                    WctSearch obj = JsonConvert.DeserializeObject<WctSearch>(warnStr);

                    if (obj.factor == "o3" && obj.siteNbr == ConfigurationManager.AppSettings["test_site"].Split(',')[0])
                    {
                        //ExportPara3w4c exp = new ExportPara3w4c();
                        //try
                        //{
                        //    exp.Files_Load(ConfigurationManager.AppSettings["O3_uri"], 6000, obj.stime, obj.etime);
                        //}
                        //catch (System.Exception ex)
                        //{
                        //    Log.Error("加载数据源文件失败");
                        //}

                        WctPaint_Exe pp = new WctPaint_Exe();
                        if (pp.InitePaint(100, 200, obj.step, obj.spanMax, obj.spanMin, obj.valueMax, obj.valueMin))
                        {
                            var temp = DbSearch.GetDataSet(obj.siteNbr, obj.stime, obj.etime);
                            Image image = pp.setValue_skipdays(temp);
                            if (image != null)
                            {
                                string path_1 = ConfigurationManager.AppSettings["O3_wct_uri"];
                                string path_2 = DateTime.Now.ToString("yyyyMMdd");
                                TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
                                string path_3 = Convert.ToInt64(ts.TotalSeconds).ToString() + ".png";
                                if (!Directory.Exists(path_1 + @"\" + path_2))
                                {
                                    Directory.CreateDirectory(path_1 + @"\" + path_2);
                                }

                                image.Save(path_1 + @"\" + path_2 + @"\" + path_3, System.Drawing.Imaging.ImageFormat.Png);

                                Log.Info("返回伪彩图地址：" + path_2 + "/" + path_3);

                                // return "{ret:1,imgUrl:" + path_2 +"/"+ path_3 + "}"; 

                                return JsonConvert.SerializeObject(new RetMsg
                                {
                                    ret = 1,
                                    imgUrl = path_2 + "/" + path_3
                                });

                            }
                        }
                    }

                }
                catch (Exception ex)
                {
                    Log.Error("返回伪彩图失败");
                    return JsonConvert.SerializeObject(new RetMsg
                    {
                        ret = 1,
                        msg = "返回图片失败:" + ex.Message,
                        imgUrl = "default.jpg"
                    });
                }
            }
            Log.Error("返回伪彩图失败");
            return JsonConvert.SerializeObject(new RetMsg
            {
                ret = 1,
                imgUrl="default.jpg",
                msg = "返回图片失败"
            });
             //return "{ret:0,imgUrl:返回图片失败}"; 
        }

        public string MgtPaint(string warnStr)
        {
            Log.Info("收到玫瑰图绘制请求：" + warnStr);

            if (ConfigurationManager.AppSettings["isMgt"].ToString() == "1")
            {
                try
                {           
                    //MgtSearch obj = JsonConvert.DeserializeObject<MgtSearch>(warnStr); 

                    MgtPaint_Exe pp = new MgtPaint_Exe();
                    if (pp.InitePaint(300, 300))
                    {
                        Image image = pp.setValue_skipdays(null);
                        if (image != null)
                        {
                            string path_1 = ConfigurationManager.AppSettings["O3_wct_mgt"];
                            string path_2 = DateTime.Now.ToString("yyyyMMdd");
                            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
                            string path_3 = Convert.ToInt64(ts.TotalSeconds).ToString() + ".png";
                            if (!Directory.Exists(path_1 + @"\" + path_2))
                            {
                                Directory.CreateDirectory(path_1 + @"\" + path_2);
                            }

                            image.Save(path_1 + @"\" + path_2 + @"\" + path_3, System.Drawing.Imaging.ImageFormat.Png);

                            Log.Info("返回玫瑰图地址：" + path_2 + "/" + path_3);

                            // return "{ret:1,imgUrl:" + path_2 +"/"+ path_3 + "}"; 

                            return JsonConvert.SerializeObject(new RetMsg
                            {
                                ret = 1,
                                imgUrl = path_2 + "/" + path_3
                            });

                        }
                    }


                }
                catch (Exception ex)
                {
                    Log.Error("返回玫瑰图失败");
                    return JsonConvert.SerializeObject(new RetMsg
                    {
                        ret = 1,
                        msg = "返回玫瑰图失败:" + ex.Message,
                        imgUrl = "default.jpg"
                    });
                }
            }
         
           
            Log.Error("返回玫瑰图失败");
            return JsonConvert.SerializeObject(new RetMsg
            {
                ret = 1,
                imgUrl = "default.jpg",
                msg = "返回玫瑰图失败"
            });
            
        }

        public string ZxtPaint(string warnStr)
        {
            Log.Info("收到锥形图绘制请求：" + warnStr);
            if (ConfigurationManager.AppSettings["isZxt"].ToString() == "1")
            {

                try
                {
                    //ZxtSearch obj = new ZxtSearch { 
                    //siteNbr="bjj",
                    // factor="o3",
                    // stime=Convert.ToDateTime("2017-09-27 15:00:00"),
                    //etime = Convert.ToDateTime("2017-09-28 23:00:00"),
                    // rotate_deg=36,
                    //  up_deg=80,
                    //   type=0, 
                    //     valueMax=500,
                    //     valueMin=0
                    //};
                    ZxtSearch obj = JsonConvert.DeserializeObject<ZxtSearch>(warnStr);

                  
                    ZxtPaint_Exe pp = new ZxtPaint_Exe();
                    if (pp.InitePaint(300, 300, obj.up_deg, obj.rotate_deg, obj.valueMax, obj.valueMin,obj.siteNbr,obj.etime))
                    {
                        pp.setValue_skipdays(DbSearch.GetDataSet(obj.siteNbr, obj.stime, obj.etime));
                    }
                    Log.Info("锥形图开始绘制");
                    return JsonConvert.SerializeObject(new RetMsg
                    {
                        ret = 1,
                        msg = "锥形图开始绘制"
                    }); 

                }
                catch (Exception ex)
                {
                    Log.Error("锥形图绘制失败");
                    return JsonConvert.SerializeObject(new RetMsg
                    {
                        ret = 0,
                        msg = "锥形图绘制失败:" + ex.Message, 
                    });
                }
            }
            Log.Error("锥形图拒绝绘制");
            return JsonConvert.SerializeObject(new RetMsg
            {
                ret = 0,
                msg = "锥形图拒绝绘制"
            }); 
        }

        /// <summary>        
        /// 时间戳转为C#格式时间        
        /// </summary>        
        /// <param name=”timeStamp”></param>        
        /// <returns></returns>        
        private DateTime ConvertStringToDateTime(string timeStamp)
        {
            DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));
            long lTime = long.Parse(timeStamp + "0000");
            TimeSpan toNow = new TimeSpan(lTime);
            return dtStart.Add(toNow);
        } 
    }

     
}
