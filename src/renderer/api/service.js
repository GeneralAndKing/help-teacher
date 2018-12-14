const axios = require('axios');
const { error, success, warning } = require("@/api/message");
const { getClassToJobDb, getClassDb, getJobDb } = require("@/api/db");
const instance = axios.create();
instance.defaults.timeout = 6000; //6000的超时验证
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
let _error = error;
const login = ($this, user, username) => {
  let host = localStorage.getItem("host");
  instance.post(host + "/login", user)
    .then(response => {
      if (response.status === 200) {
        success($this, "登录成功!");
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("username", username);
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        $this.dialogFormVisible = false;
        $this.isLogin = true;
      } else if (response.status === 201) {
        success($this, "注册并登录成功!");
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("username", username);
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        $this.dialogFormVisible = false;
        $this.isLogin = true;
      } else {
        _error($this, "未知原因，登录失败!");
      }
    })
    .catch(error => {
      let response = error.response;
      if (response.status === 401) {
        _error($this, "登录失败，密码错误！");
      } else if (response.status === 400) {
        _error($this, "登录失败，请求参数不合法！");
      } else {
        _error($this, "登录失败，服务器内部错误！");
      }
    })
};

const download = ($this) => {
  let host = localStorage.getItem("host");
  instance.get(host + "/api/teacher/" + localStorage.getItem("username"))
    .then(response => {
      let data = response.data;
      if (data.data == null) {
        success($this, "无数据可同步......");
      } else {
        let classDb = getClassDb();
        let jobDb = getJobDb();
        let classToJobDb = getClassToJobDb();
        let classCallBack = function (e, docs) {
          if (e) {
            warning($this, "class同步失败");
          }
          else {
            classDb.insertClass(data.data.data.classDb);
          }
        }
        classDb.deleteAllClass(classCallBack);
        let jobCallBack = function (e, docs) {
          if (e) {
            warning($this, "job同步失败");
          }
          else {
            jobDb.insertJob(data.data.data.jobDb);
          }
        }
        jobDb.deleteAllJob(jobCallBack);
        let classToJobCallBack = function (e, docs) {
          if (e) {
            warning($this, "classToJob同步失败");
          }
          else {
            classToJobDb.insertClassToJob(data.data.data.classToJobDb);
          }
        }
        classToJobDb.deleteAllClassToJob(classToJobCallBack);

        // data.data 是具体获取到的数据，在这里进行同步到本地数据库
        success($this, "数据已同步......");
      }
    })
    .catch(error => {
      let response = error.response;
      if (response.status === 400) {
        _error($this, "同步失败，请求参数不合法！");
      } else {
        _error($this, "同步失败，服务器内部错误！");
      }
    })
};

const upload = ($this) => {
  let host = localStorage.getItem("host");
  let classDb = getClassDb();
  // 在这里封装本地数据，必须携带 username 和 data
  classDb.findAllClass().exec((e, classJsons) => {
    let jobDb = getJobDb();
    jobDb.findAllJob().exec((e, jobJsons) => {
      let classToJobDb = getClassToJobDb();
      classToJobDb.findAllClassToJob().exec((e, classToJobJsons) => {
        if (classJsons.length == 0 && jobJsons.length == 0 && classToJobJsons.length == 0) {
          error($this, "无数据可备份");
          return;
        }
        const data = {
          "username": localStorage.getItem("username"),
          "data": {
            "classDb": classJsons,
            "jobDb": jobJsons,
            "classToJobDb": classToJobJsons
          }
        };
        instance.post(host + "/api/teacher", JSON.stringify(data))
          .then(response => {
            let data = response.data;
            console.log(data);
            success($this, "数据已备份至服务器......");
          })
          .catch(error => {
            let response = error.response;
            if (response.status === 400) {
              _error($this, "备份失败，请求参数不合法！");
            } else {
              _error($this, "备份失败，服务器内部错误！");
            }
          })
      })

    });
  });
};


export {
  login, download, upload
}