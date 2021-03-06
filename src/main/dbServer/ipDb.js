import Datastore from 'nedb';
/* 
{
    address:102.102.3.1,
    id:201607010,
    name:樊国睿
    sex:男
},
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
    deleteStudent(studentId, callBack) {
        this.db.remove({ 'id': studentId }, callBack);
    }
    deleteAllIp(callBack) {
        return this.db.remove({}, callBack);
    }
    findByAddress(address) {
        return this.db.find({ "address": address });
    }
    findAllAddress() {
        return this.db.find();
    }
    findById(studentId) {
        return this.db.find({ "id": studentId });
    }

}