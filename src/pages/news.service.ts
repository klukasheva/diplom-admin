import axios from "axios";
import {config} from "../config";
import {NewsI} from "./News";


export const getNewsList = async () => {
    return await axios.get<NewsI[]>(`${config.host}:${config.api_port}/${config.endpoints.news}`)
}

export const editNews = async (data: Partial<NewsI>) => {
    const prepareData = {
        title: data.title,
        author: data.author,
        content: data.content,
        creationDate: data.creationDate,
        id: data.id
    }

    await axios.put<NewsI>(`${config.host}:${config.api_port}/${config.endpoints.news}`, prepareData).then(res=>{
        if(res.status === 200) {
            const formData = new FormData()
            formData.append('id', res.data.id.toString())
            if(data.image){
                formData.append('file', data.image)
                axios.post(`${config.host}:${config.api_port}/${config.endpoints.news}/upload`, formData,{
                    headers:{
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'multipart/form-data'
                    }
                })
            }
        }
    })
}
export const createNews = async (body: NewsI) => {
    const prepareData = {
        title: body.title,
        author: body.author,
        creationDate: body.creationDate,
        content: body.content,
    }
    await axios.post<NewsI>(`${config.host}:${config.api_port}/${config.endpoints.news}`, prepareData).then(res=>{
        if(res.status === 201){
            const prepareImage= new FormData();
            prepareImage.append('file', body.image)
            prepareImage.append('id', res.data.id.toString())
            axios.post(`${config.host}:${config.api_port}/${config.endpoints.news}/upload`,prepareImage,
                {
                    headers:{
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'multipart/form-data'
                    }
                })
        }
        }
    )
}

export const deleteNews = async (arrayIds: number[]) => {
    const body = {ids: arrayIds};
    return await axios.delete<{ids: number[]}>(`${config.host}:${config.api_port}/${config.endpoints.news}`, {data: body})
}