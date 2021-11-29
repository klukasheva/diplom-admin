import * as React from 'react'
import {observer} from "mobx-react";
import {ValuesModalI} from "../stores/modalStore";
import {Button, Form, Input, InputNumber, Modal} from "antd";
import {useForm} from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import {config} from "../config";
import {ErrorNotifications, SuccessNotifications} from "../norifications/notifications";

interface EditVacancyModalI {
    data: ValuesModalI,
    setShow: (value: boolean) => void
}
export const EditVacancyModal = observer(({data, setShow}: EditVacancyModalI)=>{
    const [form] = useForm();
    const submit = async ()=>{
        const values = form.getFieldsValue();
        try {
            const prepareBody = {...values, id: data.target.id}
            await axios.put(`${config.host}:${config.api_port}/${config.endpoints.vacansy}`, prepareBody).then(res=>{
                if(res.status===200){
                    SuccessNotifications(`Вакансия №${data.target.id} успешно отредактирована`)
                }
            }).catch(()=>ErrorNotifications('Произошла ошибка при редактировании вакансии'))
        }
        catch (e) {

        }
    }
    return(
        <Modal visible={data.show}
               title={`Редактировать вакансию № ${data.target.id}`}
               onCancel={() => setShow(false)}
               footer={
                   <>
                       <Button onClick={submit}>Отравить</Button>
                       <Button onClick={() => setShow(false)}>Закрыть</Button>
                   </>
               }>
            <Form form={form} initialValues={{offerDescription: data.target.offerDescription, offerName: data.target.offerName , salaryEnd: data.target.salaryEnd, salaryStart: data.target.salaryStart}}>
                <Form.Item name={'offerName'} label={'Наименование'} rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name={'offerDescription'} label={'Описание вакансии'} rules={[{required: true}]}>
                    <TextArea/>
                </Form.Item>
                <Form.Item name={'salaryStart'} label={'Минимальная зарплата'} rules={[{required: true}]} >
                    <InputNumber minLength={300}/>
                </Form.Item>
                <Form.Item name={'salaryEnd'} label={'Максимальная зарплата'}>
                    <InputNumber  minLength={350}/>
                </Form.Item>
            </Form>
        </Modal>
    )
})