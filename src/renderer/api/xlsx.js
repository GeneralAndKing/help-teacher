const xlsx = require("node-xlsx");
const { verifyStudent } = require("./judge");
const { remote } = require("electron");
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
            if (xlsxHeader[0].search('学号') == -1 || xlsxHeader[1].search('姓名') == -1 || xlsxHeader[2].search('性别') == -1) {
                throw 'xlsxHeader is error';
            }
        }
        catch (error) {
            return [false, null];
        }
        for (const studentData of classData.data) {
            if (verifyStudent(studentData[0], studentData[1], studentData[2])) {
                students.push(ClassDb.createStudentJson(studentData[0], studentData[1], studentData[2]));
            }
            else {
                return [false, null];
            }
        }
    }
    classJson.students = students;
    return [true, classJson];

}

export {
    readClassXlsx
}