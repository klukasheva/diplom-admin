import { notification } from 'antd';

export const SuccessNotifications = (message: string) => {
       notification.open({message:message, placement: 'bottomRight'})
}

export const ErrorNotifications = (message:string) => {
       notification.error({message:message, placement: 'bottomRight'})
}