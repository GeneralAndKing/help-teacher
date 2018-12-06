import Datastore from 'nedb';
import path from 'path';

/*
{
    jobName:完成本次作业,
    jobContent:具体详情是做什么的,
    jobTypes:[
        {
            type:excel,
            state:excel格式的作业
        }
        {
            type:ppt,
            state:ppt格式的作业
        }
        ...
    ]
}

*/
//find 返回的都是游标 方便处理
export default class JobDb {
    constructor() {
        this.db = new Datastore({
            autoload: true,
            filename: path.join(path.join(path.resolve("."), "/userData/job.db"))
        });
    }
    static createJobJson() {
        return {
            jobName: null,
            jobContent: null,
            jobTypes: [
            ]
        }
    }
    static createJobTypeJson($type,$state) {
        return {
            type: $type,
            state: $state
        }
    }
    insertJob(jobJson) {
        this.db.insert(jobJson, (error, doc) => {
        });
    }
    insertJobType(jobName, jobTypeJson) {
        let jobJson = this.db.find({ "jobName": jobName });
        jobJson.jobTypes.insert(jobTypeJson, (error, doc) => {
        });
    }
    updateJob(jobJson) {
        this.db.update({ 'jobName': jobJson.jobName }, jobJson, (error, doc) => {
        });
    }
    updatejobType(jobName, jobTypeJson) {
        let jobJson = this.db.find({ 'jobName': jobName });
        jobJson.update({ 'type': jobTypeJson.type }, jobTypeJson, (error, doc) => {
        });
    }
    deleteJob(jobName) {
        this.db.remove({ "jobName": jobName }, (error, doc) => {
        });
    }
    deleteJobType(jobName, type) {
        this.db.remove({ "jobName": jobName, "jobTypes.type": type }, (error, doc) => {
        });
    }
    findByJobName(jobName) {
        return this.db.find({ "jobName": jobName });
    }
    findAllJob() {
        return this.db.find();
    }
}