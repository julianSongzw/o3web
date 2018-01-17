using Newtonsoft.Json;
using PaintServiceAccess.BLL;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace PaintServiceAccess
{
  public class WctSearch
    {
      public string siteNbr{ get; set; }//点位编码

      public int spanMax { get; set; } //最大高度

      public int spanMin { get; set; } //最小高度

      public float valueMax { get; set; } //因子最小值

      public float valueMin { get; set; } //因子最大值

      public float step { get; set; }  //高度间隔

      public string factor { get; set; }  //因子

      public long stime_p { get; set; } //开始时间时间戳

      public long etime_p { get; set; } //结束时间时间戳

      public DateTime stime { get; set; } //开始时间

      public DateTime etime { get; set; } //结束时间

    }

  public class MgtSearch
  {
      public Point_ro[] randPoint { get; set; }//采样点 

  }

  public class ZxtSearch
  {
      public string siteNbr { get; set; }//点位编码

      public int spanMax { get; set; } //最大高度

      public int spanMin { get; set; } //最小高度

      public float valueMax { get; set; } //因子最小值

      public float valueMin { get; set; } //因子最大值

      public float step { get; set; }  //高度间隔

      public string factor { get; set; }  //因子

      public int up_deg { get; set; } //扫描仰角

      public int rotate_deg { get; set; } //旋转角度

      public int type { get; set; } //扫描类型 0 开始扫描 1结束扫描

      public DateTime stime { get; set; } //开始时间

      public DateTime etime { get; set; } //结束时间

  }


  public class RetMsg
  {
      public string imgUrl { get; set; } 

      public int ret { get; set; }  

      public string msg { get; set; }  

  }

  public class DbSearch
  {
      public static string PostRestReturnJsonStr(string url, string json)
      {
          string retJsonStr = null;
          try
          {
              var webClient = new WebClient { Encoding = Encoding.UTF8 };

              //设置请求的内容格式为application/json。
              webClient.Headers[HttpRequestHeader.ContentType] = "application/json";
              retJsonStr = webClient.UploadString(new Uri(url), "POST", json);
          }
          catch (Exception ex)
          {
              //Log.Error("获取POST方法返回的字符串出错：" + ex.Message);
          }
          return retJsonStr;
      }
      static int Interval = int.Parse(ConfigurationManager.AppSettings["interval"]);
      public static List<List<double>> GetDataSet(string snbr, DateTime sdt,DateTime edt)
      {
          List<List<double>> ret = new List<List<double>>();
          try
          {
              System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1)); // 当地时区
              long stimeStamp = (long)(sdt - startTime).TotalMilliseconds; 
              long etimeStamp = (long)(edt - startTime).TotalMilliseconds;  
             
              var json = JsonConvert.SerializeObject(new param
              {
                  factor = "o3",
                  scode = snbr, 
                  time_cj_start = stimeStamp, 
                  time_cj_end = etimeStamp
              });

              var retJsonStr = PostRestReturnJsonStr(ConfigurationManager.AppSettings["O3_db_uri"] + @"api/d_pcolors/baseData", json);
              if (retJsonStr!=null)
              {
                  var retS = JsonConvert.DeserializeObject<retS>(retJsonStr);
                  if (retS.ret==1)
                  {
                      int minute = ((int)(sdt.Minute / Interval)) * Interval;
                      var dt = new DateTime(sdt.Year, sdt.Month, sdt.Day, sdt.Hour, minute, 0, 0);
                      int i = 0;
                      while (dt<edt)
                      {
                          List<double> tp = new List<double>();
                          if (i < retS.timeArr.Length&&retS.timeArr[i] == (long)(dt - startTime).TotalMilliseconds)
                          {
                              foreach (var itemV in retS.valueArr[i])
                              {
                                  tp.Add(itemV);
                              }
                              i++;
                          }
                          else {
                              for (int j = 0; j < retS.valueArr[0].Length; j++)
                              {
                                  tp.Add(-999);
                              }
                          }
                          ret.Add(tp);
                          dt=dt.AddMinutes(Interval);
                      }
                     
                  }
              }

             
          }
          catch (Exception ex)
          {
              //Log.Error("获取POST方法返回的字符串出错：" + ex.Message);
          }
          return ret;
      }

      public static int InsertMgt(paramZxt_db pa)
      {
          int ret = 0;
          try
          { 
              var json = JsonConvert.SerializeObject(pa); 
              var retJsonStr = PostRestReturnJsonStr(ConfigurationManager.AppSettings["O3_db_uri"] + @"api/d_cones/add", json);
              if (retJsonStr != null)
              {
                  var retS = JsonConvert.DeserializeObject<retS>(retJsonStr);
                  ret = retS.ret;
              } 
          }
          catch (Exception ex)
          {
              //Log.Error("获取POST方法返回的字符串出错：" + ex.Message);
          }
          return ret;
      }

      public class param
      {

          public string factor { get; set; }

          public string scode { get; set; } 

          public long time_cj_start { get; set; }

          public long time_cj_end { get; set; }

      }

      public class retS
      {

          public int ret { get; set; }

          public string msg { get; set; }

          public float[][] valueArr { get; set; }

          public long[] timeArr { get; set; } 

      } 
  }

  public class paramZxt_db
  {

      public string factor { get; set; }

      public string scode { get; set; }

      public int[] deg { get; set; }

      public string[] value { get; set; }

      public long time { get; set; }

  }
}
