const error = ($this, message) => {
    $this.$message.error(message);
}
const success = ($this, message) => {
    $this.$message({
        message: message,
        type: 'success'
      });
}
const warning = ($this, message) => {
    $this.$message({
        message: message,
        type: 'warning'
      });
}
export {
    error,success,warning
}