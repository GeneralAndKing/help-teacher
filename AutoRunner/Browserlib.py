"""
@author Rui
@version 1.0
selenium封装方法,进行selenium开发时增强稳定性
"""
import random,datetime,os
from time import time, sleep
from selenium import webdriver
from selenium.webdriver.common.by import By as BY
from selenium.webdriver.common.action_chains import ActionChains as AC
from selenium.webdriver.common.touch_actions import TouchActions as TA
from selenium.webdriver.support.ui import Select as SL
from selenium.common import exceptions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from PIL import Image
from util import hostlog,logs,init_logging,init_png,logginginfo,loggingerror,log_time_delta,random_keyword_list
import logging
def create_driver(options=None):
    try:
        userProfile = os.getcwd() + r"\nwjs"
        browserpath = userProfile + r"\nw.exe"
        driverpath = userProfile + r"\driver.exe"
        chrome_options = webdriver.ChromeOptions()
        chrome_options.binary_location = browserpath
        # chrome_options.add_argument("--disk-cache-dir={}".format(userProfile))
        # chrome_options.add_argument("user-data-dir={}".format(userProfile))
        if (options == None):

            pass

        else:
            if (isinstance(options, list)):
                for item in options:
                    chrome_options.add_argument(item)
            else:
                raise Exception("options need list")
        driver = webdriver.Chrome(executable_path=driverpath, chrome_options=chrome_options)
        return driver
    except Exception as e:
        hostlog("create driver is error:", e)
        return None


def quit_driver(driver):
    try:
        driver.quit()
    except Exception as e:
        hostlog("Quit driver is error:", e)

def help():
    help_list=['BY','AC','EC','Keys']
    for help_item in help_list:
        exec('print("this is {0} help",dir({0}))'.format(help_item))
def random_sleep(mint=1.0, maxt=10.0):
        t = random.randint(int(mint * 9999), int(maxt * 9999))
        t = float(t) / 9999
        if t:
            sleep(t)
        return t






driver_type={
    "PC":0,
    "MOBILE":1
}

task_state={
    "SUCCEED":0,
    "ERROR":-1
}


