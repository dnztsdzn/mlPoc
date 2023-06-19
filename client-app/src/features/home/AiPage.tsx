import { observer } from 'mobx-react-lite';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useStore } from '../../app/stores/store';
import { Button, Card, Col, Divider, Form, Input, InputNumber, List, Row, Select, Slider, Space } from 'antd';
import { ChatTest, ChatTestFormValues } from '../../app/models/chatTest';
import { SendOutlined, LoadingOutlined, SmileOutlined, FrownOutlined } from '@ant-design/icons';
import { Prompt } from '../../app/models/prompt';
import { CompletionParametersModel } from '../../app/models/completionParametersModel';


export default observer(function AiPage() {
    const [form] = Form.useForm();
    const { aiStore } = useStore();
    const { chatGpt, fineTunedModelsList, completionParameters } = aiStore;
    const [array, setArray] = useState<ChatTest[]>([]);
    const [arrayInput, setArrayInput] = useState<ChatTest[]>([]);
    const firstUpdate = useRef(true)
    const [isLoading, setIsLoading] = useState(true);
    const [promptHelperResponse, setPromptHelperResponse] = useState<string[]>([]);
    const [promptHelperIsLoading, setPromptHelperIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const [selectedModel, setSelectedModel] = useState<Prompt>({ text: "gpt-3.5-turbo" });
    const [fineTunedModelsList1, setFineTunedModelsList1] = useState<string[]>([]);
    // const [chatParameters, setChatParameters] = useState<ChatParameters>({ model: "gpt-3.5-turbo", N: 1, Temperature: 1 ,ChatHistory:[]});
    const [inputCompletionParameters, setInputCompletionParameters] = useState<CompletionParametersModel>({ model: "gpt-3.5-turbo", n: 1, prompt: "", temperature: 1 });
    const [modelTempreture, setModelTempreture] = useState(1);
    const [numberOfResult, setNumberOfResult] = useState(1);

    useEffect(() => {
        // Update the document title using the browser API
        const response2 = fineTunedModelsList().then((a) => { setFineTunedModelsList1(a) });
    }, []);


    const handleModelChange = (value: string) => {
        // chatParameters.model=value;
        setSelectedModel({ text: value });
        inputCompletionParameters.model = value;
    };

    const onTest = (values: ChatTest) => {
        setArrayInput([...array, { prompt: values.prompt, user: "user" }]);
        setArray([...array, { prompt: values.prompt, user: "user" }, { prompt: numberOfResult.toString(), user: "n" }, { prompt: modelTempreture.toString(), user: "tempreture" }, { prompt: selectedModel.text, user: "model" }]);
        // setArray([...array, { prompt: inputCompletionParameters.n.toString(), user: "n" }]);
        // setArray([...array, { prompt: inputCompletionParameters.temperature.toString(), user: "tempreture" }]);
        // setArray([...array, { prompt: selectedModel.text, user: "model" }]);
        inputCompletionParameters.prompt = values.prompt;
        inputCompletionParameters.n = numberOfResult;
        inputCompletionParameters.temperature = modelTempreture;

        form.resetFields();
        setIsLoading(false);
    }

    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        onFinish();
    }, [arrayInput]);

    const onFinish = async () => {
        if (selectedModel?.text.includes(':')) {
            const xcv = completionParameters(inputCompletionParameters)
            const qwer = new ChatTestFormValues();
            qwer.prompt = await xcv;
            qwer.user = "ai";
            setIsLoading(true);
            setArray(() => [...array, qwer]);
        } else {
            const asd = chatGpt(array)
            const qwer = new ChatTestFormValues();
            qwer.prompt = await asd;
            qwer.user = "ai";
            setIsLoading(true);
            setArray(() => [...array, qwer]);
        }
    };

    const handleChange = async () => {
        setPromptHelperIsLoading(true);
        const response = await fetch(
            "https://merve-chatgpt-prompt-generator.hf.space/run/predict",
            {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    data: [
                        input,
                    ]
                })
            }
        );
        const result = await response.json();
        const asdadq = result.data[0];
        const qwe = asdadq.split("\n");
        setPromptHelperResponse(qwe);
        setPromptHelperIsLoading(false);
        return result;
        // setIsLoading(qweasd);
    };

    return (
        <><Card title="Prompt Generator">
            <Card.Grid style={{ width: '40%' }} >
                <Space.Compact style={{ width: '100%' }}>
                    <Input onChange={(a) => setInput(a.target.value)} ></Input>
                    <Button onClick={handleChange} loading={promptHelperIsLoading} >Generate</Button>
                </Space.Compact>
            </Card.Grid>
            <Card.Grid style={{ width: '60%' }} >
                {promptHelperResponse.map(asd =>
                    <p>{asd}</p>
                )}
            </Card.Grid>
        </Card>
            <br></br>
            <Card title="Chatgpt" bordered={false} style={{ width: '100%' }}>
                <List style={{ minHeight: '400px' }}>
                    {array.map(asd => {
                        if (asd.user == "ai")
                            return <List.Item style={{ textAlign: "left", display: "block", maxWidth: "60%" }}>{asd.prompt}</List.Item>
                        if (asd.user == "user")
                            return <List.Item style={{ textAlign: "right", display: "block" }}>{asd.prompt}</List.Item>
                    })}
                </List>
                <LoadingOutlined hidden={isLoading} />
                <Divider></Divider>
                <Form
                    onFinish={onTest}
                    autoComplete="off"
                    layout="inline"
                    form={form}
                // style={{ justifyContent: 'center' }}
                >
                    <Form.Item
                        name="prompt"
                        rules={[{ required: true, message: 'Cant be empty!' }]}
                        style={{ width: '65%' }}
                    >
                        <Input placeholder='Send a message' suffix={<Button type='link' htmlType="submit" icon={<SendOutlined htmlFor='submit' />} />} />
                    </Form.Item>
                    {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type='link' htmlType="submit" icon={<EyeTwoTone htmlFor='submit'/>} />
                    </Form.Item> */}
                    <Select
                        defaultValue={"gpt-3.5-turbo-0301"}
                        size='large'
                        placeholder="Select a model"
                        onChange={handleModelChange}
                        allowClear
                        style={{ width: '33%' }}>
                        {fineTunedModelsList1.map((a) =>
                            <Select.Option key={a}>{a}</Select.Option>
                        )}
                    </Select>
                </Form>
                <Divider>creativity</Divider>
                <Row gutter={16} style={{justifyContent:'center'}}>
                    <Col span={1}>
                        <div>less</div>
                    </Col>
                    <Col span={21}>
                        <Slider style={{ width: '100%' }} onChange={(a) => setModelTempreture(a)} max={2} min={0} step={0.1} />
                    </Col>
                    <Col span={1}>
                        <div>more</div>
                    </Col>
                </Row>

                {/* <InputNumber min={1} max={4} defaultValue={1} onChange={(a) => setNumberOfResult(a!)} /> */}
                {/* <Select
                    placeholder="Select a model"
                    onChange={handleChange2}
                    allowClear
                    style={{ width: 300 }}>
                    {fineTunedModelsList1.map((a) =>
                        <Select.Option key={a}>{a}</Select.Option>
                    )}
                </Select> */}
            </Card>

        </>
    )
    // return (
    //     <>
    //         <Card title="Chatgpt" bordered={false} style={{ width: '100%' }}>

    //             <Form
    //                 name="basic"
    //                 labelCol={{ span: 8 }}
    //                 wrapperCol={{ span: 16 }}
    //                 style={{ maxWidth: 600 }}
    //                 onFinish={onTest}
    //                 autoComplete="off"
    //             >
    //                 <Form.Item
    //                     label="user"
    //                     name="prompt"
    //                     rules={[{ required: true, message: 'Cant be empty!' }]}
    //                 >
    //                     <Input />
    //                 </Form.Item>
    //                 <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
    //                     <Button type="primary" htmlType="submit">
    //                         Submit
    //                     </Button>
    //                 </Form.Item>
    //             </Form>
    //         </Card>
    //         {array.map(asd =>
    //             <p>{asd.prompt} - {asd.user}</p>
    //         )}
    //     </>
    // )
})
// import { observer } from 'mobx-react-lite';
// import React, { useState } from 'react';
// import { useStore } from '../../app/stores/store';
// import { Button, Card, Checkbox, Form, Input, InputNumber, Space } from 'antd';

