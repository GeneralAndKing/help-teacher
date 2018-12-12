package cn.echocow.gak.teacher;

import cn.echocow.gak.teacher.verticle.WebDbVerticle;
import cn.echocow.gak.teacher.verticle.WebVerticle;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;


import static io.vertx.core.spi.resolver.ResolverProvider.DISABLE_DNS_RESOLVER_PROP_NAME;

/**
 * Application
 *
 * @author echo
 * @version 1.0
 * @date 18-12-12 下午4:59
 */
public class Application extends AbstractVerticle {
    private static final Logger LOGGER = LoggerFactory.getLogger(Application.class);

    public static void main(String[] args) {
        System.getProperties().setProperty(DISABLE_DNS_RESOLVER_PROP_NAME, "true");
        Vertx vertx = Vertx.vertx();
        vertx.deployVerticle(Application.class.getName());
    }

    @Override
    public void start(Future<Void> startFuture) throws Exception {
        Future<String> dbVerticleDeployment = Future.future();
        vertx.deployVerticle(new WebDbVerticle(), dbVerticleDeployment.completer());
        dbVerticleDeployment.compose(id -> {
            Future<String> rxWebVerticle = Future.future();
            vertx.deployVerticle(
                    WebVerticle.class.getName(),
                    new DeploymentOptions().setInstances(1),
                    rxWebVerticle.completer());
            return rxWebVerticle;
        }).setHandler(ar -> {
            if (ar.succeeded()) {
                LOGGER.info("Success Started!");
                startFuture.complete();
            } else {
                startFuture.fail(ar.cause());
            }
        });
    }
}
