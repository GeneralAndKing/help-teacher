import Datastore from 'nedb';
import path from 'path';
/*
{
    className:2016级计算机科学与技术2班,
    students:[
        {
        id:201607010244
        name:睿哥
        sex:男
        }
        {
        id:201607010244
        name:睿少
        sex:男
        }
        ....
    ],
}

*/
//find 返回的都是游标 方便处理
export default class ClasstDb {
    constructor() {
        this.db = new Datastore({
            autoload: true,
            filename: path.join(path.join(path.resolve("."), "/userData/class.db"))
        });

    }
    createClassJson() {
        return {
            className: null,
            students: [
                {
                    id: null,
                    name: null,
                    sex: null,
                },
            ]
        }
    }
    //插入班级数据
    insertClass(classJson) {
        this.db.insert(classJson, (error, doc) => {
        });
    }
    insertStudent(className, studentJson) {
        let classJson = this.db.find({ 'className': className });
        classJson.students.insert(studentJson, (error, doc) => {
        });
    }
    updateClass(classJson) {
        this.db.update({ 'className': classJson.className }, classJson, (error, doc) => {
        });
    }
    updateStudent(className, studentJson) {
        let classJson = this.db.find({ 'className': className });
        classJson.update({ 'id': studentJson.id }, studentJson, (error, doc) => {
        });
    }
    deleteClass(className) {
        this.db.remove({ 'className': className }, (error, doc) => {
        });
    }
    deleteStudent(className, studentId) {
        let classJson = this.db.find({ 'className': className });
        classJson.remove({ 'id': studentId }, (error, doc) => {
        });
    }
    findByClassName(className) {
        return this.db.find({ className: className });
    }
    findAllClass() {
        return this.db.find();

    }
    findByStudentName(studentName) {
        return this.db.find({ 'className': className ,'students.id':studentId});
    }
}