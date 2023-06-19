import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useStore } from '../../app/stores/store';
import { Button, Card, Form, InputNumber, Space, Image, Divider, Row, Col, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { LoadingOutlined } from '@ant-design/icons';


export default observer(function Dalle() {
    const { aiStore } = useStore();
    const { dalleImage } = aiStore;
    const [imageUrl, setImageUrl] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [promptHelperIsLoading, setPromptHelperIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const [promptHelperResponse, setPromptHelperResponse] = useState<string[]>([]);



    const onFinish = async (values: any) => {
        setIsLoading(true);
        const results = dalleImage(values).finally(() => { setIsLoading(false) })
        setImageUrl(await results);
    };

    const handleChange = async () => {
        setPromptHelperIsLoading(true);
        const response = await fetch(
            "https://gustavosta-magicprompt-stable-diffusion.hf.space/api/predict",
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
        <>
            <Card title="Prompt Generator">
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
            <Row gutter={16}>
                <Col span={6}>
                    <Card title="Dall-e" bordered={false} style={{ width: '100%' }}>

                        <Space split={<Divider type="vertical" />}>
                            <Form
                                name="basic"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 600 }}
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Prompt"
                                    name="prompt"
                                    rules={[{ required: true, message: 'Cant be empty!' }]}
                                >
                                    <TextArea rows={5} />
                                </Form.Item>
                                <Form.Item label="Count" name="number" initialValue={1}>
                                    <InputNumber min={1} max={10} defaultValue={1} />
                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit" loading={isLoading}>
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Space>
                    </Card>
                </Col>
                <Col span={18}>
                    <Card bordered={false} style={{ textAlign: "center", minHeight: "360px" }} >
                        {/* <LoadingOutlined hidden={isLoading} style={{ fontSize: "64px" }} /> */}
                        {imageUrl.map(asd =>
                            <Image
                                placeholder={true}
                                height={256}
                                width={256}
                                src={asd}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </>
    )
})