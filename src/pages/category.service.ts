import axios from "axios";
import {config} from "../config";
import {ProductI} from "./product.service";

export interface CategoryI{
    id: number,
    title: string,
    phoneNumber: string,
    products?: ProductI[]
}

export const createCategory = async (data: {title: string, phoneNumber: string}) =>{
     await axios.post(`${config.host}:${config.api_port}/${config.endpoints.category}`,{title: data.title, phoneNumber: data.phoneNumber})
}

export const getCategoryList = async () => {
   return await axios.get<CategoryI[]>(`${config.host}:${config.api_port}/${config.endpoints.category}`)
}

export const updateCategory = async (data:CategoryI) => {
    return await axios.put<CategoryI>(`${config.host}:${config.api_port}/${config.endpoints.category}`,data)
}

export const deleteCategory = async (arrayIds: number[]) => {
    const body = {ids: arrayIds};
    return await axios.delete<{ids: number[]}>(`${config.host}:${config.api_port}/${config.endpoints.category}`, {data: body})
}