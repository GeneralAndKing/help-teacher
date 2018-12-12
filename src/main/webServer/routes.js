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

//文件上传
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

//获取get数据
router.post('/submitHomework',function(req,res,next){
    let cursor = classToJobDb.findByStatus(1);
    cursor.exec((error,docs) =>{
        let className = docs[0].className;
        let jobName = docs[0].jobName;
        let _this = this;
        if(className || jobName){
            console.log('name:'+className);
            console.log('job:'+jobName);
            //获取客户端ip地址
            let ip = function getClientIp(req) {
                return req.ip|
                    req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;
            };
            let StudentId = req.body.StudentId;
            let fileTempPath = req.body.fileTempPath;
            let arr = fileTempPath.split('.');
            let fileType = '.' + arr[arr.length-1];
            //设置文件名格式
            let fileName = StudentId + '_' + jobName;
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
                            let cursor = classToJobDb.findByStatus(1);
                            cursor.exec((error,docs) => {
                                if(docs){
                                    let students = docs[0].unfinishedStudents;
                                    let i = 0;
                                    //查找学生信息
                                    for(;i < students.length;i++){
                                        if(students.id == StudentId){
                                            break;
                                        }
                                    }
                                    let id = students[i].id;
                                    let name = students[i].name;
                                    let sex = students[i].sex;
                                    let data = {
                                        'address' : ip,
                                        'id' : id,
                                        'name' : name,
                                        'sex' : sex
                                    };
                                    let callBack = function(e,docs){
                                        if(e){
                                            error(_this,'数据写入失败');
                                        }else{
                                            //操作成功的执行语句
                                            //暂无
                                        }
                                    }
                                    ipDb.insertIpJson(data,);
                                }
                            });
                            res.json({'status': 1 ,'data':'success','StudentId': StudentId});
                        }
                    }
                    classToJobDb.deleteUnfinishedStudent(jobName, className, StudentId,callBack);
                } catch (error) {
                    res.json({'status': 0 ,'error':'文件处理失败'});
                }
            }
        }
    });
});
module.exports = router;
