import Datastore from 'nedb';
import path from 'path';
/*
{
    "className":"2016计算机科学与技术",
    "jobName":"作业名字",
    "startTime":"时间戳",
    "stopTime":30分钟(计算时间戳),
    "studentNum":68(总人数),
    "timestamp":时间毫秒,
    "status": 0(异常暂停) 1(收取中) 2(收取完成)
    "unfinishedStudents":
    [
        {
            "name":"樊总",
            "id":"201607010244",
            "sex":"男"
        }
        {
            "name":"睿总",
            "id":"201607010244",
            "sex":"男"
        }
        ...
    ]
}

 classToJob: [{
    className: "2016计算机科学与技术",
    jobName: "作业名字",
    startTime: "时间戳",
    stopTime: 30,
    studentNum: 68,
    status: 0,
    unfinishedStudents:[{
        name: "樊总",
        id: "201607010244",
        sex: "男"
      },{
        name: "睿总",
        id: "201607010244",
        sex: "男"
      }]
}]
*/
//find 返回的都是游标 方便处理
export default class ClassToJobDb {
    constructor() {
        this.db = new Datastore({
            autoload: true,
            filename: path.join(path.join(path.resolve("."), "/userData/classToJob.db"))
        });
    }
    createClassToJobJson() {
        return {
            className: null,
            jobName: null,
            startTime: null,
            time: null,
            studentNum: null,
            status: null,
            unfinishedStudents:
                [
                ]
        }
    }
    createStudentJson($id, $name, $sex) {
        return {
            id: $id,
            name: $name,
            sex: $sex
        }
    }
    insertClassToJob(classToJobJson, callBack) {
        this.db.insert(classToJobJson, callBack);
    }
    deleteClassToJob(jobName, className, callBack) {
        this.db.remove({ "jobName": jobName, "className": className }, callBack);
    }

    findByStatus(status) {
        return this.db.find({ "status": status });
    }
    findByClassName(className) {
        return this.db.find({ "className": className });
    }
    findByJobName(jobName) {
        return this.db.find({ "jobName": jobName });
    }
    findByClassNameAndJobName(className, jobName) {
        return this.db.find({ "jobName": jobName, "className": className });
    }
    findAllClassToJob() {
        return this.db.find();
    }
    updateClassAndJob(oldJobName, oldClassName, classToJobJson, callBack) {
        this.db.update({ "className": oldClassName, "jobName": oldJobName }, classToJobJson, callBack);
    }
    updateStatus(oldStatus, status, callBack) {
        this.db.update({ "status": oldStatus }, { $set: { "status": status } }, callBack);
    }
    deleteUnfinishedStudent(jobName, className, studentId, callBack) {
        this.db.update({ "jobName": jobName, "className": className }, { $pull: { unfinishedStudents: { id: studentId } } }, callBack);
    }
    deleteUnfinishedStudentById(_id, studentId, callBack) {
        this.db.update({ "_id": _id }, { $pull: { unfinishedStudents: { id: studentId } } }, callBack);
    }

    deleteAllClassToJob(callBack) {
        return this.db.remove({}, callBack);
    }

}