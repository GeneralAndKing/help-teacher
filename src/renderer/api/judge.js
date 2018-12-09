
let idReg = /^\d{1,15}$/;
let sexReg = /^['男'|'女']$/;
let nameReg = /^[\u4E00-\u9FA5]{2,4}$/;
const verifyStudentUnique = (studentJsons) => {
  let hash = {};
  for (let i = 0, size = studentJsons.length; i < size; i++) {
    if (hash[studentJsons[i].id + studentJsons[i].name]) {
      return false;
    }
    return true;
  }
}
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

const verifyJob = ($jobName, $jobContent, $jobTypes) => {
  if ($jobName == undefined || $jobContent == undefined || $jobTypes == undefined || $jobName.length <= 0 || $jobContent.length <= 0 || $jobTypes <= 0) {
    return false;
  }
  return true;
}

const verifyNull = ($arg) => {
  if ($arg == undefined || $arg == '' || $arg == null) {
    return false;
  }
  return true;
}
export {
  verifyStudent, verifyStudentUnique, verifyJob,verifyNull
}