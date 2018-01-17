
namespace LidarFileAndData
{
    using System;
    using System.Collections.Generic;

    public class DataPara
    {
        public int addedfile_count = 0;
        /// <summary>
        /// 湿度
        /// </summary>
        public List<double> Huminity = new List<double>();
        /// <summary>
        /// 原始数据
        /// </summary>
        public List<List<double>> fRawData = new List<List<double>>();
        /// <summary>
        /// prr0距离修正
        /// </summary>
        public List<List<double>> fPRR_0 = new List<List<double>>();
        /// <summary>
        /// prr1距离修正
        /// </summary>
        public List<List<double>> fPRR_1 = new List<List<double>>();
        /// <summary>
        /// 532消光
        /// </summary>
        public List<List<double>> fOutBinsExtinction = new List<List<double>>();
        /// <summary>
        /// 355消光
        /// </summary>
        public List<List<double>> fOutBinsExtinction355 = new List<List<double>>();
        /// <summary>
        /// 1064消光
        /// </summary>
        public List<List<double>> fOutBinsExtinction1064 = new List<List<double>>();
        /// <summary>
        /// 退偏
        /// </summary>
        public List<List<double>> fDepolRatio = new List<List<double>>();
        /// <summary>
        /// 边界层
        /// </summary>
        public List<double> fPBL = new List<double>();
        /// <summary>
        /// 污染物输送通量
        /// </summary>
        public List<double> fOriginate = new List<double>();
        /// <summary>
        /// 光学厚度
        /// </summary>
        public List<double> fOPD = new List<double>();
        /// <summary>
        /// 波长指数
        /// </summary>
        public List<List<double>> fWavelengthExponents = new List<List<double>>();
        /// <summary>
        /// 能见度
        /// </summary>
        public List<double> fVisibility = new List<double>();
        /// <summary>
        /// 颗粒物
        /// </summary>
        public List<List<double>> fPM10 = new List<List<double>>();
        /// <summary>
        /// 云信息-云底
        /// </summary>
        public List<List<double>> fcloudbase = new List<List<double>>();
        /// <summary>
        /// 云信息-云峰
        /// </summary>
        public List<List<double>> fcloudpeak = new List<List<double>>();
        /// <summary>
        /// 云信息-云顶
        /// </summary>
        public List<List<double>> fcloudtop = new List<List<double>>();
        /// <summary>
        /// 污染物分布 0无/1气溶胶/2沙尘/3水云/4冰云
        /// </summary>
        public List<List<double>> fPollution = new List<List<double>>();
        /// <summary>
        /// 文件名列表
        /// </summary>
        public List<string> filenamelist = new List<string>();
        /// <summary>
        /// 数据库用时间、索引值、高度值
        /// </summary>
        public List<Tuple<DateTime, int, int>> Dic_DataBase = new List<Tuple<DateTime, int, int>>();

    }
}
