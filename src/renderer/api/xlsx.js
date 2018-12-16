const xlsx = require("node-xlsx");
const { verifyStudent } = require("./judge");
const { remote } = require("electron");
const fs = require('fs');
const { error, success, warning } = require("./message");
const path = require("path");
let classDb = remote.getGlobal('classDb');

/*
    参数:filepath
    返回值:[flag,classJson]
*/
const readClassXlsx = (filePath) => {
    let xlsxData = xlsx.parse(filePath);
    let classJson = classDb.createClassJson();
    let students = [];
    for (const classData of xlsxData) {
        try {
            let xlsxHeader = classData.data.shift();
            if (xlsxHeader[0].search('学号') === -1 || xlsxHeader[1].search('姓名') === -1 || xlsxHeader[2].search('性别') === -1) {
                throw 'xlsxHeader is error';
            }
        }
        catch (error) {
            return [false, null];
        }
        for (const studentData of classData.data) {
            if (verifyStudent(studentData[0], studentData[1], studentData[2])) {
                students.push(classDb.createStudentJson(studentData[0] + "", studentData[1], studentData[2]));
            }
            else {
                return [false, null];
            }
        }
    }
    classJson.students = students;
    return [true, classJson];
};

const writeCallXlsx = (students, classname, callBack) => {
    let datas = [
        getStudentInfo(students.arriveStudents, "已到"),
        getStudentInfo(students.leaveStudents, "请假"),
        getStudentInfo(students.lateStudents, "迟到"),
        getStudentInfo(students.noStudents, "未到")
    ];
    let buff = xlsx.build([
        {
            name: "已到",
            data: datas[0]
        },
        {
            name: "请假",
            data: datas[1]
        },
        {
            name: "迟到",
            data: datas[2]
        },
        {
            name: "未到",
            data: datas[3]
        }
    ]);
    mkdirsSync("./callFile");
    fs.writeFile("callFile/" + new Date().toLocaleString().replace(/\//g, "-").replace(/\s+/g, "").replace(/:/g, " ") + "_" + classname + "_点名信息.xlsx", buff, callBack);
};

const getStudentInfo = (students, status) => {
    let datas = [];
    for (let value of students) {
        let data = [];
        data.push(value.id);
        data.push(value.name);
        data.push(value.sex);
        data.push(status);
        datas.push(data);
    }
    return datas;
};
const mkdirsSync = function (dirname, mode) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname), mode)) {
            fs.mkdirSync(dirname, mode);
            return true;
        }
    }
};
export {
    readClassXlsx, writeCallXlsx
}