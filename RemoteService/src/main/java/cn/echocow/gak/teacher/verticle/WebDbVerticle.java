package cn.echocow.gak.teacher.verticle;

import cn.echocow.gak.teacher.common.ReasultBuilder;
import cn.echocow.gak.teacher.common.Runner;
import cn.echocow.gak.teacher.constant.ApiRoute;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.mongo.MongoClient;

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
    private static final Logger LOGGER = LoggerFactory.getLogger(WebDbVerticle.class);

    public static void main(String[] args) {
        System.getProperties().setProperty(DISABLE_DNS_RESOLVER_PROP_NAME, "true");
        Runner.runHazelcast(WebDbVerticle.class);
        LOGGER.info("DataBase Success!");
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
        LOGGER.info("Database success get:" + uri + ":" + db);
        startFuture.complete();
    }

    /**
     * 信息获取与分发
     *
     * @param message 消息
     */
    private void onMessage(Message<JsonObject> message) {
        LOGGER.info("Get action:" + message.headers().get("action"));
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

    /**
     * 上传
     *
     * @param message 消息
     */
    private void post(Message<JsonObject> message) {
        JsonObject data = message.body();
        String username = data.getString("username");
        if (username == null || username.isEmpty()) {
            message.reply(ReasultBuilder.buildBadRequest("上传失败，用户名无效！"));
            return;
        }
        client.findOne(ApiRoute.DOCUMENT_DATA, new JsonObject().put("username",
                data.getString("username")), null, res -> {
            if (res.succeeded()) {
                JsonObject document = res.result();
                if (document != null) {
                    client.replaceDocuments(ApiRoute.DOCUMENT_DATA, new JsonObject().put("username",
                            data.getString("username")), data, ar -> {
                        if (ar.succeeded()) {
                            message.reply(ReasultBuilder.buildSuccess());
                        } else {
                            message.reply(ReasultBuilder.buildError("上传失败..."));
                        }
                    });
                } else {
                    client.insert(ApiRoute.DOCUMENT_DATA, data, ar -> {
                        if (ar.succeeded()) {
                            message.reply(ReasultBuilder.buildSuccess());
                        } else {
                            message.reply(ReasultBuilder.buildError("上传失败..."));
                        }
                    });
                }
            } else {
                message.reply(ReasultBuilder.buildError(res.cause().getMessage()));
            }
        });
    }

    /**
     * 下载数据
     * 成功后，data 中包含数据
     *
     * @param message 消息
     */
    private void get(Message<JsonObject> message) {
        JsonObject data = message.body();
        String username = data.getString("username");
        if (username == null || username.isEmpty()) {
            message.reply(ReasultBuilder.buildBadRequest("同步失败，用户名无效！"));
            return;
        }
        client.findOne(ApiRoute.DOCUMENT_DATA, new JsonObject().put("username",
                data.getString("username")), null, res -> {
            if (res.succeeded()) {
                JsonObject result = res.result();
                if (result != null) {
                    message.reply(ReasultBuilder.buildSuccess(result));
                } else {
                    message.reply(ReasultBuilder.buildSuccess(null));
                }
            } else {
                message.reply(ReasultBuilder.buildError(res.cause().getMessage()));
            }
        });
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
        client.findOne(ApiRoute.DOCUMENT_USER, new JsonObject().put("username", user.getString("username")), null, res -> {
            if (res.succeeded()) {
                if (res.result() != null) {
                    JsonObject auth = res.result();
                    if (user.getString("password").equals(auth.getString("password"))) {
                        message.reply(ReasultBuilder.buildSuccess());
                    } else {
                        message.reply(ReasultBuilder.buildPasswordError());
                    }
                } else {
                    user.put("createDate", LocalDate.now().toString());
                    if (user.getString("password").length() < ApiRoute.MIN_LENGTH) {
                        message.reply(ReasultBuilder.buildBadRequest("密码长度过短！"));
                        return;
                    }
                    client.insert(ApiRoute.DOCUMENT_USER, user, ar -> {
                        if (ar.succeeded()) {
                            message.reply(ReasultBuilder.buildReg());
                        } else {
                            message.reply(ReasultBuilder.buildError("Insert Error!"));
                        }
                    });
                }
            } else {
                message.reply(ReasultBuilder.buildError(res.cause().getMessage()));
            }
        });
    }

}
