import Datastore from 'nedb';
/* 
{
    address:102.102.3.1,
    students:[],
}
*/

export default class IpDb {
    constructor() {
        this.db = new Datastore({
            inMemoryOnly: true
        });
    }
    insertIpJson(IpJson, callBack) {
        this.db.insert(IpJson, callBack);
    }
    insertStudent(address, studentJson, callBack) {
        this.db.insert({ 'address': address }, studentJson, callBack)
    }
    deleteStudent(address, studentId, callBack) {
        this.db.update({ 'address': address }, { $pull: { students: { id: studentId } } }, callBack);
    }
    findByAddress(address) {
        return this.db.find({ "address": address });
    }
    findAllAddress() {
        return this.db.find();
    }

}