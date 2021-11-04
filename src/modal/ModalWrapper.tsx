import * as React from 'react'
import {ModalController} from "./ModalController";
import {observer} from "mobx-react";
import {useModal} from "../App";


export const ModalWrapper = observer(()=>
    {
        const data = useModal()
        const Modal = data ? ModalController[data.values.key] : null;
        if(!Modal){
            return null
        }
        return(
            <Modal data={data.values} setShow={data.setShowModal}/>
        )
    }
)