// export default observer(function AiPage() {
//     const [form] = Form.useForm();
//     const { aiStore } = useStore();
//     const { chatGptTest } = aiStore;
//     const [chat, setChat] = useState("");

//     const onFinish = async (values: any) => {
//         const asd = chatGptTest(values)
//         setChat(await asd);
//     }


//     return (
//         <>
//             <Card title="Chatgpt" bordered={false} style={{ width: '50%' }}>
//                 <p>{chat}</p>
//                 <Form
//                     name="basic"
//                     labelCol={{ span: 8 }}
//                     wrapperCol={{ span: 16 }}
//                     style={{ maxWidth: 600 }}
//                     onFinish={onFinish}
//                     autoComplete="off"
//                 >
//                     <Form.Item
//                         label="user"
//                         name="prompt"
//                         rules={[{ required: true, message: 'Cant be empty!' }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
//                         <Button type="primary" htmlType="submit">
//                             Submit
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </Card>
//         </>
//     )
// })





// import { observer } from 'mobx-react-lite';
// import React, { useState } from 'react';
// import { useStore } from '../../app/stores/store';
// import { Button, Card, Checkbox, Form, Input, InputNumber, Space } from 'antd';

// export default observer(function AiPage() {
//     const [form] = Form.useForm();
//     const { aiStore } = useStore();
//     const { chatGpt } = aiStore;
//     const [chat, setChat] = useState("");

