import Datastore from 'nedb';
import path from 'path';
/*
{
    className:2016计算机科学与技术,
    jobName:作业名字,
    startTime:时间戳,
    stopTime:30分钟(计算时间戳),
    peopleNum:68(总人数),
    status: 0(未开启) 1(收取中) 2(收取完成)
    unfinishedPeoples:
    [
        {
            name:樊总,
            id:201607010244,
            sex:男
        }
        {
            name:睿总,
            id:201607010244,
            sex:男
        }
        ...
    ]
}
*/
//find 返回的都是游标 方便处理
export default class ClassToJobDb {
    constructor() {
        this.db = new Datastore({
            autoload: true,
            filename: path.join(path.join(path.resolve("."), "/userData/classToJob.db"))
        });
    }
    static createClassToJobJson() {
        return {
            className:null,
            jobName:null,
            startTime:null,
            stopTime:null,
            peopleNum: null,
            status: null,
            unfinishedPeoples:
            [
            ]
        }
    }
    static createStudentJson($id,$name,$sex) {
        return {
            id: $id,
            name: $name,
            sex: $sex
        }
    }
    insertclassToJob(classToJobJson) {
        this.db.insert(classToJobJson, (error, doc) => {
        });
    }
    deleteclassToJob(jobName, className) {
        this.db.remove({ "jobName": jobName, "className": className }, (error, doc) => {
        });
    }

    findByStatus(status) {
        return this.db.find({ "status":status });
    }
    findByclassName(className) {
        return this.db.find({ "className":className });
    }
    findByJobName(jobName) {
        return this.db.find({ "jobName":jobName });
    }
    findByClassNameAndJobName(className, jobName) {
        return this.db.find({ "jobName": jobName, "className": className });
    }
    findAllClassToJob() {
        return this.db.find();
    }
    updateClassAndJob(classToJobJson) {
        this.db.update({"className":classToJobJson.className,"jobName":classToJobJson.jobName},classToJobJson, (error, doc) => {
        });
    }
    deleteUnfinishedPeople(jobName, className, studentId) {
        this.db.remove({ "jobName": jobName, "className": className,"unfinishedPeoples.id":studentId}, (error, doc) => {
        });
    }

}