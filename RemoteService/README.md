# Remote Service
help teacher 的远程服务
## 简介
基于 java 的 help teacher 远程服务，提供接口进行数据同步与备份。原打算使用 groovy + gradle，但是由于 groovy 
不熟悉而时间紧迫，所以不得已改为自己熟悉的 java 直接上手开发。使用 jwt 进行认证通信，mongodb 作为数据库进行处理。
后续可能会修改为 groovy 版本。

## 技术选型
- 数据库: mongodb
- 核心框架: vert.x
- 构建工具: gradle
- web 框架: vert.x-web
- 权限认证: jwt
- 单元测试: junit5、vert.x-unit
- 集群管理: vert.x-hazelcast
- 代码生成: vert.x-code-gen
- 数据库管理: vert.x-mongodb
- 开源协议: GNU General Public License v3.0

## 使用说明
项目目录已经打包至 releases 文件夹下，包含以下三个文件
- gak-help-teacher-version.jar
- gak-help-teacher-hazelcast-db-version.jar
- gak-help-teacher-hazelcast-web-version.jar

### 单个部署
gak-help-teacher-version.jar 为总的文件，继承 web 和 db，使用如下命令运行
```bash
java -jar gak-help-teacher-version.jar
```
默认配置如下
- http 端口：8082
- mongodb 端口：27017
- 默认数据库：gak
- 默认无用户密码登录

> 未开启自定义端口和用户，所以不可修改

### 集群部署
gak-help-teacher-hazelcast-db-version.jar 为数据库服务，提供数据库操作，gak-help-teacher-hazelcast-web-version.jar 为 web 服务，提供web操作。
运行命令如下：
```shell
java -jar gak-help-teacher-hazelcast-db-version.jar
java -jar gak-help-teacher-hazelcast-version.jar
```

由于为事件驱动设计，所以 web 端只能运行一个，db 可以运行多个，当 web 接受到请求后，将会自动发送到空闲的 db，处理后返回 web。
启动后，会自动识别后面加入进来的节点,输出如下：
```log
// 三个成员，一个web，两个db
Members {size:3, ver:3} [
        Member [10.102.42.131]:5701 - 4c62e373-e1cd-45d6-8ce0-857f9d046d05
        Member [10.102.42.131]:5702 - fdb71673-7815-45c7-988f-646f985ae9b5
        Member [10.102.42.131]:5703 - ea61e5e4-5a02-4f0f-8975-3ca4abba05e9 this
]
```

