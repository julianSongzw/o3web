using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using LidarFileAndData;
using System.Threading;
using System.IO;
using System.Net;
using Newtonsoft.Json;
namespace testGrap
{
    public partial class Form1 : Form
    {
        // png 处理
        ZxtPaint pp = new ZxtPaint();

        DateTime initTime = Convert.ToDateTime("2017-12-27 17:50:00");
        //LdPaint pp = new LdPaint();
                 
        public Form1()
        {
          
            InitializeComponent();

            ReadLaserLiderFileCfg.ReadConfiguration();

        }

        private void button1_Click(object sender, EventArgs e)
        {
            string item = "355消光";

            TimeSpan ts = new TimeSpan(7, 0, 0, 0);
            if (PickerQueryEndDate.Value - PickerQueryStartDate.Value > ts)
            {

                MessageBox.Show("查询范围已超过7天！", "确认", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            Thread t = new Thread(delegate()
            {

                creatPng(item, PickerQueryStartDate.Value, PickerQueryEndDate.Value);

                this.Invoke((System.Action)delegate()
                {
                    Cursor = Cursors.Default;
                });

               
            });
            t.IsBackground = true;
            t.Start();   
        }

        private void creatPng(string item,DateTime st,DateTime et)
        {
            //intoDBS(st,et);
            ExportPara3w4c exp = new ExportPara3w4c();
            int time = (et - st).Days + 1;
            try
            {
                exp.Files_Load(@"E:\AH_Project\环保项目\安光源码\气溶胶分析软件", 6000, st, et);
            }
            catch (System.Exception ex)
            {
                throw new Exception("加载数据源文件失败");
            }

            Dictionary<string, List<List<double>>> getPngvalue = new Dictionary<string, List<List<double>>>();
            getPngvalue.Add("355消光", exp.datapara.fOutBinsExtinction355);

            getPngvalue.Add("1064消光", exp.datapara.fOutBinsExtinction1064);
            getPngvalue.Add("波长指数", exp.datapara.fWavelengthExponents);
            getPngvalue.Add("颗粒物", exp.datapara.fPM10);
            getPngvalue.Add("退偏振比", exp.datapara.fDepolRatio);
            getPngvalue.Add("污染物分布", exp.datapara.fPollution);

            Dictionary<string, List<double>> getTxtvalue = new Dictionary<string, List<double>>();
            getTxtvalue.Add("边界层", exp.datapara.fPBL);
            getTxtvalue.Add("光学厚度", exp.datapara.fOPD);
            getTxtvalue.Add("能见度", exp.datapara.fVisibility);


            if (getPngvalue.ContainsKey(item))
            {

                double maxvalue = 0;
                double minvalue = 0;
                if (ReadLaserLiderFileCfg.itemRange.ContainsKey(item))
                {
                    maxvalue = ReadLaserLiderFileCfg.itemRange[item].Item1;
                    minvalue = ReadLaserLiderFileCfg.itemRange[item].Item2;
                }
                if (pp.InitePaint(300, 300, ReadLaserLiderFileCfg.step, ReadLaserLiderFileCfg.etHeight, ReadLaserLiderFileCfg.stHeight, maxvalue, minvalue))
                {
                    Image image = pp.setValue_skipdays(exp.datapara.fPM10, exp.datapara.filenamelist, item, time, st, et);
                    if (image != null)
                    {
                        //image = pp.Rotate_x_init();
                        string tempPath2 = @"E:\AH_Project\环保项目\安光源码\" + DateTime.Now.ToString("yyyyMMdd");

                        if (!Directory.Exists(tempPath2))
                        {
                            Directory.CreateDirectory(tempPath2);
                        }

                        image.Save(tempPath2 + @"\" + item + ".png", System.Drawing.Imaging.ImageFormat.Png);

                        panel1.BackgroundImage = image;
                        panel1.BackgroundImageLayout = ImageLayout.Zoom;

                    }
                }

            }
           
        }

        private void button2_Click(object sender, EventArgs e)
        {

            Image image = pp.Rotate_x();
            if (image != null)
            {
                string tempPath2 = @"E:\AH_Project\环保项目\安光源码\" + DateTime.Now.ToString("yyyyMMdd");

                if (!Directory.Exists(tempPath2))
                {
                    Directory.CreateDirectory(tempPath2);
                }

                image.Save(tempPath2 + @"\ddd.png", System.Drawing.Imaging.ImageFormat.Png);

                panel1.BackgroundImage = image;
                panel1.BackgroundImageLayout = ImageLayout.Zoom;

            }
        }

        private void button3_Click(object sender, EventArgs e)
        {
            Image image = pp.Rotate_y();
            if (image != null)
            {
                string tempPath2 = @"E:\AH_Project\环保项目\安光源码\" + DateTime.Now.ToString("yyyyMMdd");

                if (!Directory.Exists(tempPath2))
                {
                    Directory.CreateDirectory(tempPath2);
                }

                image.Save(tempPath2 + @"\ddd.png", System.Drawing.Imaging.ImageFormat.Png);

                panel1.BackgroundImage = image;
                panel1.BackgroundImageLayout = ImageLayout.Zoom;

            }
        }

        private void button4_Click(object sender, EventArgs e)
        {
            Image image = pp.Rotate_z();
            if (image != null)
            {
                string tempPath2 = @"E:\AH_Project\环保项目\安光源码\" + DateTime.Now.ToString("yyyyMMdd");

                if (!Directory.Exists(tempPath2))
                {
                    Directory.CreateDirectory(tempPath2);
                }

                image.Save(tempPath2 + @"\ddd.png", System.Drawing.Imaging.ImageFormat.Png);

                panel1.BackgroundImage = image;
                panel1.BackgroundImageLayout = ImageLayout.Zoom;

            }
        }


        void intoDBS(DateTime st, DateTime et)
        {
            ExportPara3w4c exp = new ExportPara3w4c();
            int time = (et - st).Days + 1;
            try
            {
                exp.Files_Load(@"E:\AH_Project\环保项目\安光源码\气溶胶分析软件", 6000, st, et);
                Dictionary<string, List<List<double>>> getPngvalue = new Dictionary<string, List<List<double>>>();
                //getPngvalue.Add("355消光", exp.datapara.fOutBinsExtinction355);

                getPngvalue.Add("1064消光", exp.datapara.fOutBinsExtinction1064);

                getPngvalue.Add("颗粒物", exp.datapara.fPM10);

                getPngvalue.Add("退偏振比", exp.datapara.fDepolRatio);


                for (int i = 0; i < exp.datapara.fPM10.Count()&&i<24*12; i++)
                {
                    initTime = initTime.AddMinutes(5);
                    System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1)); // 当地时区
                    long timeStamp = (long)(initTime - startTime).TotalMilliseconds; // 相差毫秒数
                    var json = JsonConvert.SerializeObject(new param
                    {
                        o3 = exp.datapara.fPM10[i].ToArray(),
                        xg = exp.datapara.fOutBinsExtinction1064[i].ToArray(),
                        tp = exp.datapara.fDepolRatio[i].ToArray(),
                        time_cj = timeStamp
                    });

                    PostRestReturnJsonStr(@"http://192.168.10.139:4700/api/factor/insert", json);
                }
                
          
            }
            catch (System.Exception ex)
            {
                throw new Exception("加载数据源文件失败");
            }
        }

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

        public class param{
            
            public double[] o3 { get; set; }

            public double[] xg { get; set; }

            public double[] tp { get; set; }
 
            public long time_cj { get; set; } 
        
        }
    }
}
