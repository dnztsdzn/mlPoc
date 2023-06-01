import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useStore } from '../../app/stores/store';
import { Button, Card, Form, InputNumber, Space, Image, Divider, Row, Col } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { LoadingOutlined } from '@ant-design/icons';


export default observer(function Dalle() {
    const { aiStore } = useStore();
    const { dalleImage } = aiStore;
    const [imageUrl, setImageUrl] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    const onFinish = async (values: any) => {
        setIsLoading(false);
        const results = dalleImage(values).finally(() => { setIsLoading(true) })
        setImageUrl(await results);
    }

    return (
        <>
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
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Space>
                    </Card>
                </Col>
                <Col span={18}>
                    <Card bordered={false} style={{textAlign:"center",minHeight:"360px"}} >
                        <LoadingOutlined hidden={isLoading} style={{fontSize:"64px"}}/>
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