namespace LidarFileAndData
{
    using System;

    public class DataHeader
    {
        public string m_Filename;
        public double m_Height_asl;
        public int m_Lase1_NumOfShots;
        public int m_Lase1_Pulse;
        public int m_Lase2_NumOfShots;
        public int m_Lase2_Pulse;
        public double m_Lattitude;
        public string m_Location;
        public double m_Longitude;
        public int m_NumOfDatasets;
        public DateTime m_StartTime;
        public DateTime m_StopTime;
        public double m_ZenithAngle;
        public double m_Humidity;
    }
}

