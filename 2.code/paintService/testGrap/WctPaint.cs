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
  public  class WctPaint
    {
        
        //绘制高度范围
        public double con_axsiBottom = 0;
        public double con_axsiTop = 0;
        //伪彩图绘制开始结束的数据点
        private int offset_up;
        private int offset_down;
        //传入数据的最大值最小值
        private double dMax = 0;
        private double dMin = 0; 
        //传入数据保存
        List<List<double>> data_source = new List<List<double>>();
        //伪彩图图片及网格图片
        private Image image; 
        //传入文件名集合
        private List<string> list_filename = new List<string>();
        private List<DateTime> list_filename_time = new List<DateTime>();

        
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

        
        //每天数据的缓存
        List<List<double>> skip_single_source = new List<List<double>>();
        //每天文件名的缓存
        List<string> skip_single_filename = new List<string>(); 

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
            return true;
        }

        /// <summary>
        /// 跳跃式绘制伪彩色图,指定时间范围内，以天为单位
        /// </summary>
        /// <param name="data">绘制数据</param>
        /// <param name="namelist">时间列表，格式HF2016121213.3045</param>
        /// <param name="title">标题</param>
        /// <param name="days">总绘制天数</param>
        /// <param name="starttime">开始日期</param>
        /// <param name="endtime">结束日期</param>
        public Image setValue_skipdays(List<List<double>> data, List<string> namelist, string title, double days, DateTime starttime, DateTime endtime)
        {
            Title = title;
            data_source = data;
            list_filename = namelist;
            offset_up = 3000;
            offset_down = 0;
            if (data.Count != 0)
            {
                pic_Width = data.Count;
                image = null;
                SkipPaint();
                return image;
            }
            else
                return null;
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
        /// 绘制单日图片
        /// </summary>
        private void SkipPaint()
        {
            image = new Bitmap(pic_Width, pic_Height);
            Rectangle rect = new Rectangle(0, 0, pic_Width, pic_Height); 
            Graphics gRender = Graphics.FromImage(image);
            Pen pen = new Pen(Color.Black, 2);

            if (list_filename.Count != 0)
                PaintSkipSingleDays(rect, data_source, gRender, pen);

            pen.Dispose();
            gRender.Dispose();
        }

        /// <summary>
        /// 绘制单日图片
        /// </summary>
        /// <param name="rect"></param>
        /// <param name="e"></param>
        /// <param name="gRender"></param>
        private void PaintSkipSingleDays(Rectangle rect, List<List<double>> e, Graphics gRender, Pen pen)
        {
           
            int Counter = e.Count;  
            for (int i = 0; i < Counter; i++)// 一共有counter个采集数据 （竖）
            {
                List<double> BinVect = e[i];
                // 画一个采集数据文件的渲染图
               picPaint_RenderLine(rect, i, BinVect, gRender); //画 一个采集数据中的图中的一个竖直的部分 (竖)
                
            }
        }
        /// <summary>
        /// 绘制单条伪彩图
        /// </summary>
        /// <param name="rect"></param>
        /// <param name="linex"></param>
        /// <param name="data"></param>
        /// <param name="gRender"></param>
        private void picPaint_RenderLine(Rectangle rect, double linex, List<double> data, Graphics gRender)
        {
            int y = rect.Top;
            int ey = rect.Bottom;
            int h = ey - y;

            long ValidData = offset_up - offset_down;  // 有效数据数目=data.count
            for (int i = 1; i < h; i++)  // 从下往上画
            {
                int dataindex = offset_down + (int)(i * ValidData / h); // 分成h等分
                double tempdata = data[dataindex];

                if (tempdata == -999)
                {
                    gRender.FillRectangle(new SolidBrush(m_PColorTable[0]), (float)linex, (float)(ey - i), 1, 1);
                }
                else
                {
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
                    }
                    gRender.FillRectangle(new SolidBrush(crColor), (float)linex, (float)(ey - i), 1, 1);
                }
            }
        }


   }
}