class Browserlib(object):
    driver=None
    drivertype = None
    tc=None
    ac=None
    pngpath ="TMP"
    logpath="LOG"
    JS_COMMANDS = {
        "get_document_size": 'return [window.document.body.offsetWidth, window.document.body.offsetHeight];',
        "inner_width_hight": 'return [window.innerWidth, window.innerHeight];',
        "scroll_x_y": 'return [window.scrollX, window.scrollY];',
        "scroll_to_element": "arguments[0].scrollIntoView();",
        "scroll_by_x_y": 'window.scrollBy(%d, %d)',
        "scroll_by_y": 'window.scrollBy(0, arguments[0])',
        "scroll_to_top": "window.scrollTo(0, 0)",
        "scroll_to_bottom": "window.scrollTo(0, document.body.scrollHeight)",
        # # "scroll_ele_x_y":'''
        # # function getOffsetRect(elem) {
        # #     var box = elem.getBoundingClientRect();
        # #     var body = document.body;
        # #     var docElem = document.documentElement;
        # #     var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        # #     var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        # #     var clientTop = docElem.clientTop || body.clientTop || 0;
        # #     var clientLeft = docElem.clientLeft || body.clientLeft || 0;
        # #     var top  = box.top +  scrollTop - clientTop;
        # #     var left = box.left + scrollLeft - clientLeft;
        # #     return [Math.round(left), Math.round(top)]
        # # }
        # # return getOffsetRect(arguments[0]);''',
        # 'scroll_to_bottom_human':'''
        #             var timesRun = 0;
        #             var Y;
        #             var interval = setInterval(function(){
        #             timesRun += 1;
        #             Y=window.scrollY;
        #             window.scrollBy(0,40);
        #             if(timesRun === 200||window.scrollY===Y){
        #             clearInterval(interval);
        #             }
        #             }, 20);
        #         ''',
        # 'scroll_to_top_human': '''
        #         var timesRun = 0;
        #         var Y;
        #         var interval = setInterval(function(){
        #         timesRun += 1;
        #         Y=window.scrollY;
        #         window.scrollBy(0,-40);
        #         if(timesRun === 200||window.scrollY===Y){
        #         clearInterval(interval);
        #         }
        #         }, 20);
        #     ''',
        # "scroll_by_y_human": '''
        #     function scroll_to_element_human(ele_y) {
        #         var flog;
        #         var y;
        #         if (window.scrollY - ele_y > 0)
        #             flog = -1;
        #         else
        #             flog = 1;
        #         var interval = setInterval(function(){
        #             y=window.scrollY;
        #             window.scrollBy(0,flog*40);
        #             if (flog == 1&&(window.scrollY >= ele_y-window.innerHeight/2||y==window.scrollY))
        #                     clearInterval(interval);
        #             if(flog == -1&&(window.scrollY <= ele_y-window.innerHeight/2||y==window.scrollY))
        #                     clearInterval(interval);
        #         }, 20);
        #     }
        #     return scroll_to_element_human(arguments[0]);''',
    }
    vwidth=935
    vheight=930



    def __init__(self,driver=None,islog=False,pngpath='TMP',logpath='LOG'):
        self.logpath=init_logging(islog,logpath)
        self.pngpath=init_png(pngpath)
        self.driver = driver
        # self.driver.maximize_window()
        self.driver.get("about:blank")
        self.tc=TA(self.driver)
        self.ac=AC(self.driver)
        self.vwidth, self.vheight = self.get_windows_size()
    @logs
    def refresh(self):
        self.driver.refresh()

    @logs
    def back(self):
        self.driver.back()

    @logs
    def forward(self):
        self.driver.forward()

    @logs
    def get_windows_size(self):
        return self.driver.execute_script(self.JS_COMMANDS["inner_width_hight"])

    @logs
    def open_url(self,url):
        if("http://" not in url and "https://" not in url):
            url="http://"+url
        self.driver.get(url)

    @logs
    def close_windows(self, keep=1):
        while len(self.driver.window_handles) > keep:
            self.driver.switch_to_window(self.driver.window_handles[-1])
            self.driver.close()
        for handle in self.driver.window_handles:
            self.driver.switch_to_window(handle)
            self.driver.get("about:blank")

    @logs
    def close_now_window(self):
        if(len(self.driver.window_handles)==1):
            self.driver.get("about:blank")
        else:
            self.driver.close()
            self.driver.switch_to_window(self.driver.window_handles[-1])

    @logs
    def del_cookies(self):
        self.driver.delete_all_cookies()

    @logs
    def del_cookie(self,cookie):
        self.driver.delete_cookie(cookie)

    @logs
    def execute_script(self,*args,**kwargs):
        return self.driver.execute_script(*args,**kwargs)

    @logs
    def scroll_to_bottom(self):
        self.execute_script(self.JS_COMMANDS["scroll_to_bottom"])

    @logs
    def scroll_to_top(self):
        self.execute_script(self.JS_COMMANDS["scroll_to_top"])

    @logs
    def find_display_elements(self,expression,mode=BY.XPATH,timeout=10):
        return  WebDriverWait(self.driver, timeout).until(EC.visibility_of_any_elements_located((mode, expression)))

    @logs
    def find_display_element(self,expression,mode=BY.XPATH,timeout=10):
        return WebDriverWait(self.driver, timeout).until(EC.visibility_of_element_located((mode,expression)))

    @logs
    def find_elements(self,expression,mode=BY.XPATH,timeout=10):
        return WebDriverWait(self.driver, timeout).until(EC.presence_of_all_elements_located((mode, expression)))

    @logs
    def find_element(self,expression,mode=BY.XPATH,timeout=10):
        return  WebDriverWait(self.driver, timeout).until(EC.presence_of_element_located((mode,expression)))

    @logs
    def element_isdisplay(self,ele):
        return ele.is_displayed()



    @logs
    def into_element(self,ele):
        self.execute_script(self.JS_COMMANDS["scroll_to_element"],ele)


    @logs
    def click(self,ele):
        self.into_element(ele)
        ele.click()




    @logs
    def input(self,ele,keywords):
        ele.send_keys(keywords)

    @logs
    def input_clear(self,ele):
        ele.clear()

    @logs
    def save_screenshot(self):
        screenshot_file = self.pngpath+"%s.png" % datetime.datetime.now().strftime("%H%M%S")
        self.driver.save_screenshot(screenshot_file)
        return screenshot_file

    @logs
    def save_element_screenshot(self,ele):
        if(not self.element_isdisplay(ele)):
            self.into_element(ele)
        pngfile=self.save_screenshot()
        left = ele.location['x']
        top = ele.location['y']
        elementWidth = ele.location['x'] + ele.size['width']
        elementHeight = ele.location['y'] + ele.size['height']
        picture = Image.open(pngfile)
        picture = picture.crop((left, top, elementWidth, elementHeight))
        os.remove(pngfile)
        screenshot_file =self.pngpath+"%s.png" % datetime.datetime.now().strftime("%H%M%S")
        picture.save(screenshot_file)
        return screenshot_file


    @logs
    def switch_last_window(self):
        self.driver.switch_to_window(self.driver.window_handles[-1])

    # 模拟人类操作

    @logs
    def move_mouse(self):
        sum_x = 1
        sum_y = 1
        for i in range(0, random.randint(3,5)):
            temp_x = random.randint(1, self.vwidth - sum_x)
            sum_x += temp_x
            temp_y = random.randint(1, self.vheight - sum_y)
            sum_y += temp_y
            self.ac.move_by_offset(temp_x, temp_y).perform()
            self.ac.reset_actions()
            random_sleep(0.5, 1)
            if (sum_y >= (self.vheight - 10) or sum_x >= (self.vwidth - 10)):
                break
        self.ac.move_by_offset(-sum_x + 1, -sum_y + 1).perform()
        self.ac.reset_actions()


    @logs
    def scroll_to_bottom_human(self):
        x, y = self.execute_script(self.JS_COMMANDS["get_document_size"])
        if(self.drivertype==driver_type.get("PC")):
            self.move_mouse()
            for j in range(1, min(int(y / self.vheight),5)):
                self.ac.send_keys(Keys.PAGE_DOWN).perform()
                self.ac.reset_actions()
                self.move_mouse()
        elif(self.drivertype==driver_type.get("MOBILE")):
            sum_x=0
            for j in range(1, min(int(y / self.vheight),5)):
                self.tc.scroll(random.randint(1,x-1),self.vheight*j).perform()
                move_x=random.randint(1,5)
                sum_x+=move_x
                self.ac.move_by_offset(move_x,0).perform()
                self.ac.reset_actions()
                self.tc._actions=[]
            self.ac.move_by_offset(-sum_x,0).perform()
            self.ac.reset_actions()

    @logs
    def scroll_to_top_human(self):
        x, y = self.execute_script(self.JS_COMMANDS["get_document_size"])
        if (self.drivertype == driver_type.get("PC")):
            self.move_mouse()
            for j in range(1,min(int(y / self.vheight),5)):
                self.ac.send_keys(Keys.PAGE_UP).perform()
                self.ac.reset_actions()
                self.move_mouse()
        elif(self.drivertype==driver_type.get("MOBILE")):
            for j in range(min(int(y / self.vheight)-1,5),0,-1):
                self.tc.scroll(random.randint(1,x-1),self.vheight*j).perform()
                self.tc._actions = []
                self.move_mouse()







    @logs
    def click_human(self,ele):
        self.scroll_to_bottom_human()
        len_handles=len(self.driver.window_handles)
        current_url=self.driver.current_url
        self.ac.click(ele).perform()
        self.ac.reset_actions()
        if(self.drivertype==driver_type.get("PC")):
            if(len_handles==len(self.driver.window_handles)):
                ele.click()
        elif(self.drivertype==driver_type.get("MOBILE")):
            if(current_url==self.driver.current_url):
                ele.click()



    @logs
    def input_human(self,ele,keywords,mint=0.5,maxt=1):
        keywords=str(keywords)
        self.scroll_to_bottom_human()
        for each in keywords:
            ele.send_keys(each)
            random_sleep(mint, maxt)
        ele.send_keys("\n")

    @logs
    def input_clear_human(self,ele):
            self.click(ele)
            i=len(ele.text)+10
            while i>0:
                ele.send_keys(Keys.BACKSPACE)
                random_sleep(0.1,0.2)
                i-=1


