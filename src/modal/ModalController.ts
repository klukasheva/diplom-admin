import {ModalKeys} from "./ModalKeys";
import {EditProductModal} from "./EditProductModal";
import {EditNewsModal} from "./EditNewModal";

export const ModalController={
    [ModalKeys.CREATE_PRODUCT]: EditProductModal,
    [ModalKeys.EDIT_NEWS]: EditNewsModal
}