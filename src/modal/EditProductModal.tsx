import * as React from 'react'
import {Button, Form, Image, Input, InputNumber, Modal, Select, Upload} from "antd";
import {ValuesModalI} from "../stores/modalStore";
import {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {useForm} from "antd/es/form/Form";
import {ProductI, updateProduct} from "../pages/product.service";
import {ErrorNotifications, SuccessNotifications} from "../norifications/notifications";
import {UploadFile} from "antd/es/upload/interface";
import {PlusOutlined} from "@ant-design/icons";
import {CategoryI, getCategoryList} from "../pages/category.service";


const {Option} = Select;

interface CreateProductModalI {
    data: ValuesModalI,
    setShow: (value: boolean) => void
}

export const EditProductModal = observer(({data, setShow}: CreateProductModalI) => {
    const [categoryList, setCategoryList] = useState<CategoryI[]>([])
    const [file, setFile] = useState<UploadFile>({
        url: `http://localhost:3001/files/${data.target.image}`,
        uid: '-1',
        name: data.target.image,
        status: "done",
    });

    const [additionalFiles,setAdditionalFiles] = useState<UploadFile[]>(()=> data.target.additionalImages.map(function(image:{id: number, link: string},index: number){
        return {
            url: `http://localhost:3001/files/${image.link}`,
            uid: -index,
            name: image.link,
            status: 'done'
        }
    }))

    const [form] = useForm();
    const [currentCategory, setCurrentCategory] = useState<string>('')
    const submit = async () => {
        try {
            const values = form.getFieldsValue();
            const prepareBody: Partial<ProductI> = {
                ...values,
                id: data.target.id,
                image: file.originFileObj,
                category: categoryList.find(category => category.title === currentCategory),
                additionalImages: additionalFiles.map(item => item.originFileObj)
            }
            await updateProduct(prepareBody);
            SuccessNotifications(`Продукт № ${data.target.id} успешно отредактирован`)
        } catch (e) {
            ErrorNotifications('Произошла ошибка при редактировании продукта')
        }
    }

    useEffect(() => {
        try {
            getCategoryList().then(res => setCategoryList(res.data))
        } catch (e) {
            ErrorNotifications('Произошла ошибка при загрузке категорий')
        }
    }, [])
    // @ts-ignore
    const onChange = ({ fileList: newFileList }) => {
        setAdditionalFiles(newFileList);
    };

    return (
        <Modal visible={data.show}
               title={`Редактировать продукт № ${data.target.id}`}
               onCancel={() => setShow(false)}
               footer={
                   <>
                       <Button onClick={submit}>Отравить</Button>
                       <Button onClick={() => setShow(false)}>Закрыть</Button>
                   </>
               }>
            <Form form={form} initialValues={{
                title: data.target.title,
                description: data.target.description,
                cost: data.target.cost,
                stockCost: data.target.stockCost,
                image: ''
            }}>
                <Form.Item name={'title'} label={'Наименование продукта'}>
                    <Input/>
                </Form.Item>
                <Form.Item name={'description'} label={'Описание продукта'}>
                    <Input/>
                </Form.Item>
                <Form.Item name={'cost'} label={'Стоимость товара'}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item>
                    <Select style={{width: '200px'}}
                            onChange={(value: string) => setCurrentCategory(value)}
                            defaultValue={data.target.category.title}
                            placeholder="Добавить категорию">
                        {categoryList.map(item =>
                            <Option value={item.title} key={item.id}>
                                {item.title}
                            </Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item name={'stockCost'} label={'Стоимость товара с учётом скидки'}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item name={'image'} label={'Обновить фотографию продукта'}>
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
                <Form.Item label={'Дополнительные фотографии'} rules={[{max: 5}]}>
                        <Upload fileList={additionalFiles}
                                onChange={onChange}
                                // onChange={event => setAdditionalFiles(prevState => ([...prevState,event.fileList[0]]))}
                                // onRemove={(file)=> setAdditionalFiles(prev=>prev.filter(i=>i.name !== file.name))}
                               >
                                <PlusOutlined/>
                        </Upload>
                </Form.Item>
            </Form>
        </Modal>
    )
})