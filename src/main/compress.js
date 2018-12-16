const fs = require('fs')
const archiver = require('archiver')
const path = require("path")
//创建文件夹
let mkdirsSync = function (dirname, mode) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname), mode)) {
            fs.mkdirSync(dirname, mode);
            return true;
        }
    }
};

module.exports = function compress(className, jobName, errorCallBack, successCallBack) {
    // 创建文件输出流
    mkdirsSync(path.join(path.resolve("."), "/compressFile"))
    let output = fs.createWriteStream(path.join(path.resolve("."), "/compressFile/" + className + "_"+jobName + ".zip"))
    let archive = archiver('zip', {
        zlib: { level: 9 } // 设置压缩级别
    })

    // 文件输出流结束
    output.on('close', successCallBack);
    // 数据源是否耗尽
    output.on('end', errorCallBack);
    // 存档警告
    archive.on('warning', () => {
        console.log("warning");
    });
    // 存档出错
    archive.on('error', errorCallBack);

    // 通过管道方法将输出流存档到文件
    archive.pipe(output)

    // 从流中追加文件
    archive.directory(path.join(path.resolve("."), "upload/finally/" + className + "_" + jobName), false);

    //完成归档
    archive.finalize();
}

