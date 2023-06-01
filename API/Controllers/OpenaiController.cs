using System.Net.Http.Headers;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OpenAI_API.Chat;
using OpenAI_API.Images;
using OpenAI_API.Models;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OpenaiController : ControllerBase
    {
        private static readonly HttpClient client = new HttpClient();
        public OpenaiController()
        {

        }

        // [AllowAnonymous]
        // [HttpPost("chatgpt")]
        // public async Task<ActionResult> ChatGpt(PromptDto prompt)
        // {
        //     var result = await InvokeRequestResponseService(prompt.Prompt);

        //     return Ok(result);
        // }
        [AllowAnonymous]
        [HttpPost("chatgpt")]
        public async Task<ActionResult> ChatGpt(List<ChatTest> chatDto)
        {
            var api = new OpenAI_API.OpenAIAPI("api_key");
            // var chat = api.Chat.CreateConversation(new ChatRequest()
            // {
            //     Model = Model.GPT4,
            //     Temperature = 0.1,
            //     MaxTokens = 10,
            // });
            var chat = api.Chat.CreateConversation();

            foreach (var item in chatDto)
            {
                if (item.User == "ai")
                {
                    chat.AppendExampleChatbotOutput(item.Prompt);
                }
                if (item.User == "user")
                {
                    chat.AppendUserInput(item.Prompt);
                }
                if (item.User == "system")
                {
                    chat.AppendSystemMessage(item.Prompt);
                }
            }


            string response = await chat.GetResponseFromChatbotAsync();

            return Ok(response);

            //return Ok("test");

            // Console.WriteLine(response); // "No"

            // // the entire chat history is available in chat.Messages
            // foreach (ChatMessage msg in chat.Messages)
            // {
            //     Console.WriteLine($"{msg.Role}: {msg.Content}");
            // }

            // return Ok();

            // //var result = await api.Completions.GetCompletion(prompt.Prompt);
            // var result = await api.Completions.CreateCompletionAsync(prompt.Prompt, temperature: 0.1, max_tokens: 10);
            // Console.WriteLine(result.ToString());
            // var resasd = result.Completions[0].Text;
            // // should print something starting with "Three"
            // return Ok(asd);
        }
        // [AllowAnonymous]
        // [HttpPost("chatgpt")]
        // public async Task<ActionResult> ChatGpt(PromptDto prompt)
        // {
        //     var api = new OpenAI_API.OpenAIAPI("api_key");
        //     //var result = await api.Completions.GetCompletion(prompt.Prompt);
        //     var result = await api.Completions.CreateCompletionAsync(prompt.Prompt, temperature: 0.1,max_tokens:10);
        //     Console.WriteLine(result.ToString());
        //     var asd= result.Completions[0].Text;
        //     // should print something starting with "Three"
        //     return Ok(asd);
        // }

        [AllowAnonymous]
        [HttpPost("whisper")]
        public async Task<ActionResult> Whisper([FromForm] string transcribeOrTranslate)
        {
            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files.First();
            var result = await InvokeRequestResponseServiceWhisper(file, transcribeOrTranslate);

            return Ok(result);
        }
        // [AllowAnonymous]
        // [HttpPost("whisper")]
        // public async Task<ActionResult> Whisper()
        // {
        //     var formCollection = await Request.ReadFormAsync();
        //     var file = formCollection.Files.First();
        //     var result = await InvokeRequestResponseServiceWhisper(file);

        //     return Ok(result);
        // }

        [AllowAnonymous]
        [HttpPost("dalleimage")]
        public async Task<ActionResult> DalleImage(DalleParametersDto dalleParametersDto)
        {
            var api = new OpenAI_API.OpenAIAPI("api_key");
            var result = await api.ImageGenerations.CreateImageAsync(new ImageGenerationRequest(dalleParametersDto.Prompt, dalleParametersDto.Number, ImageSize._1024));

            List<string> imageList = new List<string>();
            foreach (var item in result.Data)
            {
                imageList.Add(item.Url);
            }

            return Ok(imageList);
        }






        static async Task<string> InvokeRequestResponseService(string prompt)
        {
            var handler = new HttpClientHandler()
            {
                ClientCertificateOptions = ClientCertificateOption.Manual,
                ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) => { return true; }
            };

            using (var client = new HttpClient(handler))
            {
                var values = new Dictionary<string, object>
                {
                    { "model", "text-ada-001" },
                    { "prompt", prompt },
                    {"max_tokens",16}
                };

                const string apiKey = "api_key";
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
                client.BaseAddress = new Uri("https://api.openai.com/v1/completions");

                var requestString = JsonConvert.SerializeObject(values);
                var content = new StringContent(requestString);

                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                HttpResponseMessage response = await client.PostAsync("", content);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    var deserializeResult = JsonConvert.DeserializeObject<OpenAiResponseModel>(result).choices[0].Text;
                    return deserializeResult;
                }
                else
                {
                    Console.WriteLine(string.Format("the request failed with status code: {0}", response.StatusCode));

                    Console.WriteLine(response.Headers.ToString());

                    string responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine(responseContent);
                    return responseContent;
                }
            }
        }

        static async Task<string> InvokeRequestResponseServiceWhisper(IFormFile file, string transcribeOrTranslate)
        {
            var handler = new HttpClientHandler()
            {
                ClientCertificateOptions = ClientCertificateOption.Manual,
                ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) => { return true; }
            };

            byte[] qwe;
            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                qwe = memoryStream.ToArray();
            }

            using (var form = new MultipartFormDataContent())
            {
                form.Headers.ContentType.MediaType = "multipart/form-data";

                form.Add(new StringContent("whisper-1"), "model");

                // Create a ByteArrayContent object with the audio data
                ByteArrayContent audioContent = new ByteArrayContent(qwe);
                form.Add(audioContent, "file", file.FileName);

                using (var client = new HttpClient(handler))
                {
                    const string apiKey = "api_key";
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
                    if (transcribeOrTranslate == "translate")
                    {
                        client.BaseAddress = new Uri("https://api.openai.com/v1/audio/translations");
                    }
                    if (transcribeOrTranslate == "transcribe")
                    {
                        client.BaseAddress = new Uri("https://api.openai.com/v1/audio/transcriptions");
                    }


                    HttpResponseMessage response = await client.PostAsync("", form);

                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadAsStringAsync();
                        var deserializeResult = JsonConvert.DeserializeObject<OpenAiWhisperResponseModel>(result).text;

                        return deserializeResult;
                    }
                    else
                    {
                        Console.WriteLine(string.Format("the request failed with status code: {0}", response.StatusCode));

                        Console.WriteLine(response.Headers.ToString());

                        string responseContent = await response.Content.ReadAsStringAsync();
                        Console.WriteLine(responseContent);
                        return responseContent;
                    }
                }
            }
        }
    }
}