entrances_baidu = [('https://www.baidu.com/', '//input[@id="kw"]'),
                   ('http://www.duba.com/?un_369374_254561','//input[@id="search_keyword"]'),
                   ('http://hao.7654.com/?chno=7654dh_155878','//input[@id="J_search_input"]'),
                   ('http://www.919yi.cn/?id=527032','//input[@id="search-input"]'),
                   ('http://hao.7654.com/?chno=7654dh_155878','//input[@id="J_search_input"]'),
                   ('http://www.919yi.cn/?id=527032','//input[@id="search-input"]'),
                   ('http://hao.7654.com/?chno=7654dh_155878','//input[@id="J_search_input"]'),
                   ('https://www.hao123.com/', '//input[@id="search-input"]'),
                   ('http://i.maxthon.cn/', '//input[@id="header-search-box"]'),
                   ('http://www.3456.cc/', '//input[@id="searchbox"]'),
                   ('http://www.114la.com/', '//input[@id="tsrcInp"]'),
                   ('http://www.uc123.com/', '//input[@id="J_searchKeyword"]'),
                   ('http://i.firefoxchina.cn/', '//input[@id="search-key"]'),
                   ('http://www.baidu.com/index.php?tn=request_25_pg', '//input[@id="kw"]'),
                   ('http://www.baidu.com/index.php?tn=02049043_6_pg', '//input[@id="kw"]'),
                   ('http://www.baidu.com/index.php?tn=77092190_pg', '//input[@id="kw"]'),
                   ('http://www.baidu.com/index.php?tn=02049043_6_pg', '//input[@id="kw"]'),
                   ('http://www.baidu.com/index.php?tn=tn=02049043_33_pg', '//input[@id="kw"]'),
                   ('http://www.baidu.com/?tn=39042058_21_oem_dg', '//input[@id="kw"]'),
                   ('http://www.baidu.com/?tn=47018152_dg', '//input[@id="kw"]'),
                   ('http://www.baidu.com/index.php?tn=mswin_oem_dg', '//input[@id="kw"]')
                   ]


