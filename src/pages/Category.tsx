import {Button, Form, Input, Space, Table} from 'antd'
import * as React from 'react'
import {useEffect, useState} from "react";
import {ErrorNotifications, SuccessNotifications} from "../norifications/notifications";
import {CategoryI, createCategory, getCategoryList} from "./category.service";

export const Category = () => {

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Наименование',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Номер телефона',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber'
        }
    ]

    const [title, setTitle] = useState('');
    const [phone,setPhone] = useState('');
    const [categories, setCategories] = useState<CategoryI[]>([]);
    const [form] = Form.useForm();
    useEffect(() => {
        try {
            getCategoryList().then(res => setCategories(res.data))
        } catch (e) {
            ErrorNotifications('Произошла ошибка при получении списка категорий')
        }
    }, [])

    const submit = async () => {
        try {
            await form.validateFields()
            await createCategory({phoneNumber: phone, title: title})
            SuccessNotifications(`Категория ${title} успешно создана!`)
        } catch (e) {
            ErrorNotifications(`Невозможно создать категорию`)
        }
    }
    return (
        <div style={{height: '100vh'}}>
            <Space style={{padding: '30px'}} direction={'vertical'}>
                <Form.Item label={'Введите название категории'} name={'title'}>
                    <Input onChange={e => setTitle(e.target.value)}/>
                </Form.Item>
                <Form.Item label={'Введите номер телефона категории'} name={'phoneNumber'}>
                    <Input onChange={(e)=> setPhone(e.target.value)}/>
                </Form.Item>
                <Button type={'primary'} onClick={submit}>Создать категорию</Button>
            </Space>
            <Table dataSource={categories} columns={columns}/>
        </div>
    )
}