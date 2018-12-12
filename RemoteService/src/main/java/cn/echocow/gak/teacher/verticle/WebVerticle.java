package cn.echocow.gak.teacher.verticle;

import cn.echocow.gak.teacher.common.ReasultBuilder;
import cn.echocow.gak.teacher.common.RestfulApiVerticle;
import cn.echocow.gak.teacher.common.Runner;
import cn.echocow.gak.teacher.constants.ApiRoute;
import com.sun.istack.internal.NotNull;
import io.vertx.codegen.annotations.Nullable;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.eventbus.DeliveryOptions;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.auth.KeyStoreOptions;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.ext.jwt.JWTOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.JWTAuthHandler;


import static io.vertx.core.spi.resolver.ResolverProvider.DISABLE_DNS_RESOLVER_PROP_NAME;

/**
 * WebVerticle
 *
 * @author echo
 * @version 1.0
 * @date 18-12-12 下午3:34
 */
public class WebVerticle extends RestfulApiVerticle {
    private static final Logger LOGGER = LoggerFactory.getLogger(WebVerticle.class);
    private static final String HOST = "127.0.0.1";
    private static final int PORT = 8082;
    private EventBus eventBus;
    private JWTAuth jwt;

    public static void main(String[] args) {
        System.getProperties().setProperty(DISABLE_DNS_RESOLVER_PROP_NAME, "true");
        Runner.runHazelcast(WebDbVerticle.class);
    }

    @Override
    public void start(Future<Void> startFuture) throws Exception {
        Router router = Router.router(vertx);
        jwt = JWTAuth.create(vertx, new JWTAuthOptions()
                .setKeyStore(new KeyStoreOptions()
                        .setPath("keystore.jceks")
                        .setPassword("secret")));

        router.route("/api/*").handler(JWTAuthHandler.create(jwt));
        enableCorsSupport(router);
        eventBus = vertx.eventBus();
        router.post(ApiRoute.API_LOGIN).handler(this::handlePostLogin);
        router.get(ApiRoute.API_GET).handler(this::handleGetTeacher);
        router.post(ApiRoute.API_POST).handler(this::handlePost);
        String host = config().getString("http.address", HOST);
        int port = config().getInteger("http.port", PORT);
        vertx.createHttpServer().requestHandler(router)
                .listen(port, host, rs -> {
                    if (rs.succeeded()) {
                        LOGGER.info("Http Server started on " + host + ":" + port + "!");
                    } else {
                        LOGGER.error("Http Server failed!" + rs.cause());
                    }
                });
    }

    /**
     * 上传或更新
     *
     * @param routingContext 上下文
     */
    private void handlePost(RoutingContext routingContext) {
        try {
            JsonObject data = routingContext.getBodyAsJson();
            DeliveryOptions options = new DeliveryOptions().addHeader("action", "post");
            eventBus.<JsonObject>send(WebDbVerticle.class.getName(), data, options, reply -> {
                if (reply.succeeded()){
                    JsonObject body = reply.result().body();
                    Integer code = body.getInteger("code");
                    if (code == ReasultBuilder.SUCCESS_CODE) {
                        ok(routingContext);
                    } else {
                        internalError(routingContext, body.toString());
                    }
                } else {
                    LOGGER.error("Event Bus Get Error!" + reply.cause().getMessage());
                    routingContext.fail(reply.cause());
                    internalError(routingContext, reply.cause());
                }
            });
        } catch (Exception e) {
            internalError(routingContext, e);
        }
    }

    /**
     * 下载
     *
     * @param routingContext 上下文
     */
    private void handleGetTeacher(RoutingContext routingContext) {
        try {
            DeliveryOptions options = new DeliveryOptions().addHeader("action", "get");
            eventBus.<JsonObject>send(WebDbVerticle.class.getName(), null, options, reply -> {
                if (reply.succeeded()){
                    JsonObject body = reply.result().body();
                    Integer code = body.getInteger("code");
                    if (code == ReasultBuilder.SUCCESS_CODE) {
                        ok(routingContext);
                    } else {
                        internalError(routingContext, body.toString());
                    }
                } else {
                    LOGGER.error("Event Bus Get Error!" + reply.cause().getMessage());
                    routingContext.fail(reply.cause());
                    internalError(routingContext, reply.cause());
                }
            });
        } catch (Exception e) {
            internalError(routingContext, e);
        }
    }

    /**
     * 登录
     *
     * @param routingContext 上下文
     */
    private void handlePostLogin(RoutingContext routingContext) {
        try {
            @NotNull JsonObject user = routingContext.getBodyAsJson();
            DeliveryOptions options = new DeliveryOptions().addHeader("action", "login");
            eventBus.<JsonObject>send(WebDbVerticle.class.getName(), user, options, reply -> {
                if (reply.succeeded()) {
                    JsonObject body = reply.result().body();
                    Integer code = body.getInteger("code");
                    String token;
                    switch (code) {
                        case ReasultBuilder.SUCCESS_CODE:
                            token = jwt.generateToken(new JsonObject(), new JWTOptions().setExpiresInMinutes(60));
                            ok(routingContext, new JsonObject().put("token", token));
                            break;
                        case ReasultBuilder.SUCCESS_REG:
                            token = jwt.generateToken(new JsonObject(), new JWTOptions().setExpiresInMinutes(60));
                            register(routingContext, new JsonObject().put("token", token));
                            break;
                        case ReasultBuilder.PADDWORD_ERROR:
                            passwordError(routingContext);
                            break;
                        default:
                            internalError(routingContext, body.toString());
                            break;
                    }
                } else {
                    LOGGER.error("Event Bus PassWord Error!" + reply.cause().getMessage());
                    routingContext.fail(reply.cause());
                    internalError(routingContext, reply.cause());
                }
            });
        } catch (Exception e) {
            internalError(routingContext, e);
        }
    }
}
