import { Button, Card, Col, Divider, Form, Input, List, Row, Select, Space, Upload, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { useEffect, useState } from 'react';
import { Prompt } from '../../app/models/prompt';
import { ChatTest } from '../../app/models/chatTest';
import { FineTuneTest } from '../../app/models/fineTuneModel';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FineTuneModelListResponse } from '../../app/models/fineTuneModelListResponse';



export default observer(function FineTune() {
    const { Dragger } = Upload;
    const { aiStore } = useStore();
    const { uploadFile, getFileList, deleteUploadedFile, fineTuneTraining, fineTunedModelsList } = aiStore;
    const [transcription, setTranscription] = useState("");
    const [selectedFileId, setSelectedFileId] = useState<Prompt>();
    const [transcribeOrTranslate, setTranscribeOrTranslate] = useState("fine-tune");
    //const [selectFineTuneFile, setSelectFineTuneFile] = useState<Prompt>();
    const [showupload, setShowupload] = useState(true);
    const [uploadList, setUploadList] = useState<string[]>([]);
    const [fineTunedModelsList1, setFineTunedModelsList1] = useState<string[]>([]);
    const [fineTuneModelsStatus, setFineTuneModelsStatus] = useState<FineTuneModelListResponse[]>();


    const handleChange = (value: string) => {
        setTranscribeOrTranslate(value);
    };
    const handleChange2 = (value: string) => {
        setSelectedFileId({ text: value });
    };

    const handleUpload = async (file: any) => {
        const isPNG = file.file.name.split('.').pop() === 'jsonl';
        if (!isPNG) {
            message.error(`${file.name} is not a jsonl(JSON Lines) file`);
            return
        }
        setShowupload(true);
        const response = uploadFile(file, transcribeOrTranslate).then((res) => { message.success('upload successfully.'); setTranscription(res.data); }).catch(() => { message.error('upload failed.') }).finally(() => { setShowupload(false); });
        //setTranscription((await response).data);
    };

    const listFiles = async () => {
        const response = getFileList().then((a) => { setUploadList(a) });
    };

    useEffect(() => {
        // Update the document title using the browser API
        const response = getFileList().then((a) => { setUploadList(a) });
        const response2 = fineTunedModelsList().then((a) => { setFineTunedModelsList1(a) });
    }, []);

    // const deleteFile = async () => {
    //     const { Configuration, OpenAIApi } = require("openai");
    //     const configuration = new Configuration({
    //         apiKey: "api-key",
    //     });
    //     const openai = new OpenAIApi(configuration);
    //     const response = await openai.deleteFile(deleteFileId);
    // };
    const deleteFileApi = async () => {
        const response = deleteUploadedFile(selectedFileId!);
    };
    const fineTuneModelApi = async () => {
        const response = fineTuneTraining(selectedFileId!);
    };

    // const fineTuneModel = async () => {
    //     const { Configuration, OpenAIApi } = require("openai");
    //     const configuration = new Configuration({
    //         apiKey: "api-key",
    //     });
    //     const openai = new OpenAIApi(configuration);
    //     const response = await openai.createFineTune({
    //         training_file: selectedFileId,
    //     });
    //     const qweasd = response;
    // };

    // const listFineTuneModel = async () => {
    //     const { Configuration, OpenAIApi } = require("openai");
    //     const configuration = new Configuration({
    //         apiKey: "api-key",
    //     });
    //     const openai = new OpenAIApi(configuration);
    //     const response = await openai.listFineTunes();
    //     const qwe = response.json;
    //     //setFineTunedModelsList(response.json);
    // };

    const listFineTunedModels = async () => {
        const response = fineTunedModelsList().then((a) => { setFineTunedModelsList1(a) });
        const qwed = response;
    };

    const test = async () => {
        const { Configuration, OpenAIApi } = require("openai");
        const configuration = new Configuration({
            apiKey: "api-key"
        });
        const openai = new OpenAIApi(configuration);
        const response = await openai.listFineTunes();
        const test = response.data.data;
        setFineTuneModelsStatus(response.data.data);


    }

    // const test2 = async (value:string) => {
    //     // const { Configuration, OpenAIApi } = require("openai");
    //     // const configuration = new Configuration({
    //     //     apiKey: "api-key"
    //     // });
    //     // const openai = new OpenAIApi(configuration);
    //     // const response = await openai.retrieveFineTune(value);
    //     const qwe = fineTuneModelsStatus?.find(obj => {return obj.id === value})
    // }




    // const listFiles = async () => {
    //     const { Configuration, OpenAIApi } = require("openai");
    //     const configuration = new Configuration({
    //         apiKey: "api-key",
    //     });
    //     const openai = new OpenAIApi(configuration);
    //     const response = await openai.listFiles();

    //     const qweasd = uploadList;
    // }

    return (
        <>
            <Row gutter={16}>
                <Col span={12}>
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
                </Col>

                {/* <Card bordered={false} style={{ width: '100%' }}>
                <Select
                    defaultValue="fine-tune"
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={[
                        { value: 'fine-tune', label: 'fine-tune' },
                    ]}
                />
                <Divider plain></Divider>
                <p>{transcription}</p>
            </Card> */}
                <Col span={12}>
                    <Card title={"files"} bordered={false}>
                        <Select
                            placeholder="Select a file"
                            onChange={handleChange2}
                            allowClear
                            style={{ width: '100%' }}>
                            {uploadList.map((asd) =>
                                <Select.Option key={asd}>{asd}</Select.Option>
                            )}
                        </Select>
                        <Space>
                            <Button onClick={fineTuneModelApi}>Train model</Button>
                            <Button onClick={deleteFileApi}>Delete files</Button>
                        </Space>
                        <Button onClick={test}>TEST GET STATUS</Button>
                        {/* <Button onClick={test2}>TEST GET STATUS2</Button> */}
                    </Card>
                </Col>
            </Row>
            {/* <Button onClick={listFiles}>Get files</Button> */}
            {/* <Button onClick={listFineTunedModels}>Get fine tuned models</Button> */}
            {/* <Select
                placeholder="Select a model"
                onChange={handleChange2}
                allowClear
                style={{ width: 300 }}>
                {fineTunedModelsList1.map((a) =>
                    <Select.Option key={a}>{a}</Select.Option>
                )}
            </Select> */}


            {/* <Button onClick={listFineTuneModel}>List trained models(çalışmıyor test amaçlı)</Button> */}
            {/* <Input placeholder='Id of file to delete' onChange={(a) => setDeleteFileId({ text: a.target.value })}></Input> */}

            {/* {fineTunedModelsList1.map((asd: any) =>
                <p>{asd}</p>
            )} */}
            {/* {fineTuneModelsStatus}
            {fineTuneModelsStatus ? (
                    fineTuneModelsStatus
                ) : (
                    <div>empty</div>

                )} */}
            <Card>
                <List bordered header="Status of models" style={{ minHeight: '400px' }}>
                    {fineTuneModelsStatus?.map(asd => {
                        return (
                            <List.Item style={{ display: "block" }}>{asd.id} - {asd.model} - {asd.status} - {asd.fine_tuned_model}</List.Item>
                        )

                    })}
                </List>
            </Card>
            {/* {fineTuneModelsStatus?.map((a) => <div>{a.status}</div>)} */}
        </>
    )
})