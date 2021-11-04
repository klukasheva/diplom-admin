import axios from "axios";
import {config} from "../config";
import {ProductI} from "./product.service";

export interface FeedbackI{
    id:number, username: string, phoneNumber: string, text:string
}

export interface OrderI{
    id: number;
    phoneNumber: string;
    customerName: string;
    address: string;
    cost: number;
    description: string;
    products: ProductI[];
}

export const getFeedbacksList = async () => {
   return  await axios.get<FeedbackI[]>(`${config.host}:${config.api_port}/${config.endpoints.feedback}`)
}

export const getOrdersList = async () => {
    return await axios.get<OrderI[]>(`${config.host}:${config.api_port}/${config.endpoints.order}`)
}