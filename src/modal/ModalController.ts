import {ModalKeys} from "./ModalKeys";
import {EditProductModal} from "./EditProductModal";
import {EditNewsModal} from "./EditNewModal";
import {EditProductCategoryModal} from "./EditProductCategory";
import {EditVacancyModal} from "./EditVacancyModal";
import {EditLinksModal} from "./EditLinksModal";

export const ModalController={
    [ModalKeys.CREATE_PRODUCT]: EditProductModal,
    [ModalKeys.EDIT_NEWS]: EditNewsModal,
    [ModalKeys.EDIT_CATEGORY]: EditProductCategoryModal,
    [ModalKeys.EDIT_VACANSY]: EditVacancyModal,
    [ModalKeys.EDIT_LINKS] : EditLinksModal,
}