using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OpenAI_API.Images;

namespace API.DTOs
{
    public class DalleParametersDto
    {
        public string Prompt { get; set; }
        public int Number { get; set; }
    }
}