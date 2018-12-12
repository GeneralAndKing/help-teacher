package cn.echocow.gak.teacher.entity;

import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Converter for {@link cn.echocow.gak.teacher.entity.TeacherData}.
 * NOTE: This class has been automatically generated from the {@link cn.echocow.gak.teacher.entity.TeacherData} original class using Vert.x codegen.
 */
public class TeacherDataConverter {

  public static void fromJson(Iterable<java.util.Map.Entry<String, Object>> json, TeacherData obj) {
    for (java.util.Map.Entry<String, Object> member : json) {
      switch (member.getKey()) {
        case "classDate":
          if (member.getValue() instanceof String) {
            obj.setClassDate((String)member.getValue());
          }
          break;
        case "classToJob":
          if (member.getValue() instanceof String) {
            obj.setClassToJob((String)member.getValue());
          }
          break;
        case "jobDate":
          if (member.getValue() instanceof String) {
            obj.setJobDate((String)member.getValue());
          }
          break;
        case "username":
          if (member.getValue() instanceof String) {
            obj.setUsername((String)member.getValue());
          }
          break;
      }
    }
  }

  public static void toJson(TeacherData obj, JsonObject json) {
    toJson(obj, json.getMap());
  }

  public static void toJson(TeacherData obj, java.util.Map<String, Object> json) {
    if (obj.getClassDate() != null) {
      json.put("classDate", obj.getClassDate());
    }
    if (obj.getClassToJob() != null) {
      json.put("classToJob", obj.getClassToJob());
    }
    if (obj.getJobDate() != null) {
      json.put("jobDate", obj.getJobDate());
    }
    if (obj.getUsername() != null) {
      json.put("username", obj.getUsername());
    }
  }
}
