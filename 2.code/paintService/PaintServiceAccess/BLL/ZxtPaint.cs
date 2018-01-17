using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Threading;
using System.Configuration;
using System.IO;
using LESSAIS.Common.Log;


namespace PaintServiceAccess.BLL
{
   public class ZxtPaint_Exe
    {
       private static readonly Logger Log = LogManager.GetLogger("PaintLog", "PaintLog");
       static int Interval;
        //绘制高度范围
        public double con_axsiBottom = 0;
        public double con_axsiTop = 0;
        //伪彩图绘制开始结束的数据点
        private int offset_up;
        private int offset_down;
        long ValidData;
        //传入数据的最大值最小值
        private double dMax = 0;
        private double dMin = 0;
        //传入数据保存
        List<List<double>> data_source = new List<List<double>>();
        //伪彩图图片及网格图片
        private Image image; 

        private int PCOLORNUM = 320;
        private int COLORSPLITPART = 4;
        private Color[] colorBar;

        private List<int> list_red = new List<int> { 0, 16, 140, 255, 255 };
        private List<int> list_green = new List<int> { 56, 199, 255, 227, 0 };
        private List<int> list_blue = new List<int> { 222, 148, 0, 0, 0 };

        //定义色阶的阶数，320阶
        private Color[] m_PColorTable = new Color[320];
        //传入首标题，判断“波长指数”用
        string Title = "";

        //图片尺寸
        private int pic_Width { set; get; }
        private int pic_Height { set; get; }

        double[,] xRotate = new double[3, 3];
        double[,] xRotateInit = new double[3, 3];
        double[,] yRotate = new double[3, 3];
        double[,] zRotate = new double[3, 3];
         int up_deg = 80;
         int rotate_deg = 36;
        const float DEG = 1.0F;

        private List<Point_jj> list_points = new List<Point_jj>();
        private List<Point_jj> list_points_draw = new List<Point_jj>();
        const int SPAN = 60;
        const int SPAN1 = 130;
        const int SPAN2 = 230;
        const int SPAN3 = 320;
        const int SPAN4 = 360;
        public class Point_jj
        {
            public float x;
            public float y;
            public float z;
            public Color color;
        }
        string siteNbr = "default";
        DateTime endTime =DateTime.Now;
        public bool InitePaint(int width, int height, int updeg, int rotatedeg,double Value_Max, double Value_Min,string nbr,DateTime dt)
        {
            Interval = int.Parse(ConfigurationManager.AppSettings["interval"]);
            siteNbr = nbr;
            endTime = dt;
            dMax = Value_Max;
            dMin = Value_Min;
            pic_Width = width;
            pic_Height = height;
            colorBar = new Color[COLORSPLITPART + 1];
            // 颜色条中的颜色
            for (int i = 0; i < COLORSPLITPART + 1; i++)
            {
                colorBar[i] = Color.FromArgb(list_red[i], list_green[i], list_blue[i]);
            }

            SetColorBarArray();
            up_deg = updeg;
            rotate_deg = rotatedeg;
            InitRotate();
            return true;
        }
        /// <summary>
        /// 初始化色阶，定义CLUT（color look_up table）
        /// </summary>
        private void SetColorBarArray()
        {
            int iCurrentStart = 0;
            int iCurrentEnd = 0; ;
            int iPart = COLORSPLITPART;  // 将ColorBar分成多少个部分来进行着色
            for (int j = 0; j < iPart; j++)
            {
                iCurrentStart = (int)(j * PCOLORNUM / iPart);
                iCurrentEnd = (int)((j + 1) * PCOLORNUM / iPart - 1);
                m_PColorTable[iCurrentStart] = Color.FromArgb(colorBar[j + 0].R, colorBar[j + 0].G, colorBar[j + 0].B);
                m_PColorTable[iCurrentEnd] = Color.FromArgb(colorBar[j + 1].R, colorBar[j + 1].G, colorBar[j + 1].B);
                for (int i = iCurrentStart; i < iCurrentEnd; i++)
                {
                    m_PColorTable[i] = Color.FromArgb(
                       colorBar[j + 0].R + (colorBar[j + 1].R - colorBar[j + 0].R) * (i - iCurrentStart) * iPart / PCOLORNUM,
                     colorBar[j + 0].G + (colorBar[j + 1].G - colorBar[j + 0].G) * (i - iCurrentStart) * iPart / PCOLORNUM,
                        colorBar[j + 0].B + (colorBar[j + 1].B - colorBar[j + 0].B) * (i - iCurrentStart) * iPart / PCOLORNUM
                         );
                }
            }
        }

