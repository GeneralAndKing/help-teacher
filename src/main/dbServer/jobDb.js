import Datastore from 'nedb';
import path from 'path';

/*
jobs: [
    {
      jobName: "第一次作业",
      jobContent: "具体详情是做什么的",
      jobTypes: ["excel","ppt"]
    },
    {
      jobName: "第二次作业",
      jobContent: "具体详情是做什么的",
      jobTypes: ["execl","ppt"]
    }
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
    this.db.ensureIndex({ fieldName: 'jobName', unique: true, sparse: true });
    this.db.loadDatabase();
  }

  createJobJson() {
    return {
      jobName: null,
      jobContent: null,
      jobTypes: []
    }
  }

  createJobTypeJson($type, $state) {
    return {
      type: $type,
      state: $state
    }
  }

  insertJob(jobJson, callBack) {
    this.db.insert(jobJson, callBack)
  }

  insertJobType(jobName, jobType, callBack) {
    this.db.update({ 'jobName': jobName }, { $push: { jobTypes: jobType } }, callBack);
  }

  updateJob(oldJobName, jobJson, callBack) {
    this.db.update({ 'jobName': oldJobName }, jobJson, callBack);
  }


  deleteJob(jobName, callBack) {
    this.db.remove({ "jobName": jobName }, callBack);
  }


  findByJobName(jobName) {
    return this.db.find({ "jobName": jobName });
  }

  findAllJob() {
    return this.db.find();
  }
}