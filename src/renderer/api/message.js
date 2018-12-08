const error = ($this, message) => {
    $this.$notify.error({
        title: "错误",
        message: message,
        position: "bottom-right"
      });
}
const success = ($this, message) => {
    $this.$notify.success({
        title: "成功",
        message: message,
        position: "bottom-right"
      });
}
const warning = ($this, message) => {
    $this.$notify.warning({
        title: "警告",
        message: message,
        position: "bottom-right"
      });
}
export {
    error,success,warning
}