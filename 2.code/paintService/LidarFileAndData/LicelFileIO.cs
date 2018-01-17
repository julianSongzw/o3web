namespace LidarFileAndData
{
    using System;
    using System.Collections.Generic;
    using System.IO;

    public class LicelFileIO
    {
        public List<DataSet> m_DataSet = new List<DataSet>();
        public DataHeader m_Header = new DataHeader();

        private DateTime FileNameToDataTime(string strFullName)
        {
            StreamReader reader = new StreamReader(new FileStream(strFullName, FileMode.Open, FileAccess.Read));
            reader.ReadLine();
            List<string> list = this.SplitString(reader.ReadLine().Trim());
            return new DateTime(int.Parse(list[1].Substring(6, 4)), int.Parse(list[1].Substring(3, 2)), int.Parse(list[1].Substring(0, 2)), int.Parse(list[2].Substring(0, 2)), int.Parse(list[2].Substring(3, 2)), int.Parse(list[2].Substring(6, 2)));
        }

        /* Original Code before applying change for GuanZhou Station */
        public void LoadFile(string fileName)
        {
            int num2;
            long offset = 0L;
            FileStream stream = new FileStream(fileName, FileMode.Open, FileAccess.Read);
            StreamReader reader = new StreamReader(stream);
            BinaryReader reader2 = new BinaryReader(stream);
            string bb = reader.ReadLine();
            offset += bb.Length + 2;
            bb = bb.TrimStart(new char[0]).TrimEnd(new char[0]);
            this.m_Header.m_Filename = bb;
            bb = reader.ReadLine();
            offset += bb.Length + 2;
            bb = bb.TrimStart(new char[0]).TrimEnd(new char[0]);
            List<string> list = this.SplitString(bb);
            string str2 = list[0];
            string str3 = list[1];
            string str4 = list[2];
            string str5 = list[3];
            string str6 = list[4];
            string s = list[5];
            string str8 = list[6];
            string str9 = list[7];
            string str10 = list[8];
            string str100 = "0";
            if (list.Count == 13)
            {
                str100 = list[12];
            }
            this.m_Header.m_Location = str2;
            this.m_Header.m_StartTime = new DateTime(int.Parse(str3.Substring(6, 4)), int.Parse(str3.Substring(3, 2)), int.Parse(str3.Substring(0, 2)), int.Parse(str4.Substring(0, 2)), int.Parse(str4.Substring(3, 2)), int.Parse(str4.Substring(6, 2)));
            this.m_Header.m_StopTime = new DateTime(int.Parse(str5.Substring(6, 4)), int.Parse(str5.Substring(3, 2)), int.Parse(str5.Substring(0, 2)), int.Parse(str6.Substring(0, 2)), int.Parse(str6.Substring(3, 2)), int.Parse(str6.Substring(6, 2)));
            this.m_Header.m_Height_asl = double.Parse(s);
            this.m_Header.m_Longitude = double.Parse(str8);
            this.m_Header.m_Lattitude = double.Parse(str9);
            this.m_Header.m_ZenithAngle = double.Parse(str10);
            this.m_Header.m_Humidity = double.Parse(str100);
            bb = reader.ReadLine();
            offset += bb.Length + 2;
            list = this.SplitString(bb);
            string str11 = list[0];
            string str12 = list[1];
            string str13 = list[2];
            string str14 = list[3];
            string str15 = list[4];
            this.m_Header.m_Lase1_NumOfShots = int.Parse(str11);
            this.m_Header.m_Lase1_Pulse = int.Parse(str12);
            this.m_Header.m_Lase2_NumOfShots = int.Parse(str13);
            this.m_Header.m_Lase2_Pulse = int.Parse(str14);
            this.m_Header.m_NumOfDatasets = int.Parse(str15);
            for (num2 = 0; num2 < this.m_Header.m_NumOfDatasets; num2++)
            {
                bb = reader.ReadLine();
                offset += bb.Length + 2;
                list = this.SplitString(bb);
                string str16 = list[0];
                string str17 = list[1];
                string str18 = list[2];
                string str19 = list[3];
                string str20 = list[5];
                string str21 = list[6];
                string str22 = list[7].Substring(0, 5);
                string str23 = list[12];
                string str24 = list[13];
                string str25 = list[14];
                string str26 = list[15];
                DataSet item = new DataSet {
                    _Active = (int.Parse(str16) == 1) ? true : false,
                    _AnaOrPC = (int.Parse(str17) == 1) ? true : false,
                    _LaserSource = int.Parse(str18),
                    _NumOfBins = int.Parse(str19),
                    _PMT_Highvoltage = double.Parse(str20),
                    _BinWidth = double.Parse(str21),
                    _LaserWavelength = double.Parse(str22),
                    _ADCbits = int.Parse(str23),
                    _NumofShots = int.Parse(str24),
                    _Discriminator = double.Parse(str25),
                    _Descriptor = str26.TrimStart(new char[0])
                };
                this.m_DataSet.Add(item);
            }
            reader2.BaseStream.Seek(offset, SeekOrigin.Begin);
            for (num2 = 0; num2 < this.m_Header.m_NumOfDatasets; num2++)
            {
                reader2.ReadChars(2);
                this.m_DataSet[num2]._BinVect = new List<double>();
                for (int i = 0; i < this.m_DataSet[num2]._NumOfBins; i++)
                {
                    try
                    {
                        this.m_DataSet[num2]._BinVect.Add((double)reader2.ReadInt32());
                    }
                    catch (Exception exp)
                    {
                        ;
                    }
                }
            }
            reader.Close();
            reader2.Close();
            stream.Close();

            reader.Dispose();
            stream.Dispose();
        }         

        private List<string> SplitString(string bb)
        {
            List<string> list = new List<string>();
            string item = "";
            bb.TrimStart(new char[0]);
            bb.TrimEnd(new char[0]);
            bb = bb + ' ';
            for (int i = 0; (bb.Length != 0) && (i < bb.Length); i++)
            {
                char ch = bb[i];
                if (ch > ' ')
                {
                    item = item + ch;
                }
                else
                {
                    if (item.Length > 0)
                    {
                        list.Add(item);
                    }
                    item = "";
                }
            }
            return list;
        }
    }
}

