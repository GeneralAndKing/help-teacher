<template lang="pug">
  el-row#titleBar(type="flex" justify="space-between")
    el-col.gak-text-left(:span="8")
      i(class="el-icon-sold-out")
      |&nbsp;el-icon-goods
    el-col(:span="8")
      h5 {{time}}
    el-col.gak-text-right(:span="8")
      span#login(v-if="!isLogin", @click="login") 登录
      span(v-if="isLogin", @click="download") 同步
      span(v-if="isLogin", @click="upload") 备份
      el-button#min(@click="minWin" type="warning" size="mini" icon="el-icon-arrow-down" circle)
      el-button#max(@click="maxWin" type="success" size="mini" icon="el-icon-arrow-up" circle)
      el-button#close(@click="closeWin" type="danger" size="mini" icon="el-icon-close" circle)
    el-dialog(title='登录', :visible.sync='dialogFormVisible', style="")
      .gak-tip-blue 如果帐号没有注册，将会以您现在输入的帐号密码自动登录注册。
        b 您可以选择使用我们的远程服务器或者填写您自己的服务器配置，端口不填默认8082。
      el-form(:model='form', ref="form", :rules='rules')
        el-form-item(label='服务器配置', prop='url')
          el-col(:span="15", style="margin:0")
            el-input#url(v-model='form.url', autocomplete='off', clearable, placeholder="请输入 ip 地址")
          el-col(:span="2", style="margin:0") :
          el-col(:span="7", style="margin:0")
            el-input#port(v-model='form.port', autocomplete='off', clearable, placeholder="端口号")
        el-form-item(label='用户名',  prop='username')
          el-input(v-model='form.username', autocomplete='off', clearable, placeholder="用户名")
        el-form-item(label='密码',  prop='input')
          el-input(type="password", v-model='form.input', autocomplete='off', clearable, placeholder="密码")
      .dialog-footer(slot='footer')
        el-button(@click='dialogFormVisible = false') 取 消
        el-button(type='primary', @click='loginSubmit') 确 定

</template>


<script>
const { ipcRenderer, remote } = require("electron");
const { getClassToJobDb } = require("@/api/db");
const service = require("@/api/service");
const Base64 = require("js-base64").Base64;
export default {
  data() {
    let validatePassword = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("密码不能为空！"));
      } else if (value.length < 6) {
        callback(new Error("密码长度最小为六位数！"));
      } else {
        callback();
      }
    };
    let validateUsername = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("用户名不能为空！"));
      } else {
        callback();
      }
    };
    let validateUrl = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("服务器配置不能为空！"));
      } else {
        callback();
      }
    };
    return {
      time: "",
      form: {
        url: "118.24.1.170",
        port: "8082",
        username: "",
        password: "",
        input: ""
      },
      isLogin: false,
      dialogFormVisible: false,
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        input: [{ validator: validatePassword, trigger: "blur" }],
        url: [{ validator: validateUrl, trigger: "blur" }]
      }
    };
  },
  mounted: function() {
    let _this = this;
    let classToJobDb = getClassToJobDb();
    let webServer = remote.getGlobal("webServer");
    ipcRenderer.on("closeWebServer", (event, arg) => {
      webServer.stop();
      classToJobDb.updateStatus(1, 2, (e, docs) => {});
      _this.$dialog.alert("服务结束,正在打包文件");
      //跳转主页
    });
    ipcRenderer.on("compress", message => {
      if (message) {
        _this.$notify({
          title: "打包通知",
          message: "打包文件成功",
          position: "top-left",
          type: "success"
        });
      } else {
        _this.$notify.error({
          title: "打包通知",
          message: "打包文件错误,可到upload下查看",
          position: "top-left"
        });
      }
    });
    classToJobDb.findByStatus(1).exec((e, classToJobJsons) => {
      if (classToJobJsons.length > 0) {
        classToJobDb.updateStatus(1, 0, (e, docs) => {});
        _this.$notify.error({
          title: "服务异常",
          message: "上次程序运行服务未关闭,已异常暂停",
          position: "top-left"
        });
      }
    });
    setInterval(() => {
      _this.time = new Date().toLocaleString();
    }, 1000);
  },
  methods: {
    closeWin: function() {
      ipcRenderer.send("close");
    },
    minWin: function() {
      ipcRenderer.send("hide-window");
    },
    maxWin: function() {
      ipcRenderer.send("max-window");
    },
    login: function() {
      this.dialogFormVisible = true;
    },
    loginSubmit: function() {
      let _this = this;
      _this.$refs.form.validate(valid => {
        if (valid) {
          if (_this.form.port.trim() === "") {
            _this.form.port = "8082";
          }
          localStorage.setItem(
            "host",
            "http://" + _this.form.url + ":" + _this.form.port
          );
          _this.form.password =
            "gak" +
            Base64.encode(
              "gak" +
                Base64.encode("gak" + Base64.encode(_this.form.input) + "gak") +
                "gak"
            ) +
            "gak";
          service.login(_this, JSON.stringify(_this.form), _this.form.username);
        } else {
          return false;
        }
      });
    },
    download: function() {
      this.$dialog
        .confirm(
          {
            title: "提示",
            body: "同步数据将会完全覆盖本地的所有数据，确定同步吗?"
          },
          {
            loader: true,
            okText: "确认",
            cancelText: "取消"
          }
        )
        .then(dialog => {
          service.download(this);
          dialog.close();
        })
        .catch(() => {});
    },
    upload: function() {
      this.$dialog
        .confirm(
          {
            title: "提示",
            body: "备份数据将会完全覆盖远程服务器上的所有数据，确定备份吗?"
          },
          {
            okText: "确认",
            cancelText: "取消"
          }
        )
        .then(dialog => {
          service.upload(this);
          dialog.close();
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="stylus">
@import '../styles/components/TitleBar.styl';
</style>

