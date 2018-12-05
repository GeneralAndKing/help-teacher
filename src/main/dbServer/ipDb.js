import Datastore from 'nedb';
import path from 'path';
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
    insertIpJson(IpJson) {
        this.db.insert(IpJson, (error, doc) => {
        });
    }
    insertStudent(address, studentJson) {
        let classJson = this.db.find({ 'address': address });
        classJson.students.insert(studentJson, (error, doc) => {
        });
    }
    findByAddress(address) {
        return this.db.find({ "address": address });
    }
    findByStudentId(studentId) {
        return this.db.find({ "students.id": studentId });
    }

}