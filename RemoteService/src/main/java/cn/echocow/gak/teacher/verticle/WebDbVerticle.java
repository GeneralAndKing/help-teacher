package cn.echocow.gak.teacher.verticle;

import cn.echocow.gak.teacher.common.ReasultBuilder;
import cn.echocow.gak.teacher.common.Runner;
import cn.echocow.gak.teacher.common.VertxSingleton;
import cn.echocow.gak.teacher.constants.ApiRoute;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

import java.sql.ResultSet;
import java.time.LocalDate;

import static io.vertx.core.spi.resolver.ResolverProvider.DISABLE_DNS_RESOLVER_PROP_NAME;

/**
 * WebDbVerticle
 *
 * @author echo
 * @version 1.0
 * @date 18-12-12 下午4:51
 */
public class WebDbVerticle extends AbstractVerticle {
    public static void main(String[] args) {
        System.getProperties().setProperty(DISABLE_DNS_RESOLVER_PROP_NAME, "true");
        Runner.runHazelcast(WebDbVerticle.class);
    }

    private MongoClient client;

    @Override
    public void start(Future<Void> startFuture) throws Exception {
        JsonObject config = Vertx.currentContext().config();
        EventBus eventBus = vertx.eventBus();
        String uri = config.getString("mongo_uri");
        if (uri == null) {
            uri = "mongodb://localhost:27017";
        }
        String db = config.getString("mongo_db");
        if (db == null) {
            db = "gak";
        }
        JsonObject mongoConfig = new JsonObject()
                .put("connection_string", uri)
                .put("db_name", db);
        client = MongoClient.createShared(vertx, mongoConfig, "gak");
        eventBus.consumer(getClass().getName(), this::onMessage);
        JsonObject user = new JsonObject();
        startFuture.complete();
    }

    private void onMessage(Message<JsonObject> message) {
        switch (message.headers().get("action")) {
            case "login":
                login(message);
                break;
            case "get":
                get(message);
                break;
            case "post":
                post(message);
                break;
            default:
                break;
        }
    }

    private void post(Message<JsonObject> message) {

    }

    private void get(Message<JsonObject> message) {

    }

    /**
     * 登录方法
     * 登录成功 code == 200
     * 注册成功 code == 201
     * 密码错误 code == 401
     * 其他错误 code == 500
     *
     * @param message 消息
     */
    private void login(Message<JsonObject> message) {
        JsonObject user = message.body();
        client.find(ApiRoute.DOCUMENT_USER, new JsonObject().put("username", user.getString("username")), res -> {
            if (res.succeeded()) {
                if (res.result().size() > 0) {
                    JsonObject auth = res.result().get(0);
                    if (user.getString("password").equals(auth.getString("password"))) {
                        message.reply(ReasultBuilder.buildSuccess());
                    } else {
                        message.reply(ReasultBuilder.buildPasswordError());
                    }
                } else {
                    user.put("createDate", LocalDate.now().toString());
                    client.insert(ApiRoute.DOCUMENT_USER, user, ar -> {
                        if (ar.succeeded()){
                            message.reply(ReasultBuilder.buildReg());
                        } else {
                            message.reply(ReasultBuilder.buildError(ar.cause().getMessage()));
                        }
                    });
                }
            } else {
                message.reply(ReasultBuilder.buildError(res.cause().getMessage()));
            }
        });
    }

}
