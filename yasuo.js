const fs = require('fs')
const archiver = require('archiver')
const path =require("path")
// 创建文件输出流
let output = fs.createWriteStream(__dirname + '/dist.zip')
let archive = archiver('zip', {
    zlib: { level: 9 } // 设置压缩级别
})

// 文件输出流结束
output.on('close', function () {
})

// 数据源是否耗尽
output.on('end', function () {
})

// 存档警告
archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.warn('stat故障和其他非阻塞错误')
    } else {
        throw err
    }
})

// 存档出错
archive.on('error', function (err) {
    throw err
})

// 通过管道方法将输出流存档到文件
archive.pipe(output)

// 从流中追加文件
let file1 = __dirname + '/file1.txt'
archive.directory("a/",false);

//完成归档
archive.finalize()