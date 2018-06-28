// the object whole information of the sistem;

centralInformationModel = {
    DBFieldMedicine = ['code', 'batch', 'quantity', 'expiration', 'prize'],
    sendEmailUserAndPassword = {
        user : '',
        password: ''
    }
}

Object.freeze(centralInformationModel);
export default {DBFieldMedicine,sendEmailUserAndPassword };