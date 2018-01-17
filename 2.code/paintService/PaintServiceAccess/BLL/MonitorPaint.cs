using LESSAIS.Common.Log;
using LidarFileAndData;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace PaintServiceAccess.BLL
{
  public   class MonitorPaint
    {
     private static readonly Logger Log = LogManager.GetLogger("PaintLog", "PaintLog");
     static string[] Sites;
     static int Left_time=0;
     static int Interval;
     static Timer[] _autoUpdateTimers;
      
     static Dictionary<string, List<List<double>>> CacheDataSource = new Dictionary<string, List<List<double>>>();
     static Dictionary<string, DateTime> CachePreTime = new Dictionary<string, DateTime>();

      public void Init()
      {
          //初始化条件
          Left_time = int.Parse(ConfigurationManager.AppSettings["test_time_span"]);
          Sites = ConfigurationManager.AppSettings["test_site"].Split(',');
          Interval = int.Parse(ConfigurationManager.AppSettings["interval"]);
          //初始化画图定时器
          _autoUpdateTimers = new Timer[Sites.Count()];
          for (int i = 0; i < Sites.Count(); i++)
          {
              CacheDataSource.Add(Sites[i],new List<List<double>>());
              CachePreTime.Add(Sites[i], DateTime.Now.AddDays(-(Left_time+1)));
              string path= ConfigurationManager.AppSettings["O3_wct_monitor"];
              if (!Directory.Exists(path + @"\" + Sites[i]))
              {
                  Directory.CreateDirectory(path + @"\" + Sites[i]);
              }
              _autoUpdateTimers[i] = new System.Threading.Timer(Refresh, Sites[i], 0, Interval * 60 * 1000);
              
          }
        }


        private static void Refresh(object sender)
        {
            string snbr = sender.ToString();

            try
            {
                ExportPara3w4c exp = new ExportPara3w4c();
                var obj = new WctSearch
                {
                    siteNbr = snbr,
                    step = 15,
                    factor = "o3",
                    stime = CachePreTime[snbr],
                    etime = DateTime.Now.AddDays(-Left_time),
                    spanMax = 45000,
                    spanMin = 0,
                    valueMax = 500,
                    valueMin = 0

                };
                CachePreTime[snbr] = obj.etime;
                int minute = ((int)(obj.etime.Minute / Interval)) * Interval;
                CacheDataSource[snbr] = DbSearch.GetDataSet(obj.siteNbr, obj.stime, obj.etime);


                WctPaint_Exe pp = new WctPaint_Exe();
                if (pp.InitePaint(100, 200, obj.step, obj.spanMax, obj.spanMin, obj.valueMax, obj.valueMin))
                {
                    Image image = pp.setValue_skipdays(CacheDataSource[snbr]);
                    if (image != null)
                    {
                        string path = ConfigurationManager.AppSettings["O3_wct_monitor"] + @"\" + snbr + @"\" + DateTime.Now.ToString("yyyyMMdd");
                        string fileName = obj.etime.Hour.ToString() + minute.ToString() + ".png";
                        if (!Directory.Exists(path))
                        {
                            Directory.CreateDirectory(path);
                        }

                        image.Save(path+ @"\" + fileName, System.Drawing.Imaging.ImageFormat.Png);
                        Log.Info("生成实时伪彩图：站点编码 " + snbr + "    当前时间 " + obj.etime + "   采集数据 " + CacheDataSource[snbr].Count);
                    }
                }
            }
            catch (Exception e)
            {
                
            }

           
        }
      
    }
}
