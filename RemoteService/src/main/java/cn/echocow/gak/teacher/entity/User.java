package cn.echocow.gak.teacher.entity;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.core.json.JsonObject;

import java.time.LocalDate;
import java.util.Objects;

/**
 * User
 *
 * @author echo
 * @version 1.0
 * @date 18-12-12 上午11:23
 */
@SuppressWarnings("all")
@DataObject(generateConverter = true)
public class User {
    private String username;
    private String password;
    private LocalDate createDate;

    public User() {
    }

    public User(User other) {
        this.username = other.username;
        this.password = other.password;
        this.createDate = other.createDate;
    }


    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }


    public User(String username, String password, LocalDate createDate) {
        this.username = username;
        this.password = password;
        this.createDate = createDate;
    }

    public User(JsonObject obj) {
        UserConverter.fromJson(obj, this);
    }

    public User(String jsonStr) {
        UserConverter.fromJson(new JsonObject(jsonStr), this);
    }

    public JsonObject toJson() {
        JsonObject json = new JsonObject();
        UserConverter.toJson(this, json);
        return json;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDate createDate) {
        this.createDate = createDate;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", createDate=" + createDate +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        User user = (User) o;
        return Objects.equals(username, user.username) &&
                Objects.equals(password, user.password) &&
                Objects.equals(createDate, user.createDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username, password, createDate);
    }
}
