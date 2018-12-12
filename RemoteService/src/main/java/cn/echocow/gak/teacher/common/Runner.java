package cn.echocow.gak.teacher.common;

import cn.echocow.gak.teacher.verticle.WebDbVerticle;
import cn.echocow.gak.teacher.verticle.WebVerticle;
import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.core.spi.cluster.ClusterManager;
import io.vertx.spi.cluster.hazelcast.HazelcastClusterManager;

/**
 * Runner
 * 启动工具类
 *
 * @author echo
 * @version 1.0
 * @date 18-12-12 上午11:54
 */
public class Runner {
    private static final Logger LOGGER = LoggerFactory.getLogger(Runner.class);
    private static ClusterManager mgr = new HazelcastClusterManager();
    private static VertxOptions vertxOptions = new VertxOptions();
    private static Vertx vertx = Vertx.vertx();

    /**
     * 集群方式运行,使用默认配置
     *
     * @param clazz verticle 实例
     */
    public static void runHazelcast(Class clazz) {
        vertxOptions.setClusterManager(mgr);
        Vertx.clusteredVertx(vertxOptions, res -> {
            if (res.succeeded()) {
                Vertx vertx = res.result();
                vertx.deployVerticle(clazz.getName(), r -> {
                    if (r.succeeded()) {
                        LOGGER.info(clazz.getName() + " hazelcast is started!");
                    } else {
                        LOGGER.error(clazz.getName() + " hazelcast is failed!" + r.cause());
                    }
                });
            } else {
                LOGGER.error(clazz.getName() + " hazelcast is failed!" + res.cause());
            }
        });
    }

    /**
     * 普通运行
     *
     * @param clazz verticle 实例
     */
    public static void run(Class clazz) {
        vertx.deployVerticle(clazz.getName(), res -> {
            if (res.succeeded()) {
                LOGGER.info(clazz.getName() + " is started!");
            } else {
                LOGGER.error(clazz.getName() + " is failed!" + res.cause().getMessage());
            }
        });
    }

    /**
     * 运行 web
     */
    public static void runWeb() {
        runHazelcast(WebVerticle.class);
    }

    /**
     * 运行 db
     */
    public static void runDatabase() {
        runHazelcast(WebDbVerticle.class);
    }
}
