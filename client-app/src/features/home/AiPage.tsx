import { observer } from 'mobx-react-lite';
import { useLayoutEffect, useRef, useState } from 'react';
import { useStore } from '../../app/stores/store';
import { Button, Card, Divider, Form, Input, List } from 'antd';
import { ChatTest, ChatTestFormValues } from '../../app/models/chatTest';
import { SendOutlined,LoadingOutlined } from '@ant-design/icons';


export default observer(function AiPage() {
    const [form] = Form.useForm();
    const { aiStore } = useStore();
    const { chatGpt } = aiStore;
    const [array, setArray] = useState<ChatTest[]>([]);
    const [arrayInput, setArrayInput] = useState<ChatTest[]>([]);
    const firstUpdate = useRef(true)
    const [isLoading,setIsLoading] = useState(true);

    const onTest = (values: ChatTest) => {
        setArrayInput([...array, { prompt: values.prompt, user: "user" }]);
        setArray([...array, { prompt: values.prompt, user: "user" }]);
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
        const asd = chatGpt(array)
        const qwer = new ChatTestFormValues();
        qwer.prompt = await asd;
        qwer.user = "ai";
        setIsLoading(true);
        setArray(() => [...array, qwer]);
    }

    return (
        <>
            <Card title="Chatgpt" bordered={false} style={{ width: '100%' }}>
                <List style={{minHeight:'400px'}}>
                    {array.map(asd => {
                        if (asd.user == "ai")
                            return <List.Item style={{ textAlign: "left", display: "block", maxWidth:"60%" }}>{asd.prompt}</List.Item>
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
                    style={{justifyContent:'center'}}
                >
                    <Form.Item
                        name="prompt"
                        rules={[{ required: true, message: 'Cant be empty!' }]}
                        style={{width:'80%'}}
                    >
                        <Input placeholder='Send a message' suffix={<Button type='link' htmlType="submit" icon={<SendOutlined htmlFor='submit'/>}  />} />
                    </Form.Item>
                    {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type='link' htmlType="submit" icon={<EyeTwoTone htmlFor='submit'/>} />
                    </Form.Item> */}
                </Form>
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