## 接口设计
此处定义对外开放的接口，定义了请求的参数，以及响应的参数，均为 json 格式，api 设计参照 [Restful](http://www.ruanyifeng.com/blog/2018/10/restful-api-best-practices.html)
规范设计。

### 统一异常回复请求
当所有的接口发生某些统一的异常的时候，我们对异常进行了捕获并进行了统一封装和处理，全部如下：

- 请求失败响应：bad request 不合法/错误的请求
```json

{
  "code": 400,
  "msg": "详细信息",
  "data": "详细信息"
}
```
- 请求失败响应：internal Error 服务器内部错误
```json

{
  "code": 500,
  "msg": "详细信息",
  "data": "详细信息"
}
```
- 请求失败响应：Un Authorization 未授权错误
```json

{
  "code": 403,
  "msg": "详细信息",
  "data": "详细信息"
}
```
### 登录注册
- 接口描述：此接口提供登录注册功能，当帐号未注册时，将会以传递过来的用户名和密码直接注册并登录。
- 请求路径：/login
- 请求方法：POST
- 请求参数：
```json
{
  "username": "用户名",
  "password": "密码"
}
```
- 登录成功响应：
```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "token": "jwt token"
  }
}
```
- 登录成功响应：
```json
{
  "code": 201,
  "msg": "注册成功！",
  "data": {
    "token": "jwt token"
  }
}
```
- 密码错误响应：
```json
{
  "code": 401,
  "msg": "密码错误！",
  "data": null
}
```

### 备份接口
- 接口描述：此接口用于备份本地传输过来的数据，直接覆盖数据库中的数据。
- 请求路径：/api/teacher
- 请求方法：POST
- 请求头部：
```json
{
  "Authorization": "Bearer 你的 token 认证信息"
}
```
- 请求参数：
```json
{
  "username": "用户名",
  "data": {
    "详细数据": "必须为 json 对象"
  }
}
```
- 备份成功响应：
```json
{
  "code": 200,
  "msg": "请求成功",
  "data": null
}
```
- 期望的请求数据：
```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
      "id": "mongodb 自带",
      "username": "用户名",
      "data": {
          "classDb": [
              {
                "className": "班级名称",
                "students": [
                    {
                        "id": "学号",
                        "name": "学生名称",
                        "sex": "性别"
                    },
                    {
                        "id": "学号",
                        "name": "学生名称",
                        "sex": "性别"
                    }
                ]
              },
              {
                "className": "班级名称",
                "students": [
                    {
                        "id": "学号",
                        "name": "学生名称",
                        "sex": "性别"
                    },
                    {
                        "id": "学号",
                        "name": "学生名称",
                        "sex": "性别"
                    }
                ]
              }
          ],
          "jobDb": [
              {
                  "jobName": "作业名称",
                  "jobContent": "作业详情",
                  "jobTypes": [
                      "excel",
                      "ppt"
                  ]
              },
              {
                  "jobName": "作业名称",
                  "jobContent": "作业详情",
                  "jobTypes": [
                      "execl",
                      "ppt"
                  ]
              }
          ],
          "classToJobDb": [
              {
                  "className": "班级名称",
                  "jobName": "作业名称",
                  "startTime": "时间戳",
                  "stopTime": 30,
                  "studentNum": 68,
                  "status": 0,
                  "unfinishedStudents": [
                      {
                          "id": "学号",
                          "name": "姓名",
                          "sex": "性别"
                      },
                      {
                          "id": "学号",
                          "name": "姓名",
                          "sex": "性别"
                      }
                  ]
              },
              {
                  "className": "班级名称",
                  "jobName": "作业名称",
                  "startTime": "时间戳",
                  "stopTime": 30,
                  "studentNum": 68,
                  "status": 0,
                  "unfinishedStudents": [
                      {
                          "id": "学号",
                          "name": "姓名",
                          "sex": "性别"
                      },
                      {
                          "id": "学号",
                          "name": "姓名",
                          "sex": "性别"
                      }
                  ]
              }          
          ]
      }
  }
}
```
### 同步接口
- 接口描述：此接口用于从服务器数据库中取出数据，直接同步本地数据。
- 请求路径：/api/teacher/:username
- 请求方法：GET
```json
{
  "Authorization": "Bearer 你的 token 认证信息"
}
```
- 请求参数：无
- 同步成功响应：
```json
{
  "code": 200,
  "msg": "请求成功",
  "data": "服务器上的详细数据"
}
```
- 预期的成功响应：
```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
      "id": "mongodb 自带",
      "username": "用户名",
      "data": {
          "classDb": [
              {
                "className": "班级名称",
                "students": [
                    {
                        "id": "学号",
                        "name": "学生名称",
                        "sex": "性别"
                    },
                    {
                        "id": "学号",
                        "name": "学生名称",
                        "sex": "性别"
                    }
                ]
              },
              {
                "className": "班级名称",
                "students": [
                    {
                        "id": "学号",
                        "name": "学生名称",
                        "sex": "性别"
                    },
                    {
                        "id": "学号",
                        "name": "学生名称",
                        "sex": "性别"
                    }
                ]
              }
          ],
          "jobDb": [
              {
                  "jobName": "作业名称",
                  "jobContent": "作业详情",
                  "jobTypes": [
                      "excel",
                      "ppt"
                  ]
              },
              {
                  "jobName": "作业名称",
                  "jobContent": "作业详情",
                  "jobTypes": [
                      "execl",
                      "ppt"
                  ]
              }
          ],
          "classToJobDb": [
              {
                  "className": "班级名称",
                  "jobName": "作业名称",
                  "startTime": "时间戳",
                  "stopTime": 30,
                  "studentNum": 68,
                  "status": 0,
                  "unfinishedStudents": [
                      {
                          "id": "学号",
                          "name": "姓名",
                          "sex": "性别"
                      },
                      {
                          "id": "学号",
                          "name": "姓名",
                          "sex": "性别"
                      }
                  ]
              },
              {
                  "className": "班级名称",
                  "jobName": "作业名称",
                  "startTime": "时间戳",
                  "stopTime": 30,
                  "studentNum": 68,
                  "status": 0,
                  "unfinishedStudents": [
                      {
                          "id": "学号",
                          "name": "姓名",
                          "sex": "性别"
                      },
                      {
                          "id": "学号",
                          "name": "姓名",
                          "sex": "性别"
                      }
                  ]
              }          
          ]
      }
  }
}
```