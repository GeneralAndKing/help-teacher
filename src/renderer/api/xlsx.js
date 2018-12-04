import xlsx from "node-xlsx"
const { remote } = require("electron");
let ClassDb = remote.getGlobal('ClassDb');
let idReg = /^\d{1,15}$/;
let sexReg = /^['男'|'女']$/;
let nameReg = /^[\u4E00-\u9FA5]{2,4}$/;
const verifyStudent = ($id, $name, $sex) => {
    try {
        if (!idReg.test($id) || !nameReg.test($name) || !sexReg.test($sex)) {
            throw 'studentData is error'
        }
    }
    catch (error) {
        return false;
    }
    return true;
}

/*
    参数:filepath
    返回值:[flag,classJson]
*/
const readClassXlsx = (filePath) => {
    let xlsxData = xlsx.parse(filePath);
    let classJson = ClassDb.createClassJson();
    let students = [];
    for (const classData of xlsxData) {
        try {
            let xlsxHeader = classData.data.shift();
            if (xlsxHeader[0].search('学号') == -1 || xlsxHeader[1].search('姓名') == -1 || xlsxHeader[2].search('性别') == -1) {
                throw 'xlsxHeader is error';
            }
        }
        catch (error) {
            console.log(error);
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