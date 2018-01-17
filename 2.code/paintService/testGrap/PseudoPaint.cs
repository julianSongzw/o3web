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
    public class PseudoPaint
    {
        //伪彩图绘制高度范围
        double start_km;
        double end_km;
        //绘制高度范围
        public double con_axsiBottom = 0;
        public double con_axsiTop = 0;
        //伪彩图绘制开始结束的数据点
        private int offset_up;
        private int offset_down;
        //传入数据的最大值最小值
        private double dMax = 0;
        private double dMin = 0;
        private bool IsSetMaxMin = false;
        //传入数据保存
        List<List<double>> data_source = new List<List<double>>();
        //伪彩图图片及网格图片
        private Image image;
        private Image imageGrid;
        //传入文件名集合
        private List<string> list_filename = new List<string>();
        private List<DateTime> list_filename_time = new List<DateTime>();

        //绘制的开始时间和结束时间
        DateTime skip_starttime;
        DateTime skip_endtime;

        //绘制坐标轴参数
        int degree_countX = 5;//x轴5个坐标点

        private int PCOLORNUM = 320;
        private int COLORWIDTH = 20; // ColorBar宽度
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
        //雷达精度
        private double Res { set; get; }

        //绘制总天数
        double skip_total_days = 0;
        //每天所占图片宽度
        double skip_single_width = 0;
        //每天数据的缓存
        List<List<double>> skip_single_source = new List<List<double>>();
        //每天文件名的缓存
        List<string> skip_single_filename = new List<string>();
        //每天绘制图片
        Image skip_single_image = null;
        //已绘制的宽度和将要绘制的宽度
        int painted_width = 0;
        int painting_width = 0;

        //各模块图片
        Image X_Image = null;
        Image Y_Image = null;
        Image Bar_Image = null;
        Image Cer_Image = null;

        public event EventHandler<PseudoEventArgs> ErrorInfo;

        /// <summary>
        /// 绘图初始化
        /// </summary>
        /// <param name="width">图片宽度,单位像素</param>
        /// <param name="height">图片高度，单位像素</param>
        /// <param name="res">数据高度分辨率,单位m</param>
        /// <param name="Max">绘制最大高度,单位m</param>
        /// <param name="Min">绘制最小高度,单位m</param>
        /// <returns></returns>
        public bool InitePaint(int width, int height, double res, int Max, int Min)
        {
            if (width < 300)
            {
                PseudoEventArgs args = new PseudoEventArgs("图片宽度设置不得低于300像素！");
                if (ErrorInfo != null)
                {
                    ErrorInfo(this, args);
                }
                return false;
            }

            if (height < 150)
            {
                PseudoEventArgs args = new PseudoEventArgs("图片高度设置不得低于1500像素！");
                if (ErrorInfo != null)
                {
                    ErrorInfo(this, args);
                }
                return false;
            }

            if (res <= 0 || Max <= 0 || Min < 0)
            {
                PseudoEventArgs args = new PseudoEventArgs("数据高度分辨率、最大绘制高度、最小绘制高度必须大于零！");
                if (ErrorInfo != null)
                {
                    ErrorInfo(this, args);
                }
                return false;
            }

            IsSetMaxMin = false;
            pic_Width = width;
            pic_Height = height;
            Res = res / 1000;
            con_axsiBottom = Min;
            con_axsiTop = Max;

            colorBar = new Color[COLORSPLITPART + 1];

            // 颜色条中的颜色
            for (int i = 0; i < COLORSPLITPART + 1; i++)
            {
                colorBar[i] = Color.FromArgb(list_red[i], list_green[i], list_blue[i]);
            }

            return true;
        }

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
            if (width < 300)
            {
                PseudoEventArgs args = new PseudoEventArgs("图片宽度设置不得低于300像素！");
                if (ErrorInfo != null)
                {
                    ErrorInfo(this, args);
                }
                return false;
            }

            if (height < 150)
            {
                PseudoEventArgs args = new PseudoEventArgs("图片高度设置不得低于1500像素！");
                if (ErrorInfo != null)
                {
                    ErrorInfo(this, args);
                }
                return false;
            }

            if (res <= 0 || Max <= 0 || Min < 0)
            {
                PseudoEventArgs args = new PseudoEventArgs("数据高度分辨率、最大绘制高度、最小绘制高度必须大于零！");
                if (ErrorInfo != null)
                {
                    ErrorInfo(this, args);
                }
                return false;
            }

            dMax = Value_Max;
            dMin = Value_Min;
            IsSetMaxMin = true;
            pic_Width = width;
            pic_Height = height;
            Res = res / 1000;
            con_axsiBottom = Min;
            con_axsiTop = Max;

            colorBar = new Color[COLORSPLITPART + 1];

            // 颜色条中的颜色
            for (int i = 0; i < COLORSPLITPART + 1; i++)
            {
                colorBar[i] = Color.FromArgb(list_red[i], list_green[i], list_blue[i]);
            }

            return true;
        }

        /// <summary>
        /// 跳跃式绘制伪彩色图,最近24h
        /// </summary>
        /// <param name="data">绘制数据</param>
        /// <param name="namelist">时间列表，格式HF2016121213.3045</param>
        /// <param name="title">标题</param>
        public Image setValue_skiprealday(List<List<double>> data, List<string> namelist, string title)
        {
            if (pic_Width >= 300 && pic_Height >= 150)
            {
                Title = title;

                start_km = con_axsiBottom / 1000;
                end_km = con_axsiTop / 1000;

                if (data.Count != 0)
                {
                    string nowtime = DateTime.Now.ToString("yyyyMMddHH");
                    skip_starttime = DateTime.ParseExact(nowtime, "yyyyMMddHH", System.Globalization.CultureInfo.CurrentCulture) - new TimeSpan(23, 0, 0);
                    skip_endtime = skip_starttime.AddDays(1);
                    data_source = data;
                    SetColorBarArray();

                    image = null;
                    imageGrid = null;
                    if (list_filename != namelist)
                    {
                        list_filename = namelist;
                        list_filename_time.Clear();
                        DateTime current_time;
                        for (int i = 0; i < namelist.Count; i++)
                        {
                            current_time = DateTime.ParseExact(namelist[i].Substring(namelist[i].Length - 15, 15),
                        "yyyyMMddHH.mmss", System.Globalization.CultureInfo.CurrentCulture);
                            list_filename_time.Add(current_time);
                        }
                    }

                    offset_up = (int)(end_km / Res);
                    offset_down = (int)(start_km / Res);

                    if (!IsSetMaxMin)
                        GetMaxMin(data_source);

                    skip_paint_X();
                    paint_Y();
                    paint_Colorbar();

                    //绘制单日图片
                    PaintSkiprealday();

                    return CombineImages();
                }
                else
                    return null;
            }
            else
                return null;
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
            if (pic_Width >= 300 && pic_Height >= 150)
            {
                start_km = con_axsiBottom / 1000;
                end_km = con_axsiTop / 1000;

                Title = title;

                if (data.Count != 0)
                {
                    list_filename = namelist;
                    list_filename_time.Clear();
                    DateTime current_time;
                    for (int i = 0; i < namelist.Count; i++)
                    {
                        current_time = DateTime.ParseExact(namelist[i].Substring(namelist[i].Length - 15, 15),
                    "yyyyMMddHH.mmss", System.Globalization.CultureInfo.CurrentCulture);
                        list_filename_time.Add(current_time);
                    }

                    skip_starttime = starttime;
                    skip_endtime = endtime.AddDays(1);

                    data_source = data;
                    skip_total_days = days;
                    SetColorBarArray();

                    image = null;
                    imageGrid = null;
                    list_filename = namelist;
                    offset_up = (int)(end_km / Res);
                    offset_down = (int)(start_km / Res);

                    if (!IsSetMaxMin)
                        GetMaxMin(data_source);

                    skip_paint_X();
                    paint_Y();

                    paint_Colorbar();

                    //绘制单日图片
                    SkipPaint();

                    return CombineImages();
                }
                else
                    return null;
            }
            else
                return null;
        }

        /// <summary>
        /// 绘制实时图片，最近24h
        /// </summary>
        private void PaintSkiprealday()
        {
            int Cer_width = pic_Width - 115;
            int Cer_height = pic_Height - 51;

            DateTime skip_current = skip_starttime;

            Rectangle rect = new Rectangle(0, 0, Cer_width, Cer_height);
            image = new Bitmap(Cer_width, Cer_height);
            Graphics gRender = Graphics.FromImage(image);
            Pen pen = new Pen(Color.Black, 2);

            DateTime lastfile_time = skip_endtime;
            DateTime firstfile_time = skip_starttime;

            int Counter = data_source.Count;
            //int linewidth = (int)(rect.Width / Counter) + 1;   // 每一个数据文件对应的渲染图中间的大小（竖线）
            double linewidth = (0.1 / 24) * rect.Width;
            double linex = 0;

            if (rect.Width > data_source.Count)
                linewidth += 1;

            for (int i = 0; i < Counter; i++)// 一共有counter个采集数据 （竖）
            {
                DateTime current_time = list_filename_time[i];
                linex = rect.Width * (current_time - firstfile_time).Ticks / (lastfile_time - firstfile_time).Ticks;

                List<double> BinVect = data_source[i];
                // 画一个采集数据文件的渲染图
                for (int n = 0; n < linewidth; n++) //  (横)
                {
                    picPaint_RenderLine(rect, linex + n, BinVect, gRender); //画 一个采集数据中的图中的一个竖直的部分 (竖)
                }
            }

            Cer_Image = image;

            pen.Dispose();
            gRender.Dispose();
        }

        /// <summary>
        /// 绘制历史图片
        /// </summary>
        private void SkipPaint()
        {
            int Cer_width = pic_Width - 115;
            int Cer_height = pic_Height - 51;

            DateTime skip_current = skip_starttime;
            image = new Bitmap(Cer_width, Cer_height);
            Graphics g = Graphics.FromImage(image);

            skip_single_width = Cer_width / skip_total_days;

            for (int i = 0; i < skip_total_days; i++)
            {
                //筛选数据
                for (int j = 0; j < list_filename.Count; j++)
                {
                    if (list_filename[j].Substring(list_filename[j].Length - 15, 8) == skip_current.ToString("yyyyMMdd"))
                    {
                        skip_single_source.Add(data_source[j]);
                        skip_single_filename.Add(list_filename[j]);
                    }
                }
                skip_current = skip_current.AddDays(1);

                //绘制单日图片
                PaintSkipdays();

                //拼接图片
                g.DrawImage(skip_single_image, new Point((int)Math.Floor(skip_single_width * i), 0));
                skip_single_source.Clear();
                skip_single_filename.Clear();

                //图片赋值
                Cer_Image = image;

                skip_single_image = null;
                painted_width += painting_width;
            }

            painted_width = 0;
            painting_width = 0;
            g.Dispose();
        }

        /// <summary>
        /// 绘制单日图片
        /// </summary>
        private void PaintSkipdays()
        {
            Rectangle rect = new Rectangle(0, 0, (int)Math.Ceiling(skip_single_width), pic_Height - 51);
            skip_single_image = new Bitmap(rect.Width, rect.Height);
            Graphics gRender = Graphics.FromImage(skip_single_image);
            Pen pen = new Pen(Color.Black, 2);

            if (skip_single_filename.Count != 0)
                PaintSkipSingleDays(rect, skip_single_source, gRender, pen);

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
            DateTime lastfile_time = DateTime.ParseExact(skip_single_filename[0].Substring(skip_single_filename[0].Length - 15, 8),
                "yyyyMMdd", System.Globalization.CultureInfo.CurrentCulture) + new TimeSpan(24, 0, 0);
            DateTime firstfile_time = DateTime.ParseExact(skip_single_filename[0].Substring(skip_single_filename[0].Length - 15, 8),
                "yyyyMMdd", System.Globalization.CultureInfo.CurrentCulture);

            int Counter = e.Count;
            //int linewidth = (int)(rect.Width / Counter) + 1;   // 每一个数据文件对应的渲染图中间的大小（竖线）
            double linewidth = (0.1 / 24) * rect.Width;
            double linex = 0;

            if (rect.Width > e.Count)
                linewidth += 1;

            for (int i = 0; i < Counter; i++)// 一共有counter个采集数据 （竖）
            {
                DateTime current_time = DateTime.ParseExact(skip_single_filename[i].Substring(skip_single_filename[i].Length - 15, 15),
                "yyyyMMddHH.mmss", System.Globalization.CultureInfo.CurrentCulture);
                linex = rect.Width * (current_time - firstfile_time).Ticks / (lastfile_time - firstfile_time).Ticks;

                //linex = (double)rect.Width / Counter * i;
                List<double> BinVect = e[i];
                // 画一个采集数据文件的渲染图
                for (int n = 0; n < linewidth; n++) //  (横)
                {
                    picPaint_RenderLine(rect, linex + n, BinVect, gRender); //画 一个采集数据中的图中的一个竖直的部分 (竖)
                }
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

        /// <summary>
        /// 绘制x轴坐标
        /// </summary>
        private void skip_paint_X()
        {
            int X_width = pic_Width - 50;
            int X_height = 36;

            Rectangle rect_x = new Rectangle(0, 0, X_width - 65, X_height);

            Image imgRender = new Bitmap(X_width, X_height);
            Graphics gRender = Graphics.FromImage(imgRender);
            Pen pen = new Pen(Color.LightBlue, 3);
            Font font = new Font("宋体", 9);
            SolidBrush brush = new SolidBrush(Color.FromArgb(200, 67, 78, 84));//创建一般画刷

            gRender.DrawLine(pen, 0, 0, rect_x.Width, 0);//绘制轴线

            #region 绘制长短刻度
            int filecount = list_filename.Count;
            List<string> list_degreename = new List<string>();

            #region skip绘图
            int tempwidth_skip = (int)(rect_x.Width / (degree_countX - 1));
            for (int i = 0; i < degree_countX; i++)
            {
                DateTime temp_datetime = skip_starttime + new TimeSpan((int)((skip_endtime - skip_starttime).TotalHours * i / (degree_countX - 1)), 0, 0);
                //string str_time = temp_datetime.ToString("HH:mm:ss");
                string str_time = temp_datetime.ToString("HH:mm");
                string str_date = temp_datetime.ToString("yyyyMMddHHmmss");
                str_date = str_date.Substring(4, 2) + @"\" + str_date.Substring(6, 2) + @"\" + str_date.Substring(0, 4);

                gRender.DrawLine(pen, tempwidth_skip * i, 0, tempwidth_skip * i, 6);
                gRender.DrawString(str_time, font, brush, tempwidth_skip * i, 6);
                gRender.DrawString(str_date, font, brush, tempwidth_skip * i, 25);

                if (i != degree_countX - 1)
                {
                    gRender.DrawLine(pen, tempwidth_skip * i + tempwidth_skip / 2, 0, tempwidth_skip * i + tempwidth_skip / 2, 4);
                }
            }
            #endregion

            #endregion
            list_degreename.Clear();
            X_Image = imgRender;

            font.Dispose();
            brush.Dispose();
            pen.Dispose();
        }

        /// <summary>
        /// 绘制Y轴坐标
        /// </summary>
        private void paint_Y()
        {
            int Y_width = 50;
            int Y_height = pic_Height - 15;

            Rectangle rect_y = new Rectangle(0, 0, Y_width, Y_height - 36);

            Image imgRender = new Bitmap(Y_width, Y_height);
            Graphics gRender = Graphics.FromImage(imgRender);
            Pen pen = new Pen(Color.LightBlue, 2);
            Font font = new System.Drawing.Font("宋体", 9);
            SolidBrush brush = new SolidBrush(Color.FromArgb(200, 67, 78, 84));//创建一般画刷

            gRender.DrawLine(pen, rect_y.Width - 1, 0, rect_y.Width - 1, rect_y.Height);

            int degree_X = (int)Math.Floor((end_km - start_km) / 0.1);
            double m_tempwidth = (double)rect_y.Height / (degree_X - 1);

            double next_degree = start_km;
            int count_degree = 0;

            while (next_degree < end_km)
            {
                int i = count_degree * 5;
                string y_name = (next_degree).ToString();
                SizeF sf = gRender.MeasureString(y_name, font);
                gRender.DrawLine(pen, rect_y.Width, rect_y.Height - (int)(m_tempwidth * i), rect_y.Width - 5,
                    rect_y.Height - (int)(m_tempwidth * i));
                gRender.DrawString(y_name, font, brush, rect_y.Width - sf.Width - 5, rect_y.Height - (int)(m_tempwidth * i));

                if (rect_y.Height - m_tempwidth * (i + 2.5) > 0)
                {
                    int judge_math = count_degree % 2;
                    int y;
                    if (judge_math == 0)
                        y = (int)Math.Floor((double)rect_y.Height - m_tempwidth * (i + 2.5));
                    else
                        y = (int)Math.Ceiling((double)rect_y.Height - m_tempwidth * (i + 2.5));
                    gRender.DrawLine(pen, rect_y.Width, y, rect_y.Width - 3, y);
                }

                next_degree += 0.5;
                count_degree++;
            }

            string end_name = (end_km).ToString();
            SizeF end_sf = gRender.MeasureString(end_name, font);
            gRender.DrawLine(pen, rect_y.Width, 0, rect_y.Width - 5, 0);
            gRender.DrawString(end_name, font, brush, rect_y.Width - end_sf.Width - 5, 0);

            Font titlefont = new System.Drawing.Font("宋体", 10, FontStyle.Bold);
            string scale_title = "高度(KM)";
            int scale_title_length = (int)gRender.MeasureString(scale_title, titlefont).Height;
            Point scale_title_p = new Point(0, (Y_height - 36 - scale_title_length) / 2);
            System.Drawing.StringFormat drawFormat = new System.Drawing.StringFormat(StringFormatFlags.DirectionVertical);
            gRender.DrawString(scale_title, titlefont, brush, scale_title_p, drawFormat);

            Y_Image = imgRender;

            titlefont.Dispose();
            font.Dispose();
            brush.Dispose();
            pen.Dispose();
        }

        /// <summary>
        /// 绘制色阶图
        /// </summary>
        private void paint_Colorbar()
        {
            int Bar_width = 45;
            int Bar_height = pic_Height - 51;

            Rectangle rect_bar = new Rectangle(0, 0, Bar_width, Bar_height);

            Image imgRender = new Bitmap(rect_bar.Width, rect_bar.Height);
            Graphics gRender = Graphics.FromImage(imgRender);

            picPaint_ColorMapBar(rect_bar, gRender);

            Bar_Image = imgRender;
        }

        /// <summary>
        /// 拼接输出完整伪彩色图
        /// </summary>
        /// <param name="SavePath"></param>
        public Image CombineImages()
        {
            try
            {
                Image finalImg = new Bitmap(pic_Width, pic_Height, PixelFormat.Format32bppArgb);
                Graphics g = Graphics.FromImage(finalImg);
                g.Clear(SystemColors.AppWorkspace);
                g.FillRectangle(Brushes.White, 0, 0, finalImg.Width, finalImg.Height);

                int totalwidth = pic_Width;
                int totalheight = pic_Height;
                //Y坐标
                Image img = Y_Image;
                int width = 0;
                int height = totalheight - img.Height;
                g.DrawImage(img, new Point(width, height));

                ////X坐标
                width = img.Width;
                img = X_Image;
                height = totalheight - img.Height;
                g.DrawImage(img, new Point(width, height));

                //绘制渲染图
                img = Cer_Image;
                height = height - img.Height;
                g.DrawImage(img, new Point(width, height));

                //颜色条
               img = Bar_Image;
               width = totalwidth - img.Width;
               g.DrawImage(img, new Point(width, height));

               Font font = new Font("宋体", 9);
               SolidBrush brush = new SolidBrush(Color.Black);
               string str = Title;
               SizeF sf = g.MeasureString(str, font);
               g.DrawString(str, font, brush, new Point((int)(finalImg.Width - sf.Width) / 2, 2));
               brush.Dispose();
               font.Dispose();

               img = new Bitmap(1, 1);
                img.Dispose();

                g.Dispose();
                return finalImg;
            }
            catch (System.Exception ex)
            {
                if (ErrorInfo != null)
                {
                    PseudoEventArgs args = new PseudoEventArgs(ex.Message);
                    ErrorInfo(this, args);
                }
                return null;
            }
        }

        /// <summary>
        /// 绘制色阶图
        /// </summary>
        /// <param name="rect"></param>
        /// <param name="gRender"></param>
        private void picPaint_ColorMapBar(Rectangle rect, Graphics gRender)
        {
            int x = rect.Left;
            int y = rect.Top;
            int ex = rect.Right;
            int ey = rect.Bottom;
            int w = ex - x;
            int h = ey - y;
            int sx;

            Point ClrDemoLT = new Point(x, y);
            Point ClrDemoRB = new Point(x + COLORWIDTH, ey);

            Pen pen;
            Brush brush = new SolidBrush(Color.FromArgb(200, 67, 78, 84));
            Font font = new Font("宋体", 9);

            #region 左侧
            ///*
            //绘制色条
            for (int i = ey; i > y; i--)
            {
                int index = (int)((double)(ey - i) / h * PCOLORNUM);
                Color crColor = m_PColorTable[index]; //得到颜色

                sx = ClrDemoLT.X;
                ex = ClrDemoRB.X;
                pen = new Pen(crColor, 1);
                gRender.DrawLine(pen, sx, i, ex, i);
            }

            // 下面为画ColorBar的边界（为矩形）
            pen = new Pen(Color.LightBlue, 2);
            gRender.DrawLine(pen, ClrDemoLT.X, ClrDemoLT.Y, ClrDemoLT.X, ClrDemoRB.Y);
            gRender.DrawLine(pen, ClrDemoLT.X, ClrDemoRB.Y, ClrDemoRB.X, ClrDemoRB.Y);
            gRender.DrawLine(pen, ClrDemoRB.X, ClrDemoRB.Y, ClrDemoRB.X, ClrDemoLT.Y);
            gRender.DrawLine(pen, ClrDemoRB.X, ClrDemoLT.Y, ClrDemoLT.X, ClrDemoLT.Y);

            #region  输出ColorBar上面的最大最小值
            double dValue = 0;
            string sValue = "";// 显示在ColorBar上面的值
            Point pValue = new Point();
            SizeF sf = gRender.MeasureString("strTest", font);  //储存矩形(字符串)的高度和宽度

            //int gap = (int)Math.Floor((double)(h - Classes.ConfigurationFile.COLORSPLITPART * sf.Height) / (Classes.ConfigurationFile.COLORSPLITPART));
            int gap = (int)Math.Floor((double)(h - sf.Height * 5) / 4);

            for (int i = 0; i <= COLORSPLITPART + 1; i++)
            {
                dValue = dMin + (dMax - dMin) * i / COLORSPLITPART;
                sValue = String.Format("{0:0.00}", dValue);
                pValue.X = rect.Left + COLORWIDTH;
                //pValue.Y = (int)(rect.Bottom - sf.Height - i * (gap + sf.Height));
                pValue.Y = (int)(rect.Bottom - (i + 1) * sf.Height - i * gap);
                gRender.DrawString(sValue, font, brush, pValue.X, pValue.Y);
            }
            #endregion
            //*/
            #endregion

            font.Dispose();
            brush.Dispose();
            pen.Dispose();
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
        /// 获取传入数据的最大值与最小值
        /// </summary>
        /// <param name="e"></param>
        private void GetMaxMin(List<List<double>> e)
        {
            List<List<double>> dataset = e;

            for (int i = 0; i < dataset.Count; i++)
            {
                for (int j = offset_down; j < offset_up; j++)
                {
                    if (dataset[i][j] > dMax)
                    {
                        dMax = dataset[i][j];
                    }
                    if (dataset[i][j] < dMin)
                    {
                        dMin = dataset[i][j];
                    }
                }
            }

        }

        #region 实时显示从当前时间向前推24小时内的伪彩图


        string lastDate;
        string firstDate;
        bool resize = false;

        private void PaintRt()
        {
            int Cer_width = pic_Width - 115;
            int Cer_height = pic_Height - 51;

            DateTime skip_current = skip_starttime;

            Rectangle rect = new Rectangle(0, 0, Cer_width, Cer_height);
            image = new Bitmap(Cer_width, Cer_height);
            Graphics gRender = Graphics.FromImage(image);
            Pen pen = new Pen(Color.Black, 2);

            DateTime lastfile_time = skip_endtime;
            DateTime firstfile_time = skip_starttime;

            int Counter = data_source.Count;
            int linewidth = (int)(rect.Width / Counter) + 1;   // 每一个数据文件对应的渲染图中间的大小（竖线）

            //double linewidth = (0.1 / 24) * rect.Width;

            double linex = 0;


            for (int i = 0; i < Counter; i++)// 一共有counter个采集数据 （竖）
            {

                //DateTime current_time = DateTime.ParseExact(list_filename[i],
                //"yyyyMMddHH.mmss", System.Globalization.CultureInfo.CurrentCulture);
                //linex = rect.Width * (current_time - firstfile_time).Ticks / (lastfile_time - firstfile_time).Ticks;



                linex = (double)rect.Width / Counter * i;

                List<double> BinVect = data_source[i];
                // 画一个采集数据文件的渲染图
                for (int n = 0; n < linewidth; n++) //  (横)
                {
                    picPaint_RenderLine(rect, linex + n, BinVect, gRender); //画 一个采集数据中的图中的一个竖直的部分 (竖)
                }
            }

            Cer_Image = image;

            pen.Dispose();
            gRender.Dispose();
        }





        /// <summary>
        /// 生成实时图片，从当前时间向前推24小时
        /// </summary>
        /// <param name="data"></param>
        /// <param name="namelist"></param>
        /// <param name="title"></param>
        /// <param name="value_max"></param>
        /// <param name="value_min"></param>
        /// <param name="st"></param>
        /// <param name="et"></param>
        /// <returns></returns>
        public Image setValue(List<List<double>> data, List<string> namelist, string title, double value_max, double value_min
                              )
        {

            if (pic_Width >= 300 && pic_Height >= 150)
            {
                start_km = con_axsiBottom / 1000;
                end_km = con_axsiTop / 1000;

                Title = title;
                if (data.Count != 0)
                {
                    if (data_source.Count == 0 || lastDate != namelist[namelist.Count - 1] || firstDate != namelist[0])
                    {
                        data_source = data;
                        lastDate = namelist[namelist.Count - 1];
                        firstDate = namelist[0];
                        string temp = "";
                        if (namelist[0].Contains("HF"))
                        {
                            temp = namelist[0].Substring(2, 10);
                        }
                        else
                        {
                            temp = namelist[0].Substring(0, 10);
                        }


                        //string temptime = st.ToString("yyyyMMddHH");
                        //skip_starttime = DateTime.ParseExact(temptime, "yyyyMMddHH", System.Globalization.CultureInfo.CurrentCulture);// 5.13
                        skip_starttime = DateTime.ParseExact(temp, "yyyyMMddHH", System.Globalization.CultureInfo.CurrentCulture);

                        if (namelist[namelist.Count - 1].Contains("HF"))
                        {
                            temp = namelist[namelist.Count - 1].Substring(2, 10);
                        }
                        else
                        {
                            temp = namelist[namelist.Count - 1].Substring(0, 10);
                        }

                        //temptime = et.ToString("yyyyMMddHH");
                        //skip_endtime = DateTime.ParseExact(temptime, "yyyyMMddHH", System.Globalization.CultureInfo.CurrentCulture);
                        skip_endtime = DateTime.ParseExact(temp, "yyyyMMddHH", System.Globalization.CultureInfo.CurrentCulture);

                        SetColorBarArray();

                        image = null;
                        imageGrid = null;
                        list_filename = namelist;
                        offset_up = (int)(end_km / Res);
                        offset_down = (int)(start_km / Res);

                        dMax = value_max;
                        dMin = value_min;
                    }

                    Title = title;
                    resize = true;

                    paint_X();
                    paint_Y();
                    paint_Colorbar();
                    PaintRt();

                    return CombineImages();

                }
                else
                    return null;
            }
            else
                return null;
        }


        private void paint_X()
        {
            int X_width = pic_Width - 50;
            int X_height = 36;
            Rectangle rect_x = new Rectangle(0, 0, X_width - 65, X_height);

            Image imgRender = new Bitmap(X_width, X_height);
            Graphics gRender = Graphics.FromImage(imgRender);
            Pen pen = new Pen(Color.LightBlue, 3);
            Font font = new Font("宋体", 9);
            SolidBrush brush = new SolidBrush(Color.FromArgb(200, 67, 78, 84));//创建一般画刷

            SolidBrush brush2 = new SolidBrush(Color.Blue);//创建一般画刷

            gRender.DrawLine(pen, 0, 0, rect_x.Width, 0);//绘制轴线

            #region 绘制长短刻度
            int filecount = list_filename.Count;
            List<string> list_degreename = new List<string>();

            #region skip绘图
            int tempwidth_skip = (int)(rect_x.Width / (degree_countX - 1));
            for (int i = 0; i < degree_countX; i++)
            {
                DateTime temp_datetime = skip_starttime + new TimeSpan((int)((skip_endtime - skip_starttime).TotalHours * i / (degree_countX - 1)), 0, 0);
                string str_time = temp_datetime.ToString("HH:mm");
                string str_date = temp_datetime.ToString("yyyyMMddHHmmss");
                str_date = str_date.Substring(4, 2) + @"\" + str_date.Substring(6, 2) + @"\" + str_date.Substring(0, 4);

                gRender.DrawLine(pen, tempwidth_skip * i, 0, tempwidth_skip * i, 6);
                gRender.DrawString(str_time, font, brush2, tempwidth_skip * i, 6);
                gRender.DrawString(str_date, font, brush2, tempwidth_skip * i, 25);

                if (i != degree_countX - 1)
                {
                    gRender.DrawLine(pen, tempwidth_skip * i + tempwidth_skip / 2, 0, tempwidth_skip * i + tempwidth_skip / 2, 4);
                }
            }
            #endregion

            #endregion
            list_degreename.Clear();
            X_Image = imgRender;

            font.Dispose();
            brush.Dispose();
            brush2.Dispose();
            pen.Dispose();
        }
        #endregion
    }

    public class PseudoEventArgs : EventArgs
    {
        public string strErrorInfo { get; set; }

        public PseudoEventArgs(string errorinfo)
        {
            strErrorInfo = errorinfo;
        }
    }
}
