using System.Globalization;
using System.Net.Http.Headers;
using System.Text;
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
        [HttpPost("completion")]
        public async Task<ActionResult> CompletionOpenAi(CompletionParametersModel completionParameters)
        {
            var api = new OpenAI_API.OpenAIAPI("api-key");
            var result = await api.Completions.CreateCompletionAsync(completionParameters.Prompt, model:completionParameters.Model);
            return Ok(result.Completions[0].Text);
            //return Ok(result.ToString());
        }
        [AllowAnonymous]
        [HttpPost("chatgpt")]
        public async Task<ActionResult> ChatGpt(List<ChatTest> chatDto)
        {
            //var api = new OpenAI_API.OpenAIAPI("api-key");
            //var result = await api.Completions.CreateCompletionAsync("Company: BHFF insurance\nProduct: allround insurance\nAd:One stop shop for all your insurance needs!\nSupported:", model:"curie:ft-personal-2023-06-03-21-11-48");
            //return Ok();
            // return Ok(result.ToString());

            int n =1;
            double temperature = 0.9;
            string model ="gpt-3.5-turbo";

            foreach (var item in chatDto)
            {
                if (item.User == "n")
                {
                    n = Int32.Parse(item.Prompt);
                }
                if (item.User == "tempreture")
                {
                    temperature = double.Parse(item.Prompt,CultureInfo.InvariantCulture);
                }
                if (item.User == "model")
                {
                    model = item.Prompt;
                }
            }
            chatDto.RemoveAll(x => x.User=="tempreture");
            chatDto.RemoveAll(x => x.User=="n");
            chatDto.RemoveAll(x => x.User=="model");

            var api = new OpenAI_API.OpenAIAPI("api-key");
            var chat = api.Chat.CreateConversation(new ChatRequest()
            {
                Model = model,
                Temperature= temperature,
                // Model="curie:ft-personal-2023-06-03-21-11-48"
            });

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
        //     var api = new OpenAI_API.OpenAIAPI("api-key");
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
        [AllowAnonymous]
        [HttpGet("getFileList")]
        public async Task<ActionResult> FileList()
        {
            var api = new OpenAI_API.OpenAIAPI("api-key");
            var response = await api.Files.GetFilesAsync();

            List<string> fileList = new List<string>();
            foreach (var item in response)
            {
                fileList.Add(item.Id);
            }
            return Ok(fileList);
        }
        [AllowAnonymous]
        [HttpGet("finetunedmodelslist")]
        public async Task<ActionResult> FineTunedModelsList()
        {
            var api = new OpenAI_API.OpenAIAPI("api-key");
            var response = await api.Models.GetModelsAsync();

            List<string> modelList = new List<string>();
            foreach (var item in response)
            {
                modelList.Add(item.ModelID);
            }
            return Ok(modelList);
        }
        [AllowAnonymous]
        [HttpPost("deletefile")]
        public async Task<ActionResult> DeleteFile(Prompt toDeletefileId)
        {
            var api = new OpenAI_API.OpenAIAPI("api-key");
            var response = await api.Files.DeleteFileAsync(toDeletefileId.Text);

            return Ok();
        }
        [AllowAnonymous]
        [HttpPost("finetunetraining")]
        public async Task<ActionResult> FineTuneTraining(Prompt finetunetraining)
        {
            var result = await testFineTuneTraining(finetunetraining.Text);

            return Ok();
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
            var api = new OpenAI_API.OpenAIAPI("api-key");
            var result = await api.ImageGenerations.CreateImageAsync(new ImageGenerationRequest(dalleParametersDto.Prompt, dalleParametersDto.Number, ImageSize._1024));

            List<string> imageList = new List<string>();
            foreach (var item in result.Data)
            {
                imageList.Add(item.Url);
            }

            return Ok(imageList);
        }

        [AllowAnonymous]
        [HttpPost("uploadFile")]
        public async Task<ActionResult> UploadFile([FromForm] string purpose)
        {
            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files.First();
            var result = await FileUploadRequest(file, purpose);

            return Ok(result);
        }

        static async Task<string> testFineTuneTraining(string prompt)
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
                    { "training_file", prompt},
                };

                const string apiKey = "api-key";
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
                client.BaseAddress = new Uri("https://api.openai.com/v1/fine-tunes");

                var requestString = JsonConvert.SerializeObject(values);
                var content = new StringContent(requestString);

                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                HttpResponseMessage response = await client.PostAsync("", content);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();

                    return "ok";
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

                const string apiKey = "api-key";
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

        static async Task<string> FileUploadRequest(IFormFile file, string purpose)
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

                form.Add(new StringContent(purpose), "purpose");

                // Create a ByteArrayContent object with the audio data
                ByteArrayContent audioContent = new ByteArrayContent(qwe);
                form.Add(audioContent, "file", file.FileName);

                using (var client = new HttpClient(handler))
                {
                    const string apiKey = "api-key";
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                    client.BaseAddress = new Uri("https://api.openai.com/v1/files");

                    HttpResponseMessage response = await client.PostAsync("", form);

                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadAsStringAsync();
                        var deserializeResult = JsonConvert.DeserializeObject<UploadFileResponseModel>(result).status;

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
                    const string apiKey = "api-key";
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