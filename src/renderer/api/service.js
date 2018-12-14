const axios = require('axios');
const {error, success, warning} = require("@/api/message");
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
  instance.get(host + "/api/teacher/" + localStorage.getItem("username"),)
    .then(response => {
      let data = response.data;
      if (data.data == null) {
        success($this, "无数据可同步......");
      } else {
        console.log(data);
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
  // 在这里封装本地数据，必须携带 username 和 data
  const data = {
    "username": localStorage.getItem("username"),
    "data": {
      "classDb": {
        "className": "2012316",
        "students": [
          {
            "id": "201607010244",
            "name": "睿哥",
            "sex": "男"
          },
          {
            "id": "201607010244",
            "name": "睿少",
            "sex": "男"
          }
        ]
      },
      "jobDb": [
        {
          "jobName": "第一次作业",
          "jobContent": "具体详情是做什么的",
          "jobTypes": [
            "excel",
            "ppt"
          ]
        },
        {
          "jobName": "第二次作业",
          "jobContent": "具体详情是做什么的",
          "jobTypes": [
            "execl",
            "ppt"
          ]
        }
      ],
      "classToJobDb": {
        "className": "2016计算机科学与技术",
        "jobName": "作业名字",
        "startTime": "时间戳",
        "stopTime": 30,
        "studentNum": 68,
        "status": 0,
        "unfinishedStudents": [
          {
            "name": "樊总",
            "id": "201607010244",
            "sex": "男"
          },
          {
            "name": "睿总",
            "id": "201607010244",
            "sex": "男"
          }
        ]
      }
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
};


export {
  login, download, upload
}