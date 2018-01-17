namespace LidarFileAndData
{
    using System;
    using System.Collections.Generic;

    public class DataSet
    {
        public bool _Active;
        public int _ADCbits;
        public bool _AnaOrPC;
        public List<double> _BinVect;
        public double _BinWidth;
        public string _Descriptor;
        public double _Discriminator;
        public int _LaserSource;
        public double _LaserWavelength;
        public int _NumOfBins;
        public int _NumofShots;
        public double _PMT_Highvoltage;
    }
}

