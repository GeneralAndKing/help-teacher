
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

export {
    verifyStudent
}