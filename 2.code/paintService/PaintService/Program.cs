using System;
using System.Configuration;
using System.ServiceModel.Web; 
using System.Runtime.InteropServices;
using System.Diagnostics;
using LESSAIS.Common.Log;
using PaintServiceAccess;
namespace PaintService
{
    class Program
    {
        static void Main(string[] args)
        {
            LogManager.CreateLogger("PaintLog", "PaintLog", "PaintLog.log");
            Logger log = LogManager.GetLogger("PaintLog", "Main");
            var demoServices = new Rest();
            if (ConfigurationManager.AppSettings["isMonitor"].ToString()=="1")
            {
                demoServices.Init();
            }
         
            var serviceHost = new WebServiceHost(demoServices, new Uri(ConfigurationManager.AppSettings["PaintServiceAddress"]));
            serviceHost.Open();
            log.Info("绘图服务启动成功！");
            Console.ReadKey();
            serviceHost.Close();
        }
    }
}
