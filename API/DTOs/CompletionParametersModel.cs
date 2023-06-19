using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class CompletionParametersModel
    {
        public string Model { get; set; }
        public string Prompt { get; set; }
        public double Temperature { get; set; }
        public int N { get; set; }
    }
}