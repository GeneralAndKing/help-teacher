package cn.echocow.gak.teacher.entity;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * TeacherData
 *
 * @author echo
 * @version 1.0
 * @date 18-12-12 上午11:48
 */
@SuppressWarnings("all")
@DataObject(generateConverter = true)
public class TeacherData {
    private String username;
    private String classDate;
    private String jobDate;
    private String classToJob;
    private LocalDateTime updateTime;

    public TeacherData(TeacherData other){
        this.username = other.username;
        this.classDate = other.classDate;
        this.jobDate = other.jobDate;
        this.classToJob = other.classToJob;
        this.username = other.username;
        this.updateTime = other.updateTime;
    }

    public TeacherData() {
    }

    public TeacherData(String username, String classDate, String jobDate, String classToJob, LocalDateTime updateTime) {
        this.username = username;
        this.classDate = classDate;
        this.jobDate = jobDate;
        this.classToJob = classToJob;
        this.updateTime = updateTime;
    }

    public TeacherData(JsonObject obj) {
        TeacherDataConverter.fromJson(obj, this);
    }

    public TeacherData(String jsonStr) {
        TeacherDataConverter.fromJson(new JsonObject(jsonStr), this);
    }


    public JsonObject toJson() {
        JsonObject json = new JsonObject();
        TeacherDataConverter.toJson(this, json);
        return json;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getClassDate() {
        return classDate;
    }

    public void setClassDate(String classDate) {
        this.classDate = classDate;
    }

    public String getJobDate() {
        return jobDate;
    }

    public void setJobDate(String jobDate) {
        this.jobDate = jobDate;
    }

    public String getClassToJob() {
        return classToJob;
    }

    public void setClassToJob(String classToJob) {
        this.classToJob = classToJob;
    }

    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TeacherData that = (TeacherData) o;
        return Objects.equals(username, that.username) &&
                Objects.equals(classDate, that.classDate) &&
                Objects.equals(jobDate, that.jobDate) &&
                Objects.equals(classToJob, that.classToJob) &&
                Objects.equals(updateTime, that.updateTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username, classDate, jobDate, classToJob, updateTime);
    }

    @Override
    public String toString() {
        return "TeacherData{" +
                "username='" + username + '\'' +
                ", classDate='" + classDate + '\'' +
                ", jobDate='" + jobDate + '\'' +
                ", classToJob='" + classToJob + '\'' +
                ", updateTime=" + updateTime +
                '}';
    }
}
