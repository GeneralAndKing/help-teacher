package cn.echocow.gak.teacher.common;

import io.vertx.core.Vertx;

/**
 * VertxSingleton
 *
 * @author echo
 * @version 1.0
 * @date 18-12-12 下午3:24
 */
public class VertxSingleton {
    public static final Vertx VERTX = Vertx.vertx();
}
