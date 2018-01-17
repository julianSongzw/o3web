using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

namespace testGrap
{
    public class LdPaint
    {

       
        //伪彩图图片及网格图片
        private Bitmap image; 
        private int pic_Width { set; get; }
        private int pic_Height { set; get; }

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

        //随机数据集 
        public int row { private set; get; }//行
        public int column { private set; get; }//列
        public int randSize = 8;//

        public double MaxValue { private set; get; }//高程值最高点
        public double MinValue { private set; get; }//高程值最低点

        public List<Point_ro> sdata=new  List<Point_ro> ();//风速风向原始数据
        //随机点数据
        private List<AltitudePoint> pointList=new List<AltitudePoint>();
        private List<AltitudePoint> pointList_o = new List<AltitudePoint>();
        public double[,] altitudeData { private set; get; }//高程数据
        //插值类
        private InterpolationData interpolation;
        private Region fill;

        /// <summary>
        /// 绘图初始化
        /// </summary>
        /// <param name="width">图片宽度,单位像素</param>
        /// <param name="height">图片高度，单位像素</param>
        /// <param name="res">数据高度分辨率,单位m</param>
        /// <param name="Max">绘制最大高度,单位m</param>
        /// <param name="Min">绘制最小高度,单位m</param>
        /// <param name="Value_Max">绘制数据最大值</param>
        /// <param name="Value_Min">绘制数据最小值</param>
        /// <returns></returns>
        public bool InitePaint(int width, int height, double res, int Max, int Min, double Value_Max, double Value_Min)
        {
           
            pic_Width = width;
            pic_Height = height;
            colorBar = new Color[COLORSPLITPART + 1];
            // 颜色条中的颜色
            for (int i = 0; i < COLORSPLITPART + 1; i++)
            {
                colorBar[i] = Color.FromArgb(list_red[i], list_green[i], list_blue[i]);
            }

            SetColorBarArray();
            row = width;
            column = height;
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

        
        /// <summary>
        /// 跳跃式绘制伪彩色图,指定时间范围内，以天为单位
        /// </summary>
        public Image setValue_skipdays(List<List<double>> data, List<string> namelist, string title, double days, DateTime starttime, DateTime endtime)
        {
             //极坐标系转直角坐标系、浓度排序
          
            if (data.Count != 0)
            {
              
                //List<AltitudePoint> list = new List<AltitudePoint>();
                Random random = new Random();

                sdata.Clear();
                sdata.Add(new Point_ro { r = 60, o = 45, val = random.Next(20) * 20 });
                sdata.Add(new Point_ro { r = 70, o = 90, val = random.Next(20) * 20 });
                sdata.Add(new Point_ro { r = 80, o = 135, val = random.Next(20) * 20 });
                sdata.Add(new Point_ro { r = 70, o = 180, val = random.Next(20) * 20 });
                sdata.Add(new Point_ro { r = 75, o = 225, val = random.Next(20) * 20 });
                sdata.Add(new Point_ro { r = 60, o = 270, val = random.Next(20) * 20 });
                sdata.Add(new Point_ro { r = 70, o = 315, val = random.Next(20) * 20 });
                sdata.Add(new Point_ro { r = 80, o = 360, val = random.Next(20) * 20 });
                //for (int i = 0; i < randSize; i++)// 一共有counter个采集数据 （竖）
                //{

                //    //int o = random.Next(360)/2;
                //    int r = random.Next(6) * 22;
                //    if (r < 22)
                //    {
                //        r = 22;
                //    }
                //    sdata.Add(new Point_ro { r = r, o = i * 360 / randSize, val = random.Next(20) * 20 });

                //}
                sdata.Sort(delegate(Point_ro p1, Point_ro p2)
                {
                    return p1.o > p2.o ? 1 : -1;
                });

                int k = 0;
                int r2 = this.row / 2;
                int c2 = this.column / 2;
                do
                {
                    pointList.Clear();
                    pointList_o.Clear();
                    for (int i = 0; i < randSize - k; i++)// 一共有counter个采集数据 （竖）
                    {

                        int x = (int)Math.Ceiling(r2 + sdata[i].r * Math.Cos(sdata[i].o * Math.PI / 180));
                        int y = (int)Math.Ceiling(c2 + sdata[i].r * Math.Sin(sdata[i].o * Math.PI / 180));

                        //pointList.Add(new AltitudePoint(x, y, sdata[i].val));
                        pointList_o.Add(new AltitudePoint(x, y, sdata[i].val));

                    }
                    for (int i = 0; i < 24; i++)// 一共有counter个采集数据 （竖）
                    {

                        int randomNumber = random.Next(this.row * this.column);
                        int x = randomNumber / this.column;
                        int y = randomNumber - x * this.column;

                        pointList.Add(new AltitudePoint(x, y, i * 20));

                    }
                    pointList.Sort(delegate(AltitudePoint p1, AltitudePoint p2)
                    {
                        return p1.X * this.column + p1.Y >= p2.X * this.column + p2.Y ? 1 : -1;
                    });

                  
                    interpolation = new InterpolationData(pointList, row, column);
                    k++;
                } while (!interpolation.IsRandomPointsOK()) ;
               
                //pointList.Add(new AltitudePoint(5.1, 1.1,101));
                //pointList.Add(new AltitudePoint(5.1, 1.1, 101));
                //pointList.Add(new AltitudePoint(5.1, 1.1, 101));
                //pointList.Add(new AltitudePoint(5.1, 1.1, 101));
                //pointList.Add(new AltitudePoint(5.1, 1.1, 101));
                //pointList.Add(new AltitudePoint(5.1, 1.1, 101));
                //pointList.Add(new AltitudePoint(5.1, 1.1, 101));
               
                     image = null;
                     image = new Bitmap(pic_Width, pic_Height); 

                    altitudeData = interpolation.GetInterpolationData(1); 
                    Rectangle rect = new Rectangle(0, 0, pic_Width, pic_Height);
                    Graphics gRender = Graphics.FromImage(image);
                    //gRender.TranslateTransform(pic_Width / 2, pic_Height / 2);
                    fillRegion();
                    DrawImage(gRender,1);
                
                return image;
            }
            else
                return null;
        }

        void DrawImage(Graphics gRender,int type)
        {
            if(type==0){
           
                foreach (AltitudePoint point in pointList)
                {
                        double tempdata = point.AltitudeValue;
                  
                        Color crColor = m_PColorTable[0];
                        int colorindex;
                        colorindex = (int)(tempdata * 320 / 500);

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
                        }
                        gRender.FillRectangle(new SolidBrush(crColor), (int)point.X, (int)point.Y, 1, 1);
                    
                }
                
            }
            else if(type==1){
                List<double> xList = pointList.Select(x => x.X).ToList();
                List<double> yList = pointList.Select(y => y.Y).ToList();



                for (int y = 0; y < this.row; y++)
                {
                    for (int x = 0; x < this.column; x++)
                    {
                        if (!fill.IsVisible(new Point { X=x,Y=y}))
                        {
                            continue;
                        }
                        double tempdata =altitudeData[x,y];

                        Color crColor = m_PColorTable[0];
                        int colorindex;
                        colorindex = (int)(tempdata * 320 / 500);

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
                        }
                        gRender.FillRectangle(new SolidBrush(crColor), x, y, 1, 1);
                    }
                }
            }
            else if(type==2){
              
                Point[] p = new Point[pointList_o.Count()];
                for (int i = 0; i < p.Length; i++)
                {
                    p[i] = new Point { X = (int)pointList_o[i].X, Y = (int)pointList_o[i].Y };
                }
                
                     gRender.DrawPolygon(new Pen(m_PColorTable[0]),p);
            }
            gRender.Dispose(); 
        }

