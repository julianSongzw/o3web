using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

namespace PaintServiceAccess.BLL
{
    public class WctPaint_Exe
    {

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


        /// <summary>
        /// 绘图初始化
        /// </summary>
        /// <param name="width">图片宽度,单位像素</param>
        /// <param name="height">图片高度，单位像素</param>
        /// <param name="step">数据高度分辨率,单位m</param>
        /// <param name="Max">绘制最大高度,单位m</param>
        /// <param name="Min">绘制最小高度,单位m</param>
        /// <param name="Value_Max">绘制数据最大值</param>
        /// <param name="Value_Min">绘制数据最小值</param>
        /// <returns></returns>
        public bool InitePaint(int width, int height, float step, int Max, int Min, float Value_Max, float Value_Min)
        {
            dMax = Value_Max;
            dMin = Value_Min;
            pic_Width = width;
            pic_Height = height;
            offset_up = Max;
            offset_down = Min;
            ValidData = (long)((offset_up - offset_down)/step);  // 有效数据数目=data.count
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
        public Image setValue_skipdays(List<List<double>> data)
        { 
            data_source = data; 
            
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
        /// 绘制图片
        /// </summary>
        private void SkipPaint()
        {
            image = new Bitmap(pic_Width, pic_Height);
            Rectangle rect = new Rectangle(0, 0, pic_Width, pic_Height);
            Graphics gRender = Graphics.FromImage(image);
            Pen pen = new Pen(Color.Black, 2);

            if (data_source.Count != 0)
                PaintSkipSingleDays(rect, data_source, gRender, pen);

            pen.Dispose();
            gRender.Dispose();
        }

        /// <summary>
        /// 分解采集线
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
        
        private void picPaint_RenderLine(Rectangle rect, double linex, List<double> data, Graphics gRender)
        {
            int y = rect.Top;
            int ey = rect.Bottom;
            int h = ey - y;

         
            for (int i = 1; i < h; i++)  // 从下往上画
            {
                int dataindex = offset_down + (int)(i * ValidData / h); // 分成h等分
                double tempdata = data[dataindex];

                if (tempdata == -999)
                {
                    gRender.FillRectangle(new SolidBrush(Color.WhiteSmoke), (float)linex, (float)(ey - i), 1, 1);
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
