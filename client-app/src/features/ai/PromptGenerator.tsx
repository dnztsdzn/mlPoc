import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useStore } from '../../app/stores/store';
import { Button, Card, Form, InputNumber, Space, Image, Divider, Row, Col, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { LoadingOutlined } from '@ant-design/icons';
import { useRef } from 'react';


export default observer(function PromptGenerator() {
    const [isLoading, setIsLoading] = useState();
    const [promptHelperResponse, setPromptHelperResponse] = useState<string[]>([]);
    const [input,setInput] = useState("");

    const handleChange = async () => {
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
        return result;
        // setIsLoading(qweasd);
    };

    return (
        <>
            <p>{isLoading}</p>
            <Input onChange={(a)=> setInput(a.target.value)} ></Input>
            <Button onClick={handleChange}>test</Button>
            {promptHelperResponse.map(asd =>
                <p>{asd}</p>
            )}
        </>
    )
})