//     const onFinish = async (values: any) => {
//         const asd = chatGpt(values)
//         setChat(await asd);
//     }


//     return (
//         <>
//             <Card title="Chatgpt" bordered={false} style={{ width: '50%' }}>
//                 <p>{chat}</p>
//                 <Form
//                     name="basic"
//                     labelCol={{ span: 8 }}
//                     wrapperCol={{ span: 16 }}
//                     style={{ maxWidth: 600 }}
//                     onFinish={onFinish}
//                     autoComplete="off"
//                 >
//                     <Form.Item
//                         label="user"
//                         name="prompt"
//                         rules={[{ required: true, message: 'Cant be empty!' }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
//                         <Button type="primary" htmlType="submit">
//                             Submit
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </Card>
//         </>
//     )
// })
// // import { observer } from 'mobx-react-lite';
// // import React, { useState } from 'react';
// // import { useStore } from '../../app/stores/store';
// // import { Button, Card, Checkbox, Form, Input, InputNumber, Space } from 'antd';

// // export default observer(function AiPage() {
// //     const [form] = Form.useForm();
// //     const { aiStore } = useStore();
// //     const { chatGptTest } = aiStore;
// //     const [chat, setChat] = useState("");

// //     const onFinish = async (values: any) => {
// //         const asd = chatGptTest(values)
// //         setChat(await asd);
// //     }


// //     return (
// //         <>
// //             <Card title="Chatgpt" bordered={false} style={{ width: '50%' }}>
// //                 <p>{chat}</p>
// //                 <Form
// //                     name="basic"
// //                     labelCol={{ span: 8 }}
// //                     wrapperCol={{ span: 16 }}
// //                     style={{ maxWidth: 600 }}
// //                     onFinish={onFinish}
// //                     autoComplete="off"
// //                 >
// //                     <Form.Item
// //                         label="user"
// //                         name="prompt"
// //                         rules={[{ required: true, message: 'Cant be empty!' }]}
// //                     >
// //                         <Input />
// //                     </Form.Item>
// //                     <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
// //                         <Button type="primary" htmlType="submit">
// //                             Submit
// //                         </Button>
// //                     </Form.Item>
// //                 </Form>
// //             </Card>
// //         </>
// //     )
// // })