import * as React from 'react'
import {FunctionComponent, useEffect, useState} from "react";
import {Button, DatePicker, Form, Input, Select, Space, Table} from 'antd';
import TextArea from "antd/es/input/TextArea";
import {createNews, deleteNews, getNewsList} from "./news.service";
import {ErrorNotifications, SuccessNotifications} from "../norifications/notifications";
import {useModal} from "../App";
import {observer} from "mobx-react";
import {DeleteOutlined} from "@ant-design/icons";

export interface NewsI {
    id: number
    title: string;
    author: string;
    creationDate: string;
    content: string;
    image: File;
}


export const News= observer(() => {

    const remove = async (ids: number[]) => {
        try {
            await deleteNews(ids)
            SuccessNotifications(`Новость № ${ids[0]} удалена `)
        } catch (e) {
            ErrorNotifications(`Произошла ошибка. Новость ${ids[0]} не была удалена`)
        }
    }

    const COLUMNS = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Автор',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Текст',
            dataIndex: 'content',
            key: 'content',
            render: (content: string) => <div>{content.substring(0,300)}</div>
        },
        {
            title: 'Дата создания',
            dataIndex: 'creationDate',
            key: 'creationDate',
        },
        {
            title: 'Изображение',
            dataIndex: 'image',
            key: 'image',
            render: (image: string) =>  <img style={{width: '150px', height: '100px'}}
                                             src={`http://localhost:3001/files/${image}`}/>
        },
        {
            render: (data: NewsI) => <Button onClick={() => {
                modal.setShowModal(true)
                modal.setData({target: data, key: 'editNews'})
            }}>Edit</Button>
        },
        {
            dataIndex: 'id',
            render: (id: number) => <Button shape="circle" onClick={() => remove([id])} icon={<DeleteOutlined/>}/>
        },
    ]

    const modal = useModal()
    const [form] = Form.useForm();
    const [file, setFile] = useState<File>();
    const [creationDate, setCreationDate] = useState('')
    const [newsList, setNewsList] = useState<NewsI[]>([])

    useEffect(()=> {
        getNewsList().then(res=>
            setNewsList(res.data)
        )
    },[])

    const createNewsHandler = async () => {
        try {
            await form.validateFields()
            const values = await form.validateFields()
                await createNews({
                    ...values,
                    creationDate,
                    image: file,
                })
            SuccessNotifications('Новость успешно создана')

        }
        catch (e) {
            ErrorNotifications('Произошла ошибка при создании новости')
        }
    }
    return (
        <div style={{height: '100vh'}}>
            <Space style={{padding: '30px'}} direction={'horizontal'}>
                <Form form={form} initialValues={{title: '', author: '' , creationDate: '', content: '', image: ''}}>
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
                        <input type={'file'}
                               onChange={event => event?.target?.files && setFile(event.target.files[0])}/>
                    </Form.Item>
                    <Button type={'primary'} onClick={createNewsHandler}>
                        Создать
                    </Button>
                </Form>
            </Space>
            <Table dataSource={newsList} columns={COLUMNS}/>
        </div>
    )
})