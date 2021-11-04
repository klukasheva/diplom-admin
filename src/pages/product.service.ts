import axios from "axios";
import {config} from "../config";
import {CategoryI} from "./category.service";

export interface ProductI{
    id: number
    title: string,
    cost: number,
    stockCost:number,
    description?: string,
    image: File,
    additionalImages: File[],
    category: CategoryI,
    count: number
}

export const updateProduct = async (data:Partial<ProductI>) => {
    const prepareData = {
        id: data.id,
        title: data.title,
        cost: data.cost,
        stockCost: data.stockCost,
        description: data.description,
        category: data.category
    }
    await axios.put<ProductI>(`${config.host}:${config.api_port}/${config.endpoints.product}`,prepareData).then((res)=>{

            if(data.additionalImages ?? !!data.additionalImages){
                const additionalFiles = new FormData();
                additionalFiles.append('id', res.data.id.toString())
                data?.additionalImages?.forEach(item=>additionalFiles.append('image', item))
                axios.post(`${config.host}:${config.api_port}/images/multiple`,additionalFiles,{
                    headers:{
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'multipart/form-data'
                    }
                })
            }

        if(res.status === 200){
            const formData = new FormData();
            formData.append('id',res.data.id.toString())
            if(data.image){
                formData.append('file',data.image)
                axios.post(`${config.host}:${config.api_port}/${config.endpoints.product}/upload`, formData,{
                    headers:{
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'multipart/form-data'
                    }
                })
            }
        }
    })
}

export const createProduct = async (data: ProductI) => {
    const prepareData = {
        title: data.title,
        cost: data.cost,
        stockCost: data.stockCost,
        description: data.description,
        category: data.category
    }
    await axios.post<ProductI>(`${config.host}:${config.api_port}/${config.endpoints.product}`,prepareData, {
        headers:{
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
    }).then((res)=>{
        if(data.additionalImages.length>0){
            const additionalFiles = new FormData();
            additionalFiles.append('id', res.data.id.toString())
            data.additionalImages.forEach(item=>additionalFiles.append('image', item))
            axios.post(`${config.host}:${config.api_port}/images/multiple`,additionalFiles,{
                headers:{
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'multipart/form-data'
                }
            })
        }

        if(res.status === 201){
            const formData = new FormData();
            formData.append('id',res.data.id.toString())
            formData.append('file',data.image)
            axios.post(`${config.host}:${config.api_port}/${config.endpoints.product}/upload`, formData,{
                headers:{
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(()=>{})
                .catch(e=>console.error(e,'not added'))
        }
    })
}

export const getProductList = async ()=>{
    return await axios.get<ProductI[]>(`${config.host}:${config.api_port}/${config.endpoints.product}`)
}

export const deleteProduct = async  (arrayIds: number[]) => {
    const body = {ids: arrayIds};
    return await axios.delete<{ids: number[]}>(`${config.host}:${config.api_port}/${config.endpoints.product}`, {data: body})
}