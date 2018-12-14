const express = require("express"),
    router = express.Router();
//from表单中间件
const mutipart = require("connect-multiparty");
const mutipartMiddeware = mutipart();
const fs = require('fs');
const path = require('path');
//设置上传文件保存的路径
router.use(mutipart({uploadDir:'./upload/temp'}));
//创建文件夹
let mkdirsSync = function(dirname, mode){
    console.log(dirname);
    if(fs.existsSync(dirname)){
        return true;
    }else{
        if(mkdirsSync(path.dirname(dirname), mode)){
            fs.mkdirSync(dirname, mode);
            return true;
        }
    }
};
mkdirsSync("./upload/temp");
mkdirsSync("./upload/finally");

//获取主页面内容
router.get('/getData', function (req, res, next) {
    let cursor = classToJobDb.findByStatus(1);
    let ip = function getClientIp(req) {
        return req.ip||
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    };
    console.log(ip(req));
    console.log(cursor);
    cursor.exec((error,docs) =>{
        res.json(docs);
    });
});

//进行作业文件上传
router.post('/upload',function(req,res,next){
    console.log(req.body);
    console.log(req.files);
    //获取文件
    let file = req.files.file;
    //文件临时路径
    let fileTempPath = file.path;
    //文件类型
    let fileType = file.type;
    //文件名称
    let fileName = file.name;
    //文件大小
    let fileSize = file.size;
    //判断文件大小z
    if(fileSize != 0){
        //返回文件
        res.json({status:'1',data:file});
    }else{
        res.json({'status':'0','error':'上传的文件为空'});
        fs.unlinkSync(fileTempPath);
    }
    //返回上传结果
    //res.send(file.type+file.name+file.path+file.size);

});
//查找状态为1且未上交的人员
router.get('/getUnfinishedStudents',function(req,res,next){
    let cursor = classToJobDb.findByStatus(1);
    console.log(cursor);
    cursor.exec((error,docs) => {
        res.json(docs[0].unfinishedStudents);
    });
});

//提交作业操作
router.post('/submitHomework',function(req,res,next){
    let cursor = classToJobDb.findByStatus(1);
    cursor.exec((error,docs) =>{
        //获取post信息
        let StudentId = req.body.StudentId;
        let fileTempPath = req.body.fileTempPath;
        //获取数据库中的信息
        let className = docs[0].className;
        let jobName = docs[0].jobName;
        let _this = this;
        if(className || jobName){
            console.log('name:'+className);
            console.log('job:'+jobName);
            //获取客户端ip地址
            let ip = function getClientIp(req) {
                return req.ip ||
                    req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;
            };
            // 通过正则匹配获取客户端的ip4地址
            let ipv4 = ip(req).match(/\d+.\d+.\d+.\d+/);
            ipv4 = ipv4 ? ipv4.join('.') : null;
            //获取未交作业的学生列表
            let students = docs[0].unfinishedStudents;
            // console.log(students);
            let i = 0;
            let index = -1;
            //查找学生信息
            for(;i < students.length;i++){
                if(students[i].id == StudentId){
                    index = i;
                    break;
                }
            }
            if(index != -1){
                //获取提交作业学生的信息
                //学生id emmm 和post获取到到的studentid相同
                let id = students[i].id;
                let name = students[i].name;
                let sex = students[i].sex;
                let arr = fileTempPath.split('.');
                let fileType = '.' + arr[arr.length-1];
                //设置文件名格式
                let fileName = StudentId + '_' + name + '_' + jobName;
                //有效数据永久目录
                let dataPath = 'upload/finally/'+ className +'/'+ jobName +'/';
                let newPath = dataPath + fileName + fileType;
                // 判断数据目录是否存在 不存在则创建目录
                if(!fs.existsSync(dataPath)){
                    //fs.mkdirSync(dataPath);
                    mkdirsSync(dataPath);
                    console.log('mkdir：'+ dataPath)
                }
                if(!StudentId || !fileTempPath){
                    res.json({'status' : 0 , 'error' : '参数不能为空'});
                }else{
                    try {
                        fs.renameSync(fileTempPath,newPath);
                        //定义回调函数
                        let callBack = function(e,docs){
                            if(e){
                                console.log(e);
                                res.json({'status':0,'error':'数据操作执行失败！'});
                            }else{
                                //数据库执行成功后进行操作进行ipDb表的数据插入
                                //封装数据
                                let data = {
                                    'address' : ipv4,
                                    'id' : id,
                                    'name' : name,
                                    'sex' : sex
                                };
                                
                                console.log(data);
                                let insertIpInfo = function(e,docs){
                                    if(e){  
                                        res.json({'status':0,'error':'数据操作执行失败！'});
                                    }else{
                                        //操作成功的执行语句
                                        console.log('向数据库添加数据');
                                        res.json({'status': 1 ,'data':'success','StudentId': StudentId});
                                    }
                                }
                                //更新新的地址 实际上是删除后重新添加
                                let reinsert = function(e,docs){
                                    if(!e){
                                        ipDb.insertIpJson(data,insertIpInfo);
                                    }
                                }
                                //向ipDb中添加数据
                                let info =  ipDb.findById(id);
                                info.exec((error,docs)=>{
                                    //判断数据库中是否有信息
                                    if(docs.length > 0){
                                        //如果存在信息则更新数据表（删除重新插入
                                        console.log('数据库中存在信息');
                                        console.log(docs);
                                        ipDb.deleteStudent(id,reinsert);
                                    }else{
                                        // 数据库中不存在信息则插入数据
                                        ipDb.insertIpJson(data,insertIpInfo);
                                    }
                                });
                            
                            }
                        }
                        //从未完成列表中删除提交作业的学生的信息
                        classToJobDb.deleteUnfinishedStudent(jobName, className, StudentId,callBack);
                    } catch (error) {
                        res.json({'status': 0 ,'error':'文件处理失败'});
                    }
                }
            }else{
                res.json({'status': 0 ,'error':'找不到该学生信息！'});
            }
        }

    });
});
//获取作业的基本信息
router.get('/getJobInformation',function(req,res,next){
    //执行查询
    let cursor = classToJobDb.findByStatus(1);
    cursor.exec((error,docs)=>{
        if(docs){
            //查询到的数据
            let className = docs[0].className;
            let jobName = docs[0].jobName;
            let startTime = docs[0].startTime;
            // let stopTime = docs[0].stopTime;
            // let studentNum = docs[0].studentNum;
            console.log(docs);
            let info = jobDb.findByJobName(jobName);
            info.exec((error,result)=>{
                if(result){
                    let jobContent = result[0].jobContent;
                    let jobTypes = result[0].jobTypes;
                    let studentNum = result[0].studentNum; 
                    let jobLimitType = [];
                    jobTypes.forEach((v,i,a)=>{
                        console.log(v);
                        jobLimitType.push('.' + v);
                    });
                    console.log(jobLimitType.join());
                    res.json({'status': 1,'data':{'jobName':jobName,'className':className,'startTime':startTime,'studentNum':studentNum,'jobContent':jobContent,'jobTypes':jobLimitType.join()}});
                }else{
                    res.json({'status': 0 ,'error':'信息查询失败'});
                }
            });
        }else{
            res.json({'status': 0 ,'error':'信息查询失败'});
        }
    });
});

module.exports = router;
