import * as React from 'react'
import {Table} from "antd";
import {useEffect, useState} from "react";
import { getOrdersList, OrderI} from "./messages.service";
import {ProductI} from "./product.service";

const columns = [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Номер телефона',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
    },
    {
        title: 'Имя клиента',
        dataIndex: 'customerName',
        key: 'customerName',
    },
    {
        title: 'Адрес',
        dataIndex: 'address',
        key: 'address',
    },
    {
      title: 'Стоимость',
      dataIndex: 'cost',
      key: 'cost'
    },
    {
        title: 'Описание',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Продукция',
        dataIndex: 'products',
        key: 'products',
        render: (product: ProductI[]) => <div>
            {product.map((item, index)=>
                <div key={index}>
                    <img src={`http://localhost:3001/files/${item.image}`} style={{width: '100px', height: '50px', marginLeft: '5px', marginTop: '5px'}}/>
                    <div>
                        {item.title}
                        {item.cost}рублей
                        {item.count}
                    </div>
                </div>
            )}
        </div>
    }

]

export const OrdersPage =() => {

    const [orders,setOrders] = useState<OrderI[]>([])

    useEffect(()=>{
        console.log('im here')
        getOrdersList().then(res=>{
            if(res.status === 200){
                setOrders(res.data)
            }
        })
    },[])

    return(
        <div style={{height: '100vh'}}>
            <Table dataSource={orders} columns={columns}/>
        </div>
    )
}