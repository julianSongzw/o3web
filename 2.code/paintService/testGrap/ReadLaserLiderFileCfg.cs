using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace testGrap
{
    class ReadLaserLiderFileCfg
    {
        //绘制信息
        public static Dictionary<string, Tuple<double, double>> itemRange = new Dictionary<string, Tuple<double, double>>();

        public static int stHeight = -1;
        public static int etHeight = -1;
        public static double step = -1;

        public static string historypath = "";

        public static void ReadConfiguration()
        {

            XmlDocument xmlDoc = new XmlDocument();
            XmlNodeList nodeList;
            try
            {
                string xmlPath = System.IO.Directory.GetCurrentDirectory() + @"\LaserLiderFileCfg.xml";
                xmlDoc.Load(xmlPath);
                nodeList = xmlDoc.SelectSingleNode("Config").ChildNodes;
                foreach (XmlNode xn in nodeList)
                {
                    switch (xn.Name)
                    {
                        case "item":
                            LoadItemInfo(xn);
                            break;
                        case "range":
                            LoadRangeInfo(xn);
                            break;
                        case "path":
                            LoadPathInfo(xn);
                            break;
                    }
                }
            }
            catch (Exception e)
            {
            }
        }

        private static void LoadItemInfo(XmlNode xn)
        {
            XmlNodeList systemcodechildren = xn.ChildNodes;
            foreach (XmlNode xn1 in systemcodechildren)
            {
                if (xn1.NodeType == XmlNodeType.Element)
                {
                    string code = xn1.Attributes["key"].Value;
                    string maxvalue = xn1.Attributes["maxvalue"].Value;
                    string minvalue = xn1.Attributes["minvalue"].Value;
                    Tuple<double, double> value = new Tuple<double, double>(double.Parse(maxvalue), double.Parse(minvalue));
                    itemRange.Add(code, value);
                }
            }
        }
        private static void LoadRangeInfo(XmlNode xn)
        {
            XmlNodeList systemcodechildren = xn.ChildNodes;
            foreach (XmlNode xn1 in systemcodechildren)
            {
                if (xn1.NodeType == XmlNodeType.Element)
                {
                    string code = xn1.Attributes["name"].Value;
                    etHeight = int.Parse(xn1.Attributes["maxvalue"].Value);
                    stHeight = int.Parse(xn1.Attributes["minvalue"].Value);
                    step = double.Parse(xn1.Attributes["step"].Value);
                    break;
                }
            }
        }

        private static void LoadPathInfo(XmlNode xn)
        {
            XmlNodeList systemcodechildren = xn.ChildNodes;
            foreach (XmlNode xn1 in systemcodechildren)
            {
                if (xn1.NodeType == XmlNodeType.Element)
                {
                    historypath = xn1.Attributes["filepath"].Value;
                    break;
                }
            }
        }
    }
}
