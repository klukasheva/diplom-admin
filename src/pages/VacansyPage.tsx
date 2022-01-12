import * as React from 'react'
import {FunctionComponent, useEffect, useState} from "react";
import {Button, Form, Input, InputNumber, Space, Table} from "antd";
import {useForm} from "antd/es/form/Form";
import axios from "axios";
import {config} from "../config";
import {ErrorNotifications, SuccessNotifications} from "../norifications/notifications";
import {DeleteOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {useModal} from "../App";


type VacansyType={
    id:number,
    salaryStart:number,
    salaryEnd: number,
    offerName:string,
    offerDescription:string

}
export const VacansyPage : FunctionComponent = () => {
    const modal = useModal()
    const COLUMNS = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Начальная вилка',
            dataIndex: 'salaryStart',
            key: 'salaryStart',
        },
        {
            title: 'Конечная вилка',
            dataIndex: 'salaryEnd',
            key: 'salaryEnd',
        },
        {
            title: 'Наименование вакансии',
            dataIndex: 'offerName',
            key: 'offerName',
        },
        {
            title: 'Описание вакансии',
            dataIndex: 'offerDescription',
            key: 'offerDescription',
        },
        {
            dataIndex: 'id',
            render: (id: number) => <Button shape="circle" onClick={() => deleteVacansy([id])} icon={<DeleteOutlined/>}/>
        },
        {
            render: (data: VacansyType) => <Button onClick={() => {
                modal.setShowModal(true)
                modal.setData({target: data, key: 'editVacansy'})
            }}>Edit</Button>
        },
    ]

    const [form] = useForm();
    const [vacansyList, setVacansyList] = useState<VacansyType[]>([]);

    useEffect(()=>{
        axios.get<VacansyType[]>(`${config.host}:${config.api_port}/${config.endpoints.vacansy}`).then(res=>{
            if(res.status===200){
                setVacansyList(res.data)
            }
        }).catch(()=>{
            ErrorNotifications('Произошла ошибка при получении списка вакансий')
        })
    },[])

    const deleteVacansy = async (ids: number[]) => {
        await axios.delete<{ ids: number[] }>(`${config.host}:${config.api_port}/${config.endpoints.vacansy}`, {data: {ids: ids}}).then(res=>{
            if(res.status===200) {
                SuccessNotifications('Вакансия успешно удалён')
            }
        }).catch(()=>{
            ErrorNotifications('Произошла ошибка при удалении вакансии')
        })
    }
    const createVacansy = async () => {
        try {
            const values = form.getFieldsValue();
            const prepare = {
                ...values,
                salaryEnd: !values.salaryEnd ? null : values.salaryEnd
            }
           await axios.post(`${config.host}:${config.api_port}/${config.endpoints.vacansy}`,prepare).then(res=>{
                if(res.status === 201){
                    SuccessNotifications('Вакансия успешно создана')
                }
            }).catch(()=>{
                ErrorNotifications('Произошла ошибка при создании вакансии')
            })
        }
        catch (e) {

        }
    }
    return(
        <div style={{height: '100vh'}}>
            <Space style={{padding: '30px', width: "100%"}} direction={'horizontal'}>
                <Form form={form} initialValues={{offerDescription: '', offerName: '' , salaryEnd: '', salaryStart: ''}}>
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
                    <Button type={'primary'} onClick={createVacansy}>
                        Создать
                    </Button>
                </Form>
            </Space>
            <Table dataSource={vacansyList} columns={COLUMNS}/>
        </div>
    )
}