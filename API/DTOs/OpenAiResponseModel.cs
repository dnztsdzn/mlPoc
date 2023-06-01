using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OpenAI_API;
using OpenAI_API.Completions;

namespace API.DTOs
{
    public class OpenAiResponseModel
    {
        public string id { get; set; }
        public string @object { get; set; }
        public int created { get; set; }
        public string model { get; set; }
        public List<Choice> choices { get; set; }
        public Usage usage { get; set; }
    }
}