entrances_baidu_mobile = [('https://m.baidu.com/', '//input[@id="index-kw" or @id="kw"]'),
               ('https://m1.baidu.com/', '//input[@id="index-kw" or @id="kw"]'),
               ('https://m2.baidu.com/', '//input[@id="index-kw" or @id="kw"]'),
               ('https://m.baidu.com/?tn=sitehao123', '//input[@id="index-kw" or @id="kw"]'),
               ('https://m.baidu.com/?tn=93078054_p', '//input[@id="index-kw" or @id="kw"]'),
               ('https://m1.baidu.com/?tn=93078054_pg', '//input[@id="index-kw" or @id="kw"]'),
               ('https://m2.baidu.com/?tn=93078054_pg', '//input[@id="index-kw" or @id="kw"]'),
               ('https://m2.baidu.com/?tn=sitehao123', '//input[@id="index-kw" or @id="kw"]'),
               ('https://m3.baidu.com/?tn=sitehao123', '//input[@id="index-kw" or @id="kw"]'),
               ('https://m.baidu.com/?from=8', '//input[@id="index-kw" or @id="kw"]'),
               ('https://m2.baidu.com/?from=8', '//input[@id="index-kw" or @id="kw"]'),
               ('https://m3.baidu.com/?from=8', '//input[@id="index-kw" or @id="kw"]')]
