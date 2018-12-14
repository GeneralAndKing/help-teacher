package cn.echocow.gak.teacher.common;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;

import java.util.HashSet;
import java.util.Set;

/**
 * RestfulApiVerticle
 *
 * @author echo
 * @version 1.0
 * @date 18-12-12 下午3:24
 */
public class RestfulApiVerticle extends AbstractVerticle {
    private static final Logger LOGGER = LoggerFactory.getLogger(RestfulApiVerticle.class);

    /**
     * 开启 web 跨域支持
     *
     * @param router router instance
     */
    protected void enableCorsSupport(Router router) {
        Set<String> allowHeaders = new HashSet<>();
        allowHeaders.add("x-requested-with");
        allowHeaders.add("Access-Control-Allow-Origin");
        allowHeaders.add("origin");
        allowHeaders.add("Content-Type");
        allowHeaders.add("accept");
        allowHeaders.add("X-PINGARUNER");
        // CORS support
        router.route().handler(BodyHandler.create());
        router.route().handler(CorsHandler.create("*")
                .allowedHeaders(allowHeaders)
                .allowedMethod(HttpMethod.GET)
                .allowedMethod(HttpMethod.POST)
                .allowedMethod(HttpMethod.DELETE)
                .allowedMethod(HttpMethod.PATCH)
                .allowedMethod(HttpMethod.PUT)
                .allowedMethod(HttpMethod.OPTIONS));
        router.route("/").handler(ctx -> {
            ctx.response().putHeader("content-type", "application/json");
            ctx.next();
        });
        LOGGER.info("Route success!");
    }

    /**
     * 发回状态为200 Ok的回复。
     *
     * @param context routing context
     */
    protected void ok(RoutingContext context) {
        LOGGER.info("200 Success");
        context.response().setStatusCode(200)
                .putHeader("content-type", "application/json")
                .end(ReasultBuilder.buildSuccess().toString());
    }

    /**
     * 发回状态为200 Ok的回复。
     *
     * @param context routing context
     * @param content body content in JSON format
     */
    protected void ok(RoutingContext context, JsonObject content) {
        LOGGER.info("200 Success:" + jsonToString(content));
        context.response().setStatusCode(ReasultBuilder.SUCCESS_CODE)
                .putHeader("content-type", "application/json")
                .end(ReasultBuilder.buildSuccess(content).toString());
    }

    /**
     * 发回状态为201已创建的回复。
     *
     * @param context routing context
     */
    protected void register(RoutingContext context, JsonObject content) {
        LOGGER.info("201 Success:" + jsonToString(content));
        context.response().setStatusCode(ReasultBuilder.SUCCESS_REG)
                .putHeader("content-type", "application/json")
                .end(ReasultBuilder.buildReg(content).toString());
    }


    /**
     * 发回状态为204 无内容的回复。
     *
     * @param context routing context
     */
    protected void noContent(RoutingContext context) {
        context.response().setStatusCode(204).end();
    }


    /**
     * 发回状态为 400 Bad Request的回复。
     *
     * @param context routing context
     */
    protected void badRequest(RoutingContext context) {
        LOGGER.info("400 Bad Request");
        context.response().setStatusCode(ReasultBuilder.BAD_REQUEST)
                .putHeader("content-type", "application/json")
                .end(ReasultBuilder.buildBadRequest().toString());
    }

    /**
     * 发回状态为 400 Bad Request的回复。
     *
     * @param context routing context
     */
    protected void badRequest(RoutingContext context, String msg) {
        LOGGER.info("400 Bad Request" + msg);
        context.response().setStatusCode(ReasultBuilder.BAD_REQUEST)
                .putHeader("content-type", "application/json")
                .end(ReasultBuilder.buildBadRequest(msg).toString());
    }


    /**
     * 发回状态为 400 Bad Request的回复。
     *
     * @param context routing context
     */
    protected void badRequest(RoutingContext context, JsonObject content) {
        LOGGER.info("400 Bad Request: " + jsonToString(content));
        context.response().setStatusCode(ReasultBuilder.BAD_REQUEST)
                .putHeader("content-type", "application/json")
                .end(ReasultBuilder.buildBadRequest(content).toString());
    }



    /**
     * 发回状态为 401 Password Error 的回复。
     *
     * @param context routing context
     */
    protected void passwordError(RoutingContext context) {
        LOGGER.info("401 Password Error!");
        context.response().setStatusCode(ReasultBuilder.PADDWORD_ERROR)
                .putHeader("content-type", "application/json")
                .end(ReasultBuilder.buildPasswordError().toString());
    }

    /**
     * 发回状态为 403 No Auth 的回复。
     *
     * @param context routing context
     */
    protected void noAuth(RoutingContext context) {
        LOGGER.info("403 No Auth!");
        context.response().setStatusCode(ReasultBuilder.NO_AUTH)
                .putHeader("content-type", "application/json")
                .end(ReasultBuilder.buildNoFound().toString());
    }

    /**
     * 发回状态为 404 Not Found 的回复。
     *
     * @param context routing context
     */
    protected void notFound(RoutingContext context) {
        LOGGER.info("404 Not Found!");
        context.response().setStatusCode(ReasultBuilder.NO_FOUND)
                .putHeader("content-type", "application/json")
                .end(ReasultBuilder.buildNoFound().toString());
    }

    /**
     * 发回状态为500内部错误的响应。
     *
     * @param context routing context
     * @param ex      exception
     */
    protected void internalError(RoutingContext context, Throwable ex) {
        LOGGER.error("500 Internal Error!" + ex.getMessage());
        context.response().setStatusCode(ReasultBuilder.ERROR_500)
                .putHeader("content-type", "application/json")
                .end(ReasultBuilder.buildError(ex.getMessage()).encodePrettily());
    }

    /**
     * 发回状态为500内部错误的响应。
     *
     * @param context routing context
     * @param cause   error message
     */
    protected void internalError(RoutingContext context, String cause) {
        LOGGER.error("500 Internal Error!" + cause);
        context.response().setStatusCode(ReasultBuilder.ERROR_500)
                .putHeader("content-type", "application/json")
                .end(ReasultBuilder.buildError(cause).toString());
    }

    /**
     * 发回状态为 503 Service Unavailable的响应。
     *
     * @param context routing context
     */
    protected void serviceUnavailable(RoutingContext context) {
        context.fail(503);
    }

    /**
     * 发回状态为 503 Service Unavailable 的响应。
     *
     * @param context routing context
     * @param ex      exception
     */
    protected void serviceUnavailable(RoutingContext context, Throwable ex) {
        context.response().setStatusCode(503)
                .putHeader("content-type", "application/json")
                .end(new JsonObject().put("error", ex.getMessage()).encodePrettily());
    }

    /**
     * 发回状态为 503 Service Unavailable 的响应。le.
     *
     * @param context routing context
     * @param cause   error message
     */
    protected void serviceUnavailable(RoutingContext context, String cause) {
        context.response().setStatusCode(503)
                .putHeader("content-type", "application/json")
                .end(new JsonObject().put("error", cause).encodePrettily());
    }

    private String jsonToString(JsonObject jsonObject){
        return jsonObject == null? "" : jsonObject.toString();
    }
}
