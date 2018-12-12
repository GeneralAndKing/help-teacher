const fs = require('fs')
const archiver = require('archiver')
const path = require("path")

module.exports = function compress(className, jobName, errorCallBack, successCallBack, warningCallBack) {
    // 创建文件输出流
    console.log(__dirname);
    let output = fs.createWriteStream(path.join(path.resolve("."), "/dist.zip"))
    let archive = archiver('zip', {
        zlib: { level: 9 } // 设置压缩级别
    })

    // 文件输出流结束
    output.on('close', successCallBack)
    // 数据源是否耗尽
    output.on('end', () => {
        console.log("123321");
    })
    // 存档警告
    archive.on('warning', warningCallBack)
    // 存档出错
    archive.on('error', () => {
        console.log("123321");
    })

    // 通过管道方法将输出流存档到文件
    archive.pipe(output)

    // 从流中追加文件
    archive.directory(path.join(path.resolve("."), "archiver/"), false);

    //完成归档
    archive.finalize();
}

