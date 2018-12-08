# help-teacher

> vue element-ui electron express

本文档为 Help-Teacher 开发文档，用于定义开发内容，制定开发规范等。于 2018 年 12 月 2 日编写。

## 整体概述
本项目旨在用最快的方式，帮助老师完成所需的工作量，同时为广大师生提供更快捷与方便的工具使用。

### 选题背景
在校园中，不论什么课程，作业都是必不可少的，因为他是一种有效的监督学生学习的方式，不仅起到督促的作用，更多的是温习或预习需要我们掌握的知识。老师不仅可以及时的通过作业了解学生的学习情况，也可以通过作业提高学生对知识点的了解程度。然而，这件事情却带来了以下的问题

1. 作业管理：每次的作业交付都需要进行统计，当人数过多时，就是十分繁琐的工作
2. 作业交付：现在作业的交付多种多样，但是都需要一位一位同学的进行作业交付，即使使用了互联网，作业速度上传以及安全性也是让人堪忧
3. 学生以及班级的复杂性：由于一个老师教的班级过多，每次管理都是一个让人头疼的过程。

除了作业以外，我们也是想到啦很多当前老师急需要解决的一些问题，例如：
1. 点名问题：每次都需要找名单等复杂的操作流程。
2. 资料传输问题：在没有机房的场合，都需要传到Ｑ群或者使用Ｕ盘进行拷贝，十分麻烦

......

所以，我们小组从现有的问题出发选择了为老师制作一个工具集，我们将它称为　help-teacher。以作业管理为主，同时开发其他能够帮助老师的工具。

### 功能介绍
我们将从 **作业管理** 和 **其他工具** 两方面进行简述

#### 作业管理 教师端 —— 本地

- 班级学生管理

老师可以有效的建立、管理自己的班级，简单的只需要导入 excel 表格即可，同时可以管理班级上的所有学生，一次导入后无需重复导入

- 作业管理

可以对作业创建,管理好已经创建的作业，创建后可以设置截止时间等参数，同时可以选择是否开启作业。可以对现在或曾经创建的作业进行查看交付情况，进行数据统计，考虑加入数据分析。


- 作业收取

老师可以开启一次已经创建的作业任务，开启后，学生只要连接校园网，访问指定地址即可完成作业交付，同时可以实时看到每个学生的传输进度,因为为一个局域网，所以传输速度极快且安全系数高。




#### 作业管理 学生端 —— 本地
- 连接教师端


#### 其他工具
- 随机点名

提供随机点名功能，对当前已有的班级进行随机点名。

- 资料传输（待定）

可以实时的传输资料到已经连接的学生端。

### 技术选型
- 依赖管理：npm / yarn
- 构建工具：webpack 4
- 运行环境：nodejs
- 核心框架：electron
- 打包工具：electron-packager
- 前端界面：vue
- 模板引擎：pug
- CSS框架：element-ui
- 核心编译器：babel
- CSS预处理：less/sass/stylus 均支持
- HTTP客户端：axios
- 应用开发框架：experss
- 版本控制工具：git


### 软件特点
1. 跨平台，所有的操作系统和均可运行。
2. 技术先进，使用 electron + vue + express 进行构建，为当前前端的优秀技术与框架。
3. 无需部署任何数据库也可以数据持久化。
4. 随时携带，几百M的大小可以让他随时携带，无需安装即可使用。
5. 安全快捷，局域网传输速度快捷，并且相对于外网传输安全许多。
6. 数据简便，可以支持excel快速导入，极其方便。
7. 实时监控，能够实时监控作业收取情况

### 系统运行要求
本软件为跨平台式，支持linux、mac、以及window32位和64位系统等拥有图形界面的系统。

## 软件开发规范
此处定义了整个过程的开发规范，开发者共同遵守

### 数据库设计
使用非关系型数据库 nedb，此数据库小巧可以随声携带
#### 表设计如下
- 班级表Class
```json
{
    "className":"2016级计算机科学与技术2班",
    "classSubject":"操作系统" ,
    "students":[
        {
	        "id":"201607010244",
    	    "name":"睿哥",
        	"sex":"男"
        },
        {
	        "id":"201607010244",
    	    "name":"睿少",
	        "sex":"男"
        }
        // ....
    ]
}
```

