import {makeAutoObservable} from "mobx";

export interface ValuesModalI{
    target: any,
    key: string,
    show: boolean,
}

export interface ModalStoreI{
    values: ValuesModalI,
    setModal: ()=>void
}

export class ModalStore{
    constructor() {
        makeAutoObservable(this)
    }
    public values = {
            target: {},
            key: '',
            show: false
    }
     setData = (data:Pick<ValuesModalI,'target'| 'key'>) => {
            this.values = {...this.values, ...data}
     }

     setShowModal = (show: boolean) => {
        this.values.show = show
     }
}
