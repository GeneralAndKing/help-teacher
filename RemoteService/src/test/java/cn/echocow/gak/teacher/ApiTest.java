package cn.echocow.gak.teacher;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpClient;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * ApiTest
 *
 * @author echo
 * @version 1.0
 * @date 18-12-12 下午5:26
 */
@RunWith(VertxUnitRunner.class)
public class ApiTest {
    private final static int PORT = 8084;
    private Vertx vertx;

    @Before
    public void before(TestContext context) {
        vertx = Vertx.vertx();
        final DeploymentOptions options = new DeploymentOptions()
                .setConfig(new JsonObject().put("http.port", PORT));
        // default config
        Application application = new Application();
        vertx.deployVerticle(application, options,
                context.asyncAssertSuccess());
    }
    @After
    public void after(TestContext context) {
        vertx.close(context.asyncAssertSuccess());
    }
    @Test
    public void testAdd(TestContext context) throws Exception {
        HttpClient client = vertx.createHttpClient();
        Async async = context.async();
        client.post(PORT, "localhost", "/login", response -> {
//            context.assertEquals(201, response.statusCode());
            client.close();
            async.complete();
        }).putHeader("content-type", "application/json").end();
    }
}
