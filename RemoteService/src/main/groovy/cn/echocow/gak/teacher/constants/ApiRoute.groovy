package cn.echocow.gak.teacher.constants

/**
 * ApiRoute 
 *
 * @author echo
 * @version 1.0
 * @date 18-12-12 下午2:29
 */
final class ApiRoute {
    private ApiRoute(){}
    /**
     * 登录
     */
    public static final String API_LOGIN = "/login"
    /**
     * 下载
     */
    public static final String API_GET = "/api/teacher/:username"
    /**
     * 上传或更新
     */
    public static final String API_POST = "/api/teacher"

    /**
     * 插入的文档名称 —— 登录
     */
    public static final String DOCUMENT_USER = "user"
    /**
     * 插入的文档名称 —— 数据
     */
    public static final String DOCUMENT_DATA = "teacher_data"
}
