import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useStore } from '../../app/stores/store';
import { Card, Divider, Select, Upload, UploadProps, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';


export default observer(function Whisper() {
    const { Dragger } = Upload;
    const { aiStore } = useStore();
    const { whisperTranscribeTest } = aiStore;
    const [transcription, setTranscription] = useState("");
    const [transcribeOrTranslate, setTranscribeOrTranslate] = useState("transcribe");
    const [showupload, setShowupload] = useState(true);
    const [uploadList, setUploadList] = useState();


    const handleChange = (value: string) => {
        setTranscribeOrTranslate(value);
    };


    // const props: UploadProps = {
    //     name: 'file',
    //     multiple: true,
    //     action: 'http://localhost:5000/api/openai/whisper',
    //     onChange(info) {
    //         const { status } = info.file;
    //         if (status !== 'uploading') {
    //             console.log(info.file, info.fileList);
    //         }
    //         if (status === 'done') {
    //             message.success(`${info.file.name} file uploaded successfully.`);
    //             setTranscription(info.file.response);
    //         } else if (status === 'error') {
    //             message.error(`${info.file.name} file upload failed.`);
    //         }
    //     },
    //     onDrop(e) {
    //         console.log('Dropped files', e.dataTransfer.files);
    //     },
    // };


    const handleUpload = async (file: any) => {
        setShowupload(true);
        const response = whisperTranscribeTest(file, transcribeOrTranslate).then((res) => { message.success('upload successfully.'); setTranscription(res.data); }).catch(() => { message.error('upload failed.') }).finally(() => { setShowupload(false);});
        // setTranscription((await response).data);
    };

    return (
        <>
            <Dragger showUploadList={showupload} customRequest={handleUpload}>
                {/* <Dragger {...props} > */}
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                </p>
            </Dragger>
            <Card bordered={false} style={{ width: '100%' }}>
                <Select
                    defaultValue="Transcribe"
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={[
                        { value: 'transcribe', label: 'Transcribe' },
                        { value: 'translate', label: 'Translate' },
                    ]}
                />
                <Divider plain></Divider>
                <p>{transcription}</p>
            </Card>
        </>
    )
})
// import { observer } from 'mobx-react-lite';
// import React, { ChangeEvent, useState } from 'react';
// import { useStore } from '../../app/stores/store';
// import { Button, Checkbox, Form, Input, InputNumber, Space, Upload } from 'antd';
// import { InboxOutlined, UploadOutlined } from '@ant-design/icons';


// export default observer(function Whisper() {
//     const { Dragger } = Upload;
//     const [form] = Form.useForm();
//     const { aiStore } = useStore();
//     const { whisperTranscribeTest } = aiStore;
//     const [file, setFile] = useState<File>();
//     const [transcription,setTranscription] = useState("");


//     const onFinish = (values: any) => {
//         whisperTranscribeTest(values)
//     };


//     const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setFile(e.target.files[0]);
//         }
//     };

//     const handleUploadClick = async () => {
//         if (!file) {
//             const asdtest = whisperTranscribeTest(file!);
//             setTranscription(await asdtest);
//         }
//     };

//     return (
//         <>
//             <div>
//                 <input type="file" onChange={handleFileChange} />

//                 <div>{file && `${file.name} - ${file.type}`}</div>

//                 <button onClick={handleUploadClick}>Upload</button>
//             </div>
//         </>
//     )
// })