using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;

namespace PaintServiceAccess
{
    [ServiceContract(Name = "PaintServiceAccess")]
    public interface IRest
    {
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = Routing.WctRoute, BodyStyle = WebMessageBodyStyle.WrappedResponse, ResponseFormat = WebMessageFormat.Json)]
        string  WctPaint(string warnStr);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = Routing.MgtRoute, BodyStyle = WebMessageBodyStyle.WrappedResponse, ResponseFormat = WebMessageFormat.Json)]
        string MgtPaint(string warnStr);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = Routing.ZxtRoute, BodyStyle = WebMessageBodyStyle.WrappedResponse, ResponseFormat = WebMessageFormat.Json)]
        string ZxtPaint(string warnStr);
      
         
    }

    /// <summary>
    /// 接口方法访问路径
    /// </summary>
    public static class Routing
    {
        public const string WctRoute = "/wctPaint?warnStr={warnStr}";

        public const string MgtRoute = "/mgtPaint?warnStr={warnStr}";

        public const string ZxtRoute = "/zxtPaint?warnStr={warnStr}"; 


    }
}