class Task(Browserlib):
    def random_input(self,click):
        click.send_keys()
        random_keyword=random.choice(random_keyword_list)
        self.input_human(click,random_keyword)

    def random_move_on_body(self):
        random_sleep(1,2)
        self.scroll_to_bottom_human()
        self.scroll_to_top_human()
    @log_time_delta
    def do_baidu_drop_down(self):
        self.drivertype=driver_type.get("PC")
        # keyword1 = self.task['baidu_wd']
        # keyword2 = self.task['second_keyword']
        keyword1="帮站"
        keyword2="帮站seo"
        keyword2=keyword2.replace(keyword1,"")
        err = 5
        while err>0:
            self.close_windows()
            try:
                entryurl, kwxpath = entrances_baidu[0]
                logginginfo("kwxpath: {0}, keyword: {1}".format(kwxpath, keyword1))
                self.open_url(entryurl)
                keywordinput=self.find_display_element(kwxpath)
                self.input_clear_human(keywordinput)
                self.random_input(keywordinput)
                self.random_move_on_body()
                keywordinput =self.find_display_element(entrances_baidu[0][1])
                self.input_clear_human(keywordinput)
                self.input_human(keywordinput,keyword1)
                random_sleep(0.5,1)
                self.input_human(keywordinput,keyword2)
                logginginfo("title: {0} \n url: {1}".format(self.driver.title, self.driver.current_url))
                results = self.find_display_elements('h3',BY.TAG_NAME)
                results.extend(self.find_display_elements('c-span4',BY.CLASS_NAME))
                self.random_move_on_body()
                count = random.randint(1, 1)
                while count > 0:
                    result = random.choice(results)
                    logginginfo("click {0}".format(result.text))
                    self.click_human(result)
                    self.switch_last_window()
                    logginginfo("title: {0} \n url: {1}".format(self.driver.title, self.driver.current_url))
                    self.random_move_on_body()
                    random_sleep(20, 40)
                    count -= 1
                return task_state.get("SUCCEED")
            except Exception as _:
                err -= 1
        else:
            return task_state.get("ERROR")




    @log_time_delta
    def do_baiduzs(self):
        self.drivertype = driver_type.get("PC")
        keyword = "帮站效果好"
        err = 5
        entryurl="http://www.baidu.com/gaoji/advanced.html"
        kwxpath='//input[@id="keyword"]'
        randomxpath='//input[@name="q4"]'
        intxpath='//input[@name="q3"]'
        while err >0:
            self.close_windows()
            try:
                logging.info("kwxpath: {0}, keyword: {1}".format(kwxpath, keyword))
                self.open_url(entryurl)
                keywordinput = self.find_display_element(intxpath)
                self.input_clear(keywordinput)
                self.input(keywordinput,random.randint(100,500))
                keywordinput =self.find_display_element(randomxpath)
                self.input_clear(keywordinput)
                self.input(keywordinput,random.choice(random_keyword_list))
                keywordinput =self.find_display_element(kwxpath)
                self.input_clear(keywordinput)
                self.input_human(keywordinput,keyword)
                logging.info("title: {0} \n url: {1}".format(self.driver.title, self.driver.current_url))
                self.switch_last_window()
                results = self.find_display_elements('//div[@title="搜索热点"]/parent::div/table/tbody[1]/tr/td')
                # results.extend(self.find_display_elements("百度快照",BY.LINK_TEXT))
                result = random.choice(results)
                self.random_move_on_body()
                logging.info('click {0}'.format(result.text))
                self.click_human(result)
                self.switch_last_window()
                logging.info("title: {0} \n url: {1}".format(self.driver.title, self.driver.current_url))
                self.random_move_on_body()
                random_sleep(10, 20)
                return 0
            except Exception as _:
                err -= 1
        else:
            return

    def do_mobilezs(self):
        self.drivertype=driver_type.get("MOBILE")
        keyword = "帮站效果好"
        err = 5
        while err>0:
            try:
                self.close_windows()
                entryurl, kwxpath = random.choice(entrances_baidu_mobile)
                logging.info("entryurl: {0}, kwxpath: {1}, keyword: {2}".format(entryurl, kwxpath, keyword))
                self.open_url(entryurl)
                keywordinput = self.find_display_element(kwxpath)
                self.input_clear(keywordinput)
                self.input_human(keywordinput,keyword)
                self.random_move_on_body()
                try:
                    div_click=self.find_display_element("page-banner_5",BY.CLASS_NAME)
                    self.click(div_click)
                except:
                    pass
                gaoji=self.find_display_element('//div[@class="return-link"]//a[@class="ft-span advanced-filter c-blocka"]')
                self.click_human(gaoji)
                zhandian=self.find_display_element('//div[@class="filter-panel-site-row c-row filter-panel-gap"][2]//div[4]')
                self.click(zhandian)
                time=self.find_display_element('//div[@class="filter-panel-time-row c-row filter-panel-gap"]//div[1]')
                self.click(time)
                click=self.find_display_element('//div[@class="c-span6 filter-panel-confirm"]')
                self.click(click)
                self.random_move_on_body()
                results=[]
                try:
                    results.extend(self.find_display_elements('//div[@class="c-span6"]'))
                except:
                    results.extend(self.find_display_elements('//div[@id="relativewords"]//div[@class="rw-list"]//a'))
                result=random.choice(results)
                self.click(result)
                results = self.find_display_elements('//div[contains(@class, "c-result")]//a[.//span[contains(@class, "c-showurl")]]')
                self.random_move_on_body()
                count = 1
                while count > 0:
                    n = random.randint(0, 0)
                    result = results[n]
                    div = result.find_element_by_xpath("ancestor::div[contains(@class, 'c-container')]")
                    title = div.find_element_by_tag_name("a")
                    logging.info('click 【YES】on [{0}/{1}]\n title: [{2}]'.format(count, n + 1, title.text))
                    self.click(result)
                    random_sleep(1, 3)
                    self.random_move_on_body()
                    count -= 1
                    return task_state.get("SUCCEED")
            except:
                logging.error("err + 1 now err = {0}".format(err))
                err-=1
        else:
            return task_state.get("ERROR")


if __name__=="__main__":
    pass
    WIDTH = 320
    HEIGHT = 640
    PIXEL_RATIO = 3.0
    UA = 'Mozilla/5.0 (Linux; Android 4.1.1; GT-N7100 Build/JRO03C) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/35.0.1916.138 Mobile Safari/537.36 T7/6.3'
    driver = create_driver()
    item=Task(driver)
    # item.vheight=HEIGHT
    # item.vwidth=WIDTH
    item.do_baidu_drop_down()
    # t.double_tap(ele).perform()
    item.scroll_to_bottom_human()
    item.scroll_to_top_human()
    from selenium.webdriver.common.alert import Alert

    Alert(driver).send_keys(Keys.SPACE)




