import * as React from 'react'
import {Table} from "antd";
import {useEffect, useState} from "react";
import {FeedbackI, getFeedbacksList} from "./messages.service";


const columns = [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Имя пользователя',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: 'Id',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
    },
    {
        title: 'Id',
        dataIndex: 'text',
        key: 'text',
    },

]
export const Feedbacks = () => {
    const [feedbacks,setFeedbacks] = useState<FeedbackI[]>([])

    useEffect(()=>{
         getFeedbacksList().then(res=>{
             if(res.status === 200){
                 setFeedbacks(res.data)
             }
         })
    },[])
  return(
      <div style={{height: '100vh'}}>
          <Table dataSource={feedbacks} columns={columns}/>
      </div>
  )
}