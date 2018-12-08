const { remote } = require("electron");

const getClassDb = () => {
    return remote.getGlobal("classDb");
}
const getJobDb = () => {
    return remote.getGlobal("jobDb");
}
const getClassToJobDb = () => {
    return remote.getGlobal("classToJobDb");
}
export {
    getClassDb, getJobDb, getClassToJobDb
}