
namespace LidarFileAndData
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Runtime.InteropServices;
    using System.Text;

    public class ExportPara
    {
        #region DllImport导入"LidarAnalyDLL.dll"
        /// <summary>
        /// 数据拼接
        /// </summary>
        /// <param name="analog">小信号</param>
        /// <param name="photon">大信号</param>
        /// <param name="outdata">拼接输出信号</param>
        /// <param name="jointStart_km"></param>
        /// <param name="jointEnd_km">拼接范围</param>
        /// <param name="binWidth">空间分辨率，单位km，7.5</param>
        /// <param name="CorrCoeff">最小相关系数</param>
        /// <param name="IsJoint">是否拼接</param>
        /// <param name="NumofBins">数据点的总数</param>
        [DllImport("LidarAnalyDLL.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.Cdecl)]
        static extern void AnalogAddPhotonCounting(double[] analog, double[] photon, double[] outdata, double jointStart_km, double jointEnd_km, double binWidth, double CorrCoeff, ref int IsJoint, int NumofBins);

        /// <summary> 
        /// PRR
        /// </summary>
        /// <param name="pInBins">原始回波信号输入</param>
        /// <param name="pOutBins">计算结果输出</param>
        /// <param name="NumofBins">数组pInBinsp和OutBins的长度，两个数组必须一样大小</param>
        /// <param name="BinWidth_km"></param>
        /// <param name="bkstart_km"></param>
        /// <param name="bkend_km">取背景的起止高度、截止高度。</param>
        [DllImport("LidarAnalyDLL.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.Cdecl)]
        static extern void GetPRR(double[] pInBins, double[] pOutBins, int NumofBins, double BinWidth_km, double bkstart_km, double bkend_km, double gystart_km, double gyend_km);

        /// <summary>
        /// 消光系数
        /// </summary>
        /// <param name="Signal">原始信号或者拼接信号</param>
        /// <param name="pOutBins">输出</param>
        /// <param name="NumofBins"></param>
        /// <param name="BinWidth_km"></param>
        /// <param name="wavelen_nm">该通道对应的波长，单位为nm，高能雷达应为355或532</param>
        /// <param name="angle">激光雷达扫描角度</param>
        /// <param name="bkstart_km"></param>
        /// <param name="bkend_km">背景选取结束高度</param>
        [DllImport("LidarAnalyDLL.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.Cdecl)]
        static extern void GetExtinction(double[] Signal, double[] pOutBins, int NumofBins, double BinWidth_km, double wavelen_nm, double angle, double bkstart_km, double bkend_km, double gystart_km, double gyend_km);

        /// <summary>
        /// 退偏振比
        /// </summary>
        /// <param name="PRR_P">532平行通道PRR数组</param>
        /// <param name="PRR_S">532垂直通道PRR数组</param>
        /// <param name="pOutBins"></param>
        /// <param name="NumofBins"></param>
        /// <param name="GainR">增益系数，约为1，需通过实验确定</param>
        [DllImport("LidarAnalyDLL.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.Cdecl)]
        static extern void GetDepolRatio(double[] PRR_P, double[] PRR_S, double[] pOutBins, int NumofBins, double GainR);

        /// <summary>
        /// 边界层
        /// </summary>
        /// <param name="PRR_P">532平行通道PRR数组</param>
        /// <param name="pOutBins"></param>
        /// <param name="BinWidth_km"></param>
        /// <param name="NumofBins"></param>
        /// <param name="Hstart_km"></param>
        /// <param name="Hend_km">Hstart_km,Hend_km: 边界层搜索的高度起点、终点，单位km</param>
        /// 例如Hstart_km = 0.5，Hend_km = 2.2即在0.5到2.2km之间搜索边界层。返回值double，为边界层高度，单位km
        /// <returns></returns>
        [DllImport("LidarAnalyDLL.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.Cdecl)]
        static extern double GetPBL(double[] PRR_P, double[] pOutBins, double BinWidth_km, int NumofBins, double Hstart_km, double Hend_km);

        /// <summary>
        /// 信噪比
        /// </summary>
        /// <param name="PRR"></param>
        /// <param name="pOutBins"></param>
        /// <param name="BinWidth_km"></param>
        /// <param name="NumofBins"></param>
        [DllImport("LidarAnalyDLL.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.Cdecl)]
        static extern void GetSNRatio(double[] PRR, double[] pOutBins, double BinWidth_km, int NumofBins);

        /// <summary>
        /// 光学厚度
        /// </summary>
        /// <param name="pExtinction">消光系数数组，输入</param>
        /// <param name="BinWidth_km"></param>
        /// <param name="NumofBins"></param>
        /// <param name="Hstart_km"></param>
        /// <param name="Hend_km">Hstart_km,Hend_km：计算AOD的起始、终止高度，单位km。例如，Hstart_km = 0.5，Hend_km = 2.5</param>
        /// <returns></returns>
        [DllImport("LidarAnalyDLL.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.Cdecl)]
        static extern double GetOpticalDepth(double[] pExtinction, double BinWidth_km, int NumofBins, double Hstart_km, double Hend_km);

        /// <summary>
        /// 波长指数
        /// </summary>
        /// <param name="pExtinc532"></param>
        /// <param name="pExtinc355">355和532两个波长的消光系数</param>
        /// <param name="pOutBins"></param>
        /// <param name="BinWidth_km"></param>
        /// <param name="NumofBins"></param>
        [DllImport("LidarAnalyDLL.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.Cdecl)]
        static extern void GetWavelengthExponents(double[] pExtinc532, double[] pExtinc355, double[] pOutBins, double BinWidth_km, int NumofBins);

        /// <summary>
        /// 能见度
        /// </summary>
        /// <param name="pExtinc532">532波长的消光系数</param>
        /// <param name="BinWidth_km"></param>
        /// <param name="NumofBins"></param>
        /// <param name="Hstart_km"></param>
        /// <param name="Hend_km">利用哪一段高度的消光系数估算能见度。例如，Hstart_km = 0.3，Hend_km = 0.7</param>
        /// <returns></returns>
        [DllImport("LidarAnalyDLL.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.Cdecl)]
        static extern double GetVisibility(double[] pExtinc532, double BinWidth_km, int NumofBins, double Hstart_km, double Hend_km);

        /// <summary>
        /// PM10
        /// </summary>
        /// <param name="pExtinc532">532波长的消光系数</param>
        /// <param name="pOutBins"></param>
        /// <param name="NumofBins"></param>
        /// <param name="fa"></param>
        /// <param name="fb">fa,fb：系数a  系数b//测试可以使用fa = 200, fb = -5</param>
        [DllImport("LidarAnalyDLL.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.Cdecl)]
        static extern void GetPM10(double[] pExtinc532, double[] pOutBins, int NumofBins, double fa, double fb);

        /// <summary>
        /// 使用阈值法搜索云底、云峰、云顶高度
        /// </summary>
        /// <param name="rawdata">原始回波信号输入</param>
        /// <param name="binwidth">空间分辨率km</param>
        /// <param name="bkstart_km">10km</param>
        /// <param name="bkend_km">12km</param>
        /// <param name="k">云的层数</param>
        /// <param name="cloudBaseHeight">多层云云底高度 最多三层云</param>
        /// <param name="cloudPeakHeight">多层云云峰高度 最多三层云</param>
        /// <param name="cloudTopHeight">多层云云顶高度  最多三层云</param>
        /// <param name="NumofBins"></param>
        [DllImport("LidarAnalyDLL.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.Cdecl)]
        static extern void GetCloudBaseTh(double[] rawdata, double binwidth, double bkstart_km, double bkend_km, ref int k,
        double[] cloudBaseHeight, double[] cloudPeakHeight, double[] cloudTopHeight, int NumofBins, double gystart_km, double gyend_km);
        #endregion

        public DataPara datapara = new DataPara();
        private LicelFileIO File_Lince = new LicelFileIO();

        public void listClear()
        {
            datapara.addedfile_count = 0;
            datapara.Huminity.Clear();
            datapara.fRawData.Clear();
            datapara.fPRR_0.Clear();
            datapara.fPRR_1.Clear();
            datapara.fOutBinsExtinction.Clear();//消光
            datapara.fOutBinsExtinction355.Clear();//355消光
            datapara.fDepolRatio.Clear();//退偏振比
            datapara.fPBL.Clear();//边界层
            datapara.fOriginate.Clear();//污染物输送通量
            datapara.fOPD.Clear();//光学厚度
            datapara.fWavelengthExponents.Clear();//波长指数
            datapara.fVisibility.Clear();
            datapara.fPM10.Clear();
            datapara.fcloudbase.Clear();
            datapara.fcloudpeak.Clear();
            datapara.fcloudtop.Clear();
            datapara.fPollution.Clear();//污染物0无/1气溶胶/2沙尘/3水云/4冰云
            datapara.filenamelist.Clear();
            datapara.Dic_DataBase.Clear();
        }

        public List<double> NanDelete(double[] data)
        {

            List<double> templist = new List<double>();

            if (data.Length != 0)
            {
                for (int i = 0; i < data.Length; i++)
                {
                    if (double.IsInfinity(data[i]) == true || double.IsNaN(data[i]) == true)
                    {
                        templist.Add(0);
                    }
                    else
                        templist.Add(data[i]);
                }
            }

            return templist;
        }

        //导出所有参数
        public void Files_DataProcess(int i_index)
        {
            double fBinWidth = (double)File_Lince.m_DataSet[0]._BinWidth / 1000;
            int count_Dataset = File_Lince.m_DataSet[0]._BinVect.Count;
            int joint = 0;

            double[] fAnalog = new double[count_Dataset];//小信号 532P
            double[] fPhoton = new double[count_Dataset];//大信号 532P
            double[] fAnalog2 = new double[count_Dataset];//小信号 532S
            double[] fPhoton2 = new double[count_Dataset];//大信号 532S
            double[] fAnalog3 = new double[count_Dataset];//小信号 355
            double[] fPhoton3 = new double[count_Dataset];//大信号 355
            double[] fOutdata = new double[count_Dataset];//拼接信号输出P
            double[] fOutdata2 = new double[count_Dataset];//拼接信号输出S
            double[] fOutdata3 = new double[count_Dataset];//拼接信号输出355

            for (int i = 0; i < count_Dataset; i++)
            {
                fAnalog[i] = File_Lince.m_DataSet[0]._BinVect[i];
                fPhoton[i] = File_Lince.m_DataSet[1]._BinVect[i];
                fAnalog2[i] = File_Lince.m_DataSet[2]._BinVect[i];
                fPhoton2[i] = File_Lince.m_DataSet[3]._BinVect[i];
                fAnalog3[i] = File_Lince.m_DataSet[4]._BinVect[i];
                fPhoton3[i] = File_Lince.m_DataSet[5]._BinVect[i];
            }

            #region 湿度信息
            datapara.Huminity.Add(File_Lince.m_Header.m_Humidity);
            #endregion

            #region 信号拼接
            AnalogAddPhotonCounting(fAnalog, fPhoton, fOutdata, 1, 2, fBinWidth, 0.9f, ref joint, count_Dataset);
            AnalogAddPhotonCounting(fAnalog2, fPhoton2, fOutdata2, 1, 2, fBinWidth, 0.9f, ref joint, count_Dataset);
            AnalogAddPhotonCounting(fAnalog3, fPhoton3, fOutdata3, 1, 2, fBinWidth, 0.9f, ref joint, count_Dataset);

            List<double> templist = new List<double>();
            templist = NanDelete(fOutdata);
            datapara.fRawData.Add(templist);
            #endregion

            #region PRR0
            templist = new List<double>();
            double[] single_PRR0 = new double[count_Dataset];
            GetPRR(fOutdata, single_PRR0, count_Dataset, fBinWidth, 15, 16, 0.15, 0.25);
            templist = NanDelete(single_PRR0);
            datapara.fPRR_0.Add(templist);
            #endregion

            #region PRR1
            templist = new List<double>();
            double[] single_PRR1 = new double[count_Dataset];
            GetPRR(fOutdata2, single_PRR1, count_Dataset, fBinWidth, 15, 16, 0.15, 0.25);
            templist = NanDelete(single_PRR1);
            datapara.fPRR_1.Add(templist);
            #endregion

            #region 计算消光
            templist = new List<double>();
            double[] single_fOutBinsExtinction = new double[count_Dataset];
            GetExtinction(fOutdata, single_fOutBinsExtinction, count_Dataset, fBinWidth, 532, 90, 15, 16, 0.15, 0.25);
            templist = NanDelete(single_fOutBinsExtinction);
            datapara.fOutBinsExtinction.Add(templist);

            templist = new List<double>();
            double[] single_fOutBinsExtinction355 = new double[count_Dataset];
            GetExtinction(fOutdata3, single_fOutBinsExtinction355, count_Dataset, fBinWidth, 355, 90, 15, 16, 0.15, 0.25);
            templist = NanDelete(single_fOutBinsExtinction355);
            datapara.fOutBinsExtinction355.Add(templist);
            #endregion

            #region 计算退偏 此处暂用0、2通道
            templist = new List<double>();
            double[] p_prr = new double[count_Dataset];
            double[] s_prr = new double[count_Dataset];
            GetPRR(fAnalog, p_prr, count_Dataset, fBinWidth, 15, 16, 0.15, 0.25);//0通道PRR
            GetPRR(fAnalog2, s_prr, count_Dataset, fBinWidth, 15, 16, 0.15, 0.25);//2通道PRR
            double[] single_fDepolRatio = new double[count_Dataset];//单次退偏数组
            GetDepolRatio(s_prr, p_prr, single_fDepolRatio, count_Dataset, 1);//增益暂定1
            templist = NanDelete(single_fDepolRatio);
            datapara.fDepolRatio.Add(templist);
            #endregion

            #region 计算边界层 使用拼接后信号
            double[] PBL_Outbins = new double[count_Dataset];
            //double[] AAPC_prr = new double[count_Dataset];
            //GetPRR(fOutdata, AAPC_prr, count_Dataset, fBinWidth, 15, 16);
            double single_pbl = GetPBL(single_PRR0, PBL_Outbins, fBinWidth, count_Dataset, 15, 16);
            datapara.fPBL.Add(single_pbl);//边界层搜索范围0.5~1.8
            #endregion

            #region 光学厚度
            datapara.fOPD.Add(GetOpticalDepth(single_fOutBinsExtinction, fBinWidth, count_Dataset, 0.1, 3));//0.2-2.5
            #endregion

            #region 波长指数
            templist = new List<double>();
            single_fOutBinsExtinction355 = new double[count_Dataset];//355消光
            double[] single_fWavelengthExponents = new double[count_Dataset];
            GetExtinction(fOutdata3, single_fOutBinsExtinction355, count_Dataset, fBinWidth, 532, 90, 15, 16, 0.15, 0.25);
            GetWavelengthExponents(single_fOutBinsExtinction, single_fOutBinsExtinction355, single_fWavelengthExponents, fBinWidth, count_Dataset);
            templist = NanDelete(single_fWavelengthExponents);
            datapara.fWavelengthExponents.Add(templist);
            #endregion

            #region 能见度
            datapara.fVisibility.Add(GetVisibility(single_fOutBinsExtinction, fBinWidth, count_Dataset, 0.1, 0.2));//用0.3~0.7的消光计算能见度
            #endregion

            #region PM10
            templist = new List<double>();
            double[] single_fPM10 = new double[count_Dataset];
            GetPM10(single_fOutBinsExtinction, single_fPM10, count_Dataset, 200, -5);
            templist = NanDelete(single_fPM10);
            datapara.fPM10.Add(templist);
            #endregion

            #region 搜索云底高度
            int cloud_k = 3;
            double[] single_fcloudbase = new double[cloud_k];
            double[] single_fcloudpeak = new double[cloud_k];
            double[] single_fcloudtop = new double[cloud_k];

            GetCloudBaseTh(fOutdata, fBinWidth, 10, 12, ref cloud_k, single_fcloudbase, single_fcloudpeak, single_fcloudtop, count_Dataset, 0, 0.2);

            templist = new List<double>();
            for (int i = 0; i < single_fcloudbase.Length; i++)
            {
                templist.Add(single_fcloudbase[i]);
            }
            datapara.fcloudbase.Add(templist);

            templist = new List<double>();
            for (int i = 0; i < single_fcloudpeak.Length; i++)
            {
                templist.Add(single_fcloudpeak[i]);
            }
            datapara.fcloudpeak.Add(templist);

            templist = new List<double>();
            for (int i = 0; i < single_fcloudtop.Length; i++)
            {
                templist.Add(single_fcloudtop[i]);
            }
            datapara.fcloudtop.Add(templist);
            #endregion

            #region 污染物判别
            /*
            List<double> single_pollution = new List<double>();
            for (int i = 0; i < count_Dataset; i++)
            {
                if (single_fOutBinsExtinction[i] > extinc_max || single_fOutBinsExtinction[i] < extinc_min)
                    single_fOutBinsExtinction[i] = extinc_min;
                if (single_fDepolRatio[i] > deplor_max || single_fDepolRatio[i] < deplor_min)
                    single_fDepolRatio[i] = deplor_min;

                double extinc_temp = 0.2 * (extinc_max - extinc_min);
                double deplor_temp = 0.2 * (deplor_max - deplor_min);

                if (single_fOutBinsExtinction[i] < extinc_temp)
                {
                    if (single_fDepolRatio[i] < deplor_temp)
                        single_pollution.Add(1);
                    else if (single_fDepolRatio[i] > 4 * deplor_temp)
                        single_pollution.Add(2);
                    else
                        single_pollution.Add(0);
                }
                else if (single_fOutBinsExtinction[i] > 4 * extinc_temp)
                {
                    if (single_fDepolRatio[i] < deplor_temp)
                        single_pollution.Add(3);
                    else if (single_fDepolRatio[i] > 4 * deplor_temp)
                        single_pollution.Add(4);
                    else
                        single_pollution.Add(0);
                }
                else
                    single_pollution.Add(0);
            }
            fPollution.Add(single_pollution);*/
            #endregion

            #region 污染物输送通量
            int single_pbl_temp = (int)(single_pbl / 0.0075);
            double dlocal = 0;
            double dnonlocal = 0;
            for (int i = 27; i < single_pbl_temp; i++)
            {
                if (single_fOutBinsExtinction[i] < 5)
                {
                    dlocal += single_fOutBinsExtinction[i];
                }
            }
            for (int i = single_fOutBinsExtinction.Length - 1; i > single_pbl_temp; i--)
            {
                if (single_fOutBinsExtinction[i] < 5)
                {
                    dnonlocal += single_fOutBinsExtinction[i];
                }
            }
            if (dlocal != 0)
            {
                datapara.fOriginate.Add(dnonlocal / (dlocal + dnonlocal));
            }
            else
                datapara.fOriginate.Add(1);
            #endregion
        }

        /// <summary>
        /// 加载实时数据（24小时内）
        /// </summary>
        /// <param name="filepath">文件夹路径</param>
        /// <param name="axsiTop">显示高度</param>
        public void Files_Load(string filepath, int axsiTop)
        {
            try
            {
                listClear();

                DirectoryInfo info = new DirectoryInfo(filepath + @"\");

                int refreshfilecount = 0;
                DateTime dtnow = DateTime.Now;

                //Dic_DataBase = new Tuple<DateTime,int,int>();//Tuple<DateTime, int, int>();
                DateTime dt;
                int database_km = axsiTop;
                string today = dtnow.ToString("yyyyMMdd");
                string yesterday = dtnow.AddDays(-1).ToString("yyyyMMdd");
                int i = 0;

                foreach (FileInfo file in info.GetFiles("*" + yesterday + "*.*"))
                {
                    string strDateTime = file.FullName.Substring(file.FullName.Length - 15, 10) +
                        file.FullName.Substring(file.FullName.Length - 4, 4);
                    DateTime fileTime = DateTime.ParseExact(strDateTime, "yyyyMMddHHmmss",
                        System.Globalization.CultureInfo.InvariantCulture);
                    if (dtnow.AddMinutes(-10) < fileTime.AddHours(24))
                    {
                        string temp_filename = file.FullName.Substring(file.FullName.Length - 15, 15);
                        datapara.filenamelist.Add(file.FullName);
                        refreshfilecount++;
                        dt = DateTime.ParseExact(temp_filename, "yyyyMMddHH.mmss", System.Globalization.CultureInfo.CurrentCulture);
                        datapara.Dic_DataBase.Add(new Tuple<DateTime, int, int>(dt, i++, database_km));
                    }
                }

                foreach (FileInfo file in info.GetFiles("*" + today + "*.*"))
                {
                    string strDateTime = file.FullName.Substring(file.FullName.Length - 15, 10) +
                        file.FullName.Substring(file.FullName.Length - 4, 4);
                    DateTime fileTime = DateTime.ParseExact(strDateTime, "yyyyMMddHHmmss",
                        System.Globalization.CultureInfo.InvariantCulture);

                    string temp_filename = file.FullName.Substring(file.FullName.Length - 15, 15);
                    datapara.filenamelist.Add(file.FullName);
                    refreshfilecount++;
                    dt = DateTime.ParseExact(temp_filename, "yyyyMMddHH.mmss", System.Globalization.CultureInfo.CurrentCulture);
                    datapara.Dic_DataBase.Add(new Tuple<DateTime, int, int>(dt, i++, database_km));
                }

                File_Lince = null;

                //for (int j = 0; j < allfilecount; j++)
                for (int j = 0; j < refreshfilecount; j++)
                {
                    File_Lince = new LicelFileIO();
                    File_Lince.LoadFile(datapara.filenamelist[j]);

                    Files_DataProcess(j);

                    datapara.addedfile_count++;
                }
            }
            catch (System.Exception ex)
            {
                //MessageBox.Show("请查看所选文件夹中文件格式是否正确！\r\n原因：" + ex.Message, "确认", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        /// <summary>
        /// 加载历史数据（最多七天）
        /// </summary>
        /// <param name="filepath">文件夹路径</param>
        /// <param name="axsiTop">显示高度</param>
        /// <param name="start">开始日期</param>
        /// <param name="end">结束日期</param>
        public void Files_Load(string filepath, int axsiTop,DateTime start, DateTime end)
        {
            TimeSpan ts = new TimeSpan(7, 0, 0, 0);
            if (end - start > ts)
            {
                //MessageBox.Show("请输入一周以内的数据进行查询！");
            }
            else if (end < start)
            {
                //MessageBox.Show("请重新输入时间，结束时间必须大于开始时间！");
            }
            else
            {
                try
                {
                    listClear();
                    DirectoryInfo info = new DirectoryInfo(filepath + @"\");

                    ////Dic_DataBase = new Dictionary<DateTime, int>();
                    DateTime dt;
                    int database_km = axsiTop;

                    int i = 0;
                    while (start < end.AddDays(1))
                    {
                        string str_start = start.ToString("yyyyMMdd");
                        start = start.AddDays(1);
                        foreach (FileInfo file in info.GetFiles("*" + str_start + "*.*"))
                        {
                            string strDateTime = file.FullName.Substring(file.FullName.Length - 15, 10) + file.FullName.Substring(file.FullName.Length - 4, 4);
                            DateTime fileTime = DateTime.ParseExact(strDateTime, "yyyyMMddHHmmss", System.Globalization.CultureInfo.InvariantCulture);
                            string temp_filename = file.FullName.Substring(file.FullName.Length - 15, 15);
                            datapara.filenamelist.Add(file.FullName);
                            dt = DateTime.ParseExact(temp_filename, "yyyyMMddHH.mmss", System.Globalization.CultureInfo.CurrentCulture);
                            ////Dic_DataBase.Add(dt, database_km);
                            datapara.Dic_DataBase.Add(new Tuple<DateTime, int, int>(dt, i++, database_km));
                            datapara.addedfile_count++;
                        }
                    }

                    File_Lince = null;

                    for (int j = 0; j < datapara.addedfile_count; j++)
                    {
                        File_Lince = new LicelFileIO();
                        File_Lince.LoadFile(datapara.filenamelist[j]);

                        Files_DataProcess(j);
                    }
                }
                catch (System.Exception ex)
                {
                    //MessageBox.Show("请查看所选文件夹中文件格式是否正确！\r\n原因：" + ex.Message, "确认", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
            }
        }
    }
}