        public void setValue_skipdays(List<List<double>> data)
        {
          
            data_source = data;
            offset_up = 3000;
            offset_down = 0;
            if (data.Count != 0)
            {
                List<List<double>> CacheDataSource = new List<List<double>>();


                for (int i = 0;  i< data.Count()&&i<72; i++)
                {
                    CacheDataSource.Add(data[i]);
                    CacheDataSource.Add(data[i]);
                    CacheDataSource.Add(data[i]);
                    CacheDataSource.Add(data[i]);
                    CacheDataSource.Add(data[i]);
                }
                int Counter = CacheDataSource.Count;

                for (int i = 1; i <= Counter; i++)// 一共有counter个采集数据 （竖）
                {

                    List<double> BinVect = CacheDataSource[i - 1];

                    picPaint_RenderLine(BinVect, i); //画 一个采集数据中的图中的一个竖直的部分 (竖)

                }

                Thread draw = new Thread(saveImage);
                draw.Start();
              
            }
             
        }

        /// <summary>
        /// 绘制单条伪彩图
        /// </summary>
        private void picPaint_RenderLine(List<double> data, int fjx)
        {

            int h = 100;
            double hd, hd_pre;
            long ValidData = offset_up - offset_down;  // 有效数据数目=data.count
            for (int i = 0; i < h; i++)  // 从下往上画
            {
                int dataindex = offset_down + (int)(i * ValidData / h); // 分成h等分
                double tempdata = data[dataindex];


                    Color crColor = m_PColorTable[0];
                    int colorindex;
                    if (Title == "波长指数")
                        colorindex = (int)((1 - (tempdata - dMin) / (dMax - dMin)) * PCOLORNUM);
                    else
                        colorindex = (int)((tempdata - dMin) / (dMax - dMin) * PCOLORNUM);

                    if (colorindex >= 0 && colorindex < PCOLORNUM)
                    {
                        crColor = m_PColorTable[colorindex];
                    }
                    else if (colorindex >= PCOLORNUM)
                    {
                        crColor = m_PColorTable[PCOLORNUM - 1];
                    }
                    else if (colorindex < 0)
                    {
                        crColor = m_PColorTable[0];
                        //continue;
                    }

                    hd = Math.PI * (fjx) / 180;
                    hd_pre = Math.PI * (fjx - 1) / 180;


                    var st_x = (double)(i * Math.Cos(hd));
                    var st_y = (double)(i * Math.Sin(hd));
                    var pre_y = (double)(i * Math.Sin(hd_pre));
                    var pre_x = (double)(i * Math.Cos(hd_pre));

                    var span = i * Math.PI / 180;

                    var span_x = Math.Abs(pre_x - st_x) / span;
                    var span_y = Math.Abs(pre_y - st_y) / span;
                    var min_x = st_x >= pre_x ? pre_x : st_x;
                    var max_x = st_x >= pre_x ? st_x : pre_x;
                    var min_y = st_y >= pre_y ? pre_y : st_y;
                    var max_y = st_y >= pre_y ? st_y : pre_y;

                    for (int t = 0; t < span; t++)
                    {
                        if (fjx <= SPAN)
                        {
                            list_points.Add(new Point_jj
                            {
                                y = (float)(min_y + t * span_y),
                                x = (float)(min_x),
                                z = zCal(min_x, min_y + t * span_y),
                                color = crColor
                            });
                            list_points.Add(new Point_jj
                            {
                                y = (float)(min_y + t * span_y),
                                x = (float)(max_x),
                                z = zCal(max_x, min_y + t * span_y),
                                color = crColor
                            });

                            list_points_draw.Add(new Point_jj
                            {
                                y = (float)(min_y + t * span_y),
                                x = (float)(min_x),
                                z = zCal(min_x, min_y + t * span_y),
                                color = crColor
                            });
                            list_points_draw.Add(new Point_jj
                            {
                                y = (float)(min_y + t * span_y),
                                x = (float)(max_x),
                                z = zCal(max_x, min_y + t * span_y),
                                color = crColor
                            });
                        }
                        else if (fjx > SPAN && fjx <= SPAN1)
                        {
                            list_points.Add(new Point_jj
                            {
                                x = (float)(min_x + t * span_x),
                                y = (float)(min_y),
                                z = zCal((min_x + t * span_x), min_y),
                                color = crColor
                            });
                            list_points.Add(new Point_jj
                            {
                                x = (float)(min_x + t * span_x),
                                y = (float)(max_y),
                                z = zCal((min_x + t * span_x), max_y),
                                color = crColor
                            });
                            list_points_draw.Add(new Point_jj
                            {
                                x = (float)(min_x + t * span_x),
                                y = (float)(min_y),
                                z = zCal((min_x + t * span_x), min_y),
                                color = crColor
                            });
                            list_points_draw.Add(new Point_jj
                            {
                                x = (float)(min_x + t * span_x),
                                y = (float)(max_y),
                                z = zCal((min_x + t * span_x), max_y),
                                color = crColor
                            });
                        }
                        else if (fjx > SPAN1 && fjx <= SPAN2)
                        {
                            list_points.Add(new Point_jj
                            {
                                y = (float)(min_y + t * span_y),
                                x = (float)(min_x),
                                z = zCal(min_x, min_y + t * span_y),
                                color = crColor
                            });
                            list_points.Add(new Point_jj
                            {
                                y = (float)(min_y + t * span_y),
                                x = (float)(max_x),
                                z = zCal(max_x, min_y + t * span_y),
                                color = crColor
                            });
                            list_points_draw.Add(new Point_jj
                            {
                                y = (float)(min_y + t * span_y),
                                x = (float)(min_x),
                                z = zCal(min_x, min_y + t * span_y),
                                color = crColor
                            });
                            list_points_draw.Add(new Point_jj
                            {
                                y = (float)(min_y + t * span_y),
                                x = (float)(max_x),
                                z = zCal(max_x, min_y + t * span_y),
                                color = crColor
                            });

                        }
                        else if (fjx > SPAN2 && fjx <= SPAN3)
                        {
                            list_points.Add(new Point_jj
                            {
                                x = (float)(min_x + t * span_x),
                                y = (float)(min_y),
                                z = zCal((min_x + t * span_x), min_y),
                                color = crColor
                            });
                            list_points.Add(new Point_jj
                            {
                                x = (float)(min_x + t * span_x),
                                y = (float)(max_y),
                                z = zCal((min_x + t * span_x), max_y),
                                color = crColor
                            });
                            list_points_draw.Add(new Point_jj
                            {
                                x = (float)(min_x + t * span_x),
                                y = (float)(min_y),
                                z = zCal((min_x + t * span_x), min_y),
                                color = crColor
                            });
                            list_points_draw.Add(new Point_jj
                            {
                                x = (float)(min_x + t * span_x),
                                y = (float)(max_y),
                                z = zCal((min_x + t * span_x), max_y),
                                color = crColor
                            });
                        }
                        else if (fjx > SPAN3 && fjx <= SPAN4)
                        {
                            list_points.Add(new Point_jj
                            {
                                y = (float)(min_y + t * span_y),
                                x = (float)(min_x),
                                z = zCal(min_x, min_y + t * span_y),
                                color = crColor
                            });
                            list_points.Add(new Point_jj
                            {
                                y = (float)(min_y + t * span_y),
                                x = (float)(max_x),
                                z = zCal(max_x, min_y + t * span_y),
                                color = crColor
                            });
                            list_points_draw.Add(new Point_jj
                            {
                                y = (float)(min_y + t * span_y),
                                x = (float)(min_x),
                                z = zCal(min_x, min_y + t * span_y),
                                color = crColor
                            });
                            list_points_draw.Add(new Point_jj
                            {
                                y = (float)(min_y + t * span_y),
                                x = (float)(max_x),
                                z = zCal(max_x, min_y + t * span_y),
                                color = crColor
                            });
                        }
                }
            }
        }