- 作业表Job
```json
{
    "jobName":"完成本次作业",
    "jobContent":"具体详情是做什么的",
    "jobTypes":[
        {
            "type":"excel",
            "state":"excel格式的作业"
        },
        {
            "type":"ppt",
            "state":"ppt格式的作业"
        }
        // ...
    ]
}
```
- 班级作业表ClassToJob
```json
{
    "className":"2016计算机科学与技术",
    "jobName":"作业名字",
    "startTime":"时间戳",
    "stopTime":"30分钟(计算时间戳)",
    "peopleNum":"68(总人数)",
    "unfinishedPeoples":
    [
        {
        	"id":"201607010244",
            "name":"樊总",
            "sex":"男"
        },
        {
            "id":"201607010244",
            "name":"睿总",
            "sex":"男"
        }
        // ...
    ]
}
```


### 需求分析
#### 模块一：作业管理
- 功能1：班级学生管理

此处可以管理当前教师的所有班级信息，教师可以对班级进行创建，填写的数据如下如下：
```
班级名称：className
所属学年：classYear
教学科目：classSubject
```
创建完成后，显示与页面之中，可以分别对每个班级进行 **编辑、删除**操作。显示每个班级的数据均包括创建时填写三个数据。**可以查找，根据班级名称或所属学年或教学科目进行筛选。**

编辑分为两种

第一种，进入当前班级的学生信息编辑，此时，可以对**创建时的所有数据**进行修改。同时可以对学生信息进行**导入**，可以**多次**导入，每次导入均会覆盖上一次已经导入的信息同时删除上一次的所有数据。需要给予确定导入提示，导入使用 excel 进行导入。

第二种，进入当前班级的作业统计，显示当前班级已经交付过的作业信息，可删除，但是不可编辑和增加。点击每个作业信息可以进入到作业详情，查看已交人员和未交人员。

删除时，需要提醒此操作不可逆，等待确认才能删除。

点击进入某个班级，然后页面跳转显示当前点击班级的所有学生，可以增加单个学生，也对单个学生进行编辑删除操作，需要填写的数据如下：
```
学号：id
学生姓名：name
性别：sex
```

显示当前班级所有学生的时候，**可以查找，根据学号、姓名、性别进行筛选。**

- 功能2：作业管理

页面显示所有已有的作业数据，可以创建新的作业，需要填写如下参数
```
作业名称：jobName
作业详情：jobContent
收取作业类型：jobTypes
```
可对已经有的作业进行编辑、删除。编辑可以编辑如上数据，删除需要给出提示。**可以查找，根据名称或收取作业类型进行筛选。**

点击当前作业跳转至与当前作业关联的所有班级页面，仅可查看和删除，点击班级名称，跳转到此次作业此班级的作业详情页面，显示数据如下：
```
已交作业学生：多个学生信息
未交作业学生：多个学生信息
```
**可以查找，更具学号、姓名、性别、是否已交进行筛选。**

- 功能3：作业收取

核心功能，可以在此页面直接创建作业，可以对已有的作业进行开启作业收发，需要填写如下参数：
```
作业名称：选择已经创建的作业
班级名称：选择已经创建的班级
开始时间：选择开始的时间
结束时间：选择多少分钟后结束，默认30分钟
```
填写完毕后，点击开启服务按钮，即可开启作业收发，同时此页面自动跳转到监控页面。

监控页面主要用来监控学生实时上传进度，显示每个学生的上传进度信息，显示主要数据如下：
```
哪些学生已经上传
哪些学生正在上传
哪些学生没有上传
已交学生数
未交学生数（正在上传视为未交）
```
同时可以手动停止此次作业收取


之后只要进入作业收发页面，如果还在此次作业收发的时间返回内，即服务还在开启状态，都会自动跳转至监控页面，监控实时作业实时进度。

流程图如下：

![img](https://resources.echocow.cn/image/gak/one/job/1.1.png)

#### 模块二：随机点名
直接选择已经创建的班级进行点名即可


#### 模块三：文件传输（待定）


#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
