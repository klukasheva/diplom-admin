import {ValuesModalI} from "../stores/modalStore";
import {observer} from "mobx-react";
import {Button, Form, Input, InputNumber, Modal} from "antd";
import TextArea from "antd/es/input/TextArea";
import * as React from "react";
import {useForm} from "antd/es/form/Form";
import axios from "axios";
import {config} from "../config";
import {ErrorNotifications, SuccessNotifications} from "../norifications/notifications";

interface EditLinksModalI {
    data: ValuesModalI,
    setShow: (value: boolean) => void
}

export const EditLinksModal = observer(({data, setShow}: EditLinksModalI)=>{
    const [form] = useForm();

    const submit = async () =>{
        const values = form.getFieldsValue();
        const prepare = {...values, id: data.target.id};
        await axios.put(`${config.host}:${config.api_port}/${config.endpoints.navlinks}`,prepare).then(res=>{
            if(res.status === 200){
                SuccessNotifications('Ссылка успешно отредактирована')
            }
        }).catch(()=> ErrorNotifications('произошла ошибка при редактировании ссылки'))
    }
    return(
        <Modal visible={data.show}
               title={`Редактировать ссылку № ${data.target.id}`}
               onCancel={() => setShow(false)}
               footer={
                   <>
                       <Button onClick={submit}>Отравить</Button>
                       <Button onClick={() => setShow(false)}>Закрыть</Button>
                   </>
               }>
            <Form form={form} initialValues={{title: data.target.title, description: data.target.description}}>
                <Form.Item name={'title'} label={'Заголовок'} rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name={'description'} label={'Описание ссылки'} rules={[{required: true}]}>
                    <TextArea/>
                </Form.Item>

            </Form>
        </Modal>
    )
})