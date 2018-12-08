const { remote } = require("electron");

const getClassDb = () => {
    let ClassDb = remote.getGlobal("ClassDb");
    return new ClassDb();
}
const getJobDb = () => {
    let JobDb = remote.getGlobal("JobDb");
    return new JobDb();
}
const getClassToJobDb = () => {
    let ClassToJobDb = remote.getGlobal("ClassToJobDb");
    return new ClassToJobDb();
}
export {
    getClassDb, getJobDb, getClassToJobDb
}