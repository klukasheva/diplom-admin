import * as React from 'react'
import {observer} from "mobx-react";
import {Button, Form, Input, Modal} from "antd";
import {useForm} from "antd/es/form/Form";
import {ValuesModalI} from "../stores/modalStore";
import {updateCategory} from "../pages/category.service";
import {ErrorNotifications, SuccessNotifications} from "../norifications/notifications";

interface EditCategory {
    data: ValuesModalI,
    setShow: (value: boolean) => void
}
export const EditProductCategoryModal = observer(({data, setShow}: EditCategory)=>{
    const [form] = useForm();

    const submit = async () => {
        const values = await form.getFieldsValue();
        try {
            await updateCategory({id: data.target.id, ...values});
            SuccessNotifications('Категория товара успешно отредактирована')
        }
        catch (e) {
            ErrorNotifications('Произошла при редактировании')
        }
    }
    return(
        <Modal visible={data.show}
               title={`Редактировать категорию № ${data.target.id}`}
               onCancel={() => setShow(false)}
               footer={
                   <>
                       <Button onClick={submit}>Отравить</Button>
                       <Button onClick={() => setShow(false)}>Закрыть</Button>
                   </>
               }>
            <Form form={form} initialValues={{
                id: data.target.id,
                title: data.target.title,
                phoneNumber: data.target.phoneNumber,
            }}>
                <Form.Item name={'title'} label={'Наименование продукта'}>
                    <Input/>
                </Form.Item>
                <Form.Item name={'phoneNumber'} label={'Наименование продукта'}>
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    )
})