import * as React from 'react'
import {ValuesModalI} from "../stores/modalStore";
import {Button, DatePicker, Form, Input, Modal, Upload} from "antd";
import {useForm} from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import {useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {UploadFile} from "antd/es/upload/interface";
import {editNews} from "../pages/news.service";
import {NewsI} from "../pages/News";

export interface EditProductModalI{
    data: ValuesModalI,
    setShow: (value: boolean) => void
}

export const EditNewsModal = ({data, setShow}: EditProductModalI) => {
    const [form] = useForm();
    const [file, setFile] = useState<UploadFile>({
        url: `http://localhost:3001/files/${data.target.image}`,
        uid: '-1',
        name: data.target.image,
        status: "done",
    });
    const [creationDate, setCreationDate] = useState('')

    const submit = async () => {
        try {
            await form.validateFields()
            const values = await form.validateFields();
            const prepareBody: Partial<NewsI> = {
                ...values,
                id: data.target.id,
                image: file.originFileObj,
                creationDate: creationDate
            }
            await editNews(prepareBody)
        }
        catch (e) {

        }
    }
    return(
        <div>
            <Modal visible={data.show}
                   title={`Редактировать новость № ${data.target.id}`}
                   onCancel={() => setShow(false)}
                   footer={
                       <>
                           <Button onClick={submit}>Отравить</Button>
                           <Button onClick={() => setShow(false)}>Закрыть</Button>
                       </>
                   }>
                <Form form={form} initialValues={{title: data.target.title,
                    author: data.target.author,
                    content: data.target.content,
                    image: data.target.image }}>
                    <Form.Item name={'title'} label={'Заголовок'} rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'author'} label={'Автор новости'} rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'creationDate'} label={'Дата создания'} rules={[{required: true}]}>
                        <DatePicker  onChange={(_,dateString) => setCreationDate(dateString)}  />
                    </Form.Item>
                    <Form.Item name={'content'} rules={[{required: true}]} >
                        <TextArea placeholder={'Текст'} minLength={100}/>
                    </Form.Item>
                    <Form.Item rules={[{required: true}]}>
                        <Upload onChange={event => setFile(event.fileList[0])}
                                listType="picture-card"
                                style={{width: '300px', height: '300px'}}
                                fileList={file ? [file] : []}
                        >
                            {!file &&
                            <div>
                                <PlusOutlined/>
                                <div style={{marginTop: 8}}>Загрузить</div>
                            </div>
                            }
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}