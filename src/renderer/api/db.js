const { ipcRenderer, remote } = require("electron");

const getClassDb=()=>{
    let ClassDb=remote.getGlobal("ClassDb");
    return new ClassDb();
}
export {
    getClassDb
}