        private void saveImage() {

            Rotate_x();

            if (image != null)
            {
                int minute = ((int)(endTime.Minute / Interval)) * Interval;

                string path_1 = ConfigurationManager.AppSettings["O3_wct_zxt"]+siteNbr;

                string path_2 = endTime.ToString("yyyyMMdd");

                string fileName = endTime.Hour.ToString() + minute.ToString();
                if (!Directory.Exists(path_1 + @"\" + path_2))
                {
                    Directory.CreateDirectory(path_1 + @"\" + path_2);
                }
                 
                List<string> imgName = new List<string>();
                List<int> degs = new List<int>();

                image.Save(path_1 + @"\" + path_2 + @"\" + fileName + "_0" + ".png", System.Drawing.Imaging.ImageFormat.Png);
                imgName.Add(fileName + "_0" + ".png");
                degs.Add(0);
                Log.Info("生成椎体图地址：" + path_2 + "/" + fileName + "_0"+ ".png");

                for (int i = 1; i < 360/rotate_deg; i++)
                {
                    Rotate_z();
                    image.Save(path_1 + @"\" + path_2 + @"\" + fileName + "_" + i * rotate_deg + ".png", System.Drawing.Imaging.ImageFormat.Png);
                    imgName.Add(fileName + "_" + i * rotate_deg + ".png");
                    degs.Add(i * rotate_deg);
                    Log.Info("生成椎体图地址：" + path_2 + "/" + fileName + "_" + i * rotate_deg + ".png");
                    
                }
                
              System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1)); // 当地时区
              long stimeStamp = (long)(endTime - startTime).TotalMilliseconds; // 相差毫秒数
             
                var db = new paramZxt_db { 
                scode=siteNbr,
                factor="o3",
                value=imgName.ToArray(),
                deg=degs.ToArray(),
                time = stimeStamp
                };
                if (DbSearch.InsertMgt(db) == 1) {
                    Log.Info("生成椎体图入库成功");
                }
            }
        }

        void DrawImage(Graphics gRender)
        {
            gRender.SmoothingMode = SmoothingMode.AntiAlias;
            foreach (var item in list_points_draw)
            {
                gRender.FillRectangle(new SolidBrush(Color.FromArgb(125, item.color)), item.x, item.y, 1, 1);
            }
            gRender.Dispose(); 
        }
     
        #region 旋转
        float zCal(double x, double y)
        {
            return (float)(DEG * Math.Sqrt(x * x + y * y)); //返回z
        }

        void InitRotate()
        {
            double dTheta1 = Math.PI * rotate_deg / 180;
            double dTheta2 = Math.PI * up_deg / 180;

            xRotate[0, 0] = 1;
            xRotate[0, 1] = 0;
            xRotate[0, 2] = 0;
            xRotate[1, 0] = 0;
            xRotate[1, 1] = Math.Cos(dTheta2);
            xRotate[1, 2] = -Math.Sin(dTheta2);
            xRotate[2, 0] = 0;
            xRotate[2, 1] = Math.Sin(dTheta2);
            xRotate[2, 2] = Math.Cos(dTheta2);

            zRotate[0, 0] = Math.Cos(dTheta1);
            zRotate[0, 1] = -Math.Sin(dTheta1);
            zRotate[0, 2] = 0;
            zRotate[1, 0] = Math.Sin(dTheta1);
            zRotate[1, 1] = Math.Cos(dTheta1);
            zRotate[1, 2] = 0;
            zRotate[2, 0] = 0;
            zRotate[2, 1] = 0;
            zRotate[2, 2] = 1;
        }

        public Image Rotate_x()
        {
            image = null;
            image = new Bitmap(pic_Width, pic_Height);
            Rectangle rect = new Rectangle(0, 0, pic_Width, pic_Height);
            Graphics gRender = Graphics.FromImage(image);
            gRender.TranslateTransform(pic_Width / 2, pic_Height / 2);

            rCal_x(xRotate);
            DrawImage(gRender);
            return image;
        }

         
        public Image Rotate_z()
        {
            image = null;
            image = new Bitmap(pic_Width, pic_Height);
            Rectangle rect = new Rectangle(0, 0, pic_Width, pic_Height);
            Graphics gRender = Graphics.FromImage(image);
            gRender.TranslateTransform(pic_Width / 2, pic_Height / 2);

            rCal(zRotate);
            rCal_x(xRotate);
            DrawImage(gRender);
            return image;
        }

        void rCal(double[,] R)
        {
            float Px = 0;
            float Py = 0;
            float Pz = 0;
            var P = list_points;
            var P_draw = list_points_draw;

            for (var V = 0; V < P.Count; V++)
            {
                Px = P[V].x;
                Py = P[V].y;
                Pz = P[V].z;
                P[V].x = (float)((R[0, 0] * Px) + (R[0, 1] * Py) + (R[0, 2] * Pz));
                P[V].y = (float)((R[1, 0] * Px) + (R[1, 1] * Py) + (R[1, 2] * Pz));
                P[V].z = (float)((R[2, 0] * Px) + (R[2, 1] * Py) + (R[2, 2] * Pz));
            }

        }
        void rCal_x(double[,] R)
        {
            float Px = 0;
            float Py = 0;
            float Pz = 0;
            var P = list_points;
            var P_draw = list_points_draw;

            for (var V = 0; V < P.Count; V++)
            {
                Px = P[V].x;
                Py = P[V].y;
                Pz = P[V].z;
                P_draw[V].x = (float)((R[0, 0] * Px) + (R[0, 1] * Py) + (R[0, 2] * Pz));
                P_draw[V].y = (float)((R[1, 0] * Px) + (R[1, 1] * Py) + (R[1, 2] * Pz));
                P_draw[V].z = (float)((R[2, 0] * Px) + (R[2, 1] * Py) + (R[2, 2] * Pz));
            }

        }
        #endregion

    }
}
