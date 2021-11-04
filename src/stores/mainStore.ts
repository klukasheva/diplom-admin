import {ModalStore} from "./modalStore";

export class MainStore{
    public ModalStore: ModalStore;
    constructor() {
            this.ModalStore = new ModalStore();
    }
}