        void fillRegion()
        {
            GraphicsPath myPath = new GraphicsPath();

            Point[] p = new Point[pointList_o.Count()];
            for (int i = 0; i < p.Length; i++)
            {
                p[i] = new Point { X = (int)pointList_o[i].X, Y = (int)pointList_o[i].Y };
            }
            myPath.AddPolygon(p);
            fill = new Region(myPath);
        }
        public Image Rotate_x()
        {
            image = null;
            image = new Bitmap(pic_Width, pic_Height);
            Rectangle rect = new Rectangle(0, 0, pic_Width, pic_Height);
            Graphics gRender = Graphics.FromImage(image);
            //gRender.TranslateTransform(pic_Width / 2, pic_Height / 2);

           // rCal(xRotate);
            DrawImage(gRender,2);
            return image;
        }

        public Image Rotate_x_init()
        {
            image = null;
            image = new Bitmap(pic_Width, pic_Height);
            Rectangle rect = new Rectangle(0, 0, pic_Width, pic_Height);
            Graphics gRender = Graphics.FromImage(image);
            gRender.TranslateTransform(pic_Width / 2, pic_Height / 2);

           // rCal(xRotateInit);
            //DrawImage(gRender);
            return image;
        }
        public Image Rotate_y()
        {
            image = null;
            image = new Bitmap(pic_Width, pic_Height);
            Rectangle rect = new Rectangle(0, 0, pic_Width, pic_Height);
            Graphics gRender = Graphics.FromImage(image);
            gRender.TranslateTransform(pic_Width / 2, pic_Height / 2);

          //  rCal(yRotate);
           // DrawImage(gRender);
            return image;
        }
        public Image Rotate_z()
        {
            image = null;
            image = new Bitmap(pic_Width, pic_Height);
            Rectangle rect = new Rectangle(0, 0, pic_Width, pic_Height);
            Graphics gRender = Graphics.FromImage(image);
            gRender.TranslateTransform(pic_Width / 2, pic_Height / 2);

           // rCal(zRotate);
            //DrawImage(gRender);
            return image;
        }
        /// <summary>
        /// 判断当前位置是否在不规则形状里面
        /// </summary>
        /// <param name="nvert">不规则形状的定点数</param>
        /// <param name="vertx">当前x坐标</param>
        /// <param name="verty">当前y坐标</param>
        /// <param name="testx">不规则形状x坐标集合</param>
        /// <param name="testy">不规则形状y坐标集合</param>
        /// <returns></returns>
        public static bool PositionPnpoly(int nvert, List<double> vertx, List<double> verty, double testx, double testy)
        {
            int i, j, c = 0;
            for (i = 0, j = nvert - 1; i < nvert; j = i++)
            {
                if (((verty[i] > testy) != (verty[j] > testy)) && (testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i]))
                {
                    c = 1 + c; ;
                }
            }
            if (c % 2 == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

    }

    public class Point_ro
    {
        public int r;
        public int o;
        public double val; 
    }
}
