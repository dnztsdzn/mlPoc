using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UploadFileResponseModel
    {
        public string @object { get; set; }
        public string id { get; set; }
        public string purpose { get; set; }
        public string filename { get; set; }
        public string status { get; set; }
    }
}