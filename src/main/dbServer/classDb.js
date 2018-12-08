
const path = require('path')
const Datastore = require("nedb");
/*
{
    className:2016级计算机科学与技术2班,
    students:[
        {
        id:'201607010244',
        name:'睿哥',
        sex:'男'
        },
        {
        id:201607010244,
        name:睿少,
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
    this.db.ensureIndex({ fieldName: 'className', unique: true, sparse: true });
    this.db.loadDatabase();

  }
  static createClassJson() {
    return {
      className: null,
      students: [
      ]
    }
  }
  static createStudentJson($id, $name, $sex) {
    return {
      id: $id,
      name: $name,
      sex: $sex
    }
  }
  //插入班级数据
  insertClass(classJson,callBack) {
    return this.db.insert(classJson,callBack);
  }
  insertStudent(className, studentJson, callBack) {
    return this.db.update({ 'className': className }, { $push: { students: studentJson } }, callBack);
  }
  updateClassName(oldClassName,className,callBack) {
    return this.db.update({ 'className': oldClassName }, { 'className': className }, {},callBack);
  }
  updateStudent(className, oldStudentId, studentJson, callBack) {
    this.db.update({ 'className': className }, { $pull: { students: { id: oldStudentId } } });
    return this.insertStudent(className, studentJson, callBack);
  }
  deleteClass(className,callBack) {
    return this.db.remove({ 'className': className },callBack);
  }
  deleteStudent(className, studentId,callBack) {
    return this.db.update({ 'className': className }, { $pull: { students: { id: studentId } } },callBack);
  }
  findByClassName(className) {
    return this.db.find({ className: className });
  }
  findAllClass() {
    return this.db.find({});
  }
  findByStudentId(className, studentId) {
    return this.db.find({ 'className': className, 'students.id': studentId });
  }
}