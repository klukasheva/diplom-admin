import {Button, Form, Input, InputNumber, Select, Table, Upload} from 'antd'
import Space from 'antd/lib/space'
import * as React from 'react'
import {useEffect, useState} from "react";
import {createProduct, deleteProduct, getProductList, ProductI,} from "./product.service";
import {DeleteOutlined} from '@ant-design/icons';
import {ErrorNotifications, SuccessNotifications} from "../norifications/notifications";
import {observer} from "mobx-react";
import {useModal} from "../App";
import {UploadOutlined} from '@ant-design/icons';
import {UploadFile} from "antd/es/upload/interface";
import {CategoryI, getCategoryList} from "./category.service";
import TextArea from "antd/es/input/TextArea";

const {Option} = Select;


const remove = async (ids: number[]) => {
    try {
        await deleteProduct(ids)
        SuccessNotifications(`Продукт № ${ids[0]} удалён `)
    } catch (e) {
        ErrorNotifications(`Произошла ошибка. Продукт ${ids[0]} не был удалён`)
    }
}

export const Product = observer(() => {

    const COLUMNS = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Наименование',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Категория',
            dataIndex: 'category',
            key: 'category',
            render: (category: { id: number, title: string }) => <div>{category.title}</div>
        },
        {
            title: 'Изображение',
            dataIndex: 'image',
            key: 'image',
            render: (image: string) => <img style={{width: '150px', height: '100px'}}
                                            src={`http://localhost:3001/files/${image}`}/>
        },
        {
            title: 'Доп.фотографии',
            dataIndex: 'additionalImages',
            key: 'additionalImages',
            render: (images:any)=> <div style={{display: 'flex', width: '220px', flexWrap: 'wrap'}}>
                {
                    images.map((item: { link: string})=>
                        <img  src={`http://localhost:3001/files/${item.link}`} style={{width: '100px', height: '50px', marginLeft: '5px', marginTop: '5px'}}/>
                    )
                }
            </div>
        },
        {
            title: 'Начальная стоимость',
            dataIndex: 'cost',
            key: 'cost',
        },
        {
            title: 'Цена по акции',
            dataIndex: 'stockCost',
            key: 'stockCost',
        },
        {
            title: 'Описание товара',
            dataIndex: 'description',
            key: 'description',
            render: (description: string) => <div>{description.substring(0,200)}</div>
        },
        {
            dataIndex: 'id',
            render: (id: number) => <Button shape="circle" onClick={() => remove([id])} icon={<DeleteOutlined/>}/>
        },
        {
            render: (data: ProductI) => <Button onClick={() => {
                modal.setShowModal(true)
                modal.setData({target: data, key: 'createProduct'})
            }}>Edit</Button>
        }

    ]

    const modal = useModal()
    const [form] = Form.useForm();
    const [file, setFile] = useState<File>();
    const [additionalFiles, setAdditionalFiles] = useState<UploadFile[]>([]);
    const [products, setProducts] = useState<ProductI[]>([]);
    const [categoryList, setCategoryList] = useState<CategoryI[]>([])
    const [currentCategory, setCurrentCategory] = useState<string>('')

    useEffect(() => {
        try {
            getCategoryList().then(res => setCategoryList(res.data))
        } catch (e) {
            ErrorNotifications('Произошла ошибка при загрузке категорий')
        }
    }, [])

    useEffect(() => {
        try {
            getProductList().then(res => setProducts(res.data));
        } catch (e) {
            ErrorNotifications('Не удалось получить список продуктов')
        }
    }, [])
    const submit = async () => {
        try {
            await form.validateFields();
            const data = await form.validateFields();
            const prepareFiles = additionalFiles.map(item => item.originFileObj)
            await createProduct({...data, image: file, additionalImages: prepareFiles, category: categoryList.find(category => category.title === currentCategory)})
            SuccessNotifications('Продукт успешно создан')
        } catch (e) {
            ErrorNotifications('Произошла ошибка при создании продукта')
        }
    }
    return (
        <div style={{height: '100vh'}}>
            <Space style={{padding: '30px'}} direction={'horizontal'}>
                <Form form={form} initialValues={{title: '', description: '', cost: 0, stockCost: 0, image: ''}}>
                    <Space>
                        <Form.Item name={'title'} label={'Наименование продукта'} rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name={'category'} label={'Категория продукта'} >
                            <Select style={{width: '200px'}}
                                    onChange={(value: string) => setCurrentCategory(value)}
                                    placeholder="Добавить категорию">
                                {categoryList.map(item =>
                                    <Option value={item.title} key={item.id}>
                                        {item.title}
                                    </Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item name={'description'} rules={[{required: true}]}>
                            <TextArea placeholder={'Описание продукта'}/>
                        </Form.Item>
                        <Form.Item name={'cost'} label={'Стоимость товара'} rules={[{required: true}]}>
                            <InputNumber/>
                        </Form.Item>
                    </Space>
                    <Space>
                        <Form.Item name={'stockCost'} label={'Стоимость товара с учётом скидки'}
                                   rules={[{required: true}]}>
                            <InputNumber/>
                        </Form.Item>
                        <Form.Item name={'image'} label={'Добавить фотографию продукта'} rules={[{required: true}]}>
                            <input type={'file'}
                                   onChange={event => event?.target?.files && setFile(event.target.files[0])}/>
                        </Form.Item>
                        <Form.Item label={'Дополнительные фотографии'} rules={[{max: 5}]} >
                            <Upload onChange={event => setAdditionalFiles(event.fileList)}>
                                <Button icon={<UploadOutlined/>}>Загрузить</Button>
                            </Upload>
                        </Form.Item>
                    </Space>
                    <Button
                        key='submit'
                        type='primary'
                        onClick={submit}
                    >
                        Подтвердить
                    </Button>
                </Form>
            </Space>
            <Table dataSource={products} columns={COLUMNS}>

            </Table>
        </div>
    )

})