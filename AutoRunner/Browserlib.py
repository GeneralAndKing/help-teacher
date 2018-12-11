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
        userProfile = os.path.dirname(os.path.dirname(__file__)) + r"\build\help-teacher-win32-x64"
        browserpath = userProfile + r"\help-teacher.exe"
        driverpath = os.path.dirname(__file__) + r"\chromedriver.exe"
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




class Task(Browserlib):
    studentfile=os.path.dirname(__file__)+r'\student.xlsx'
    className="测试1班" +'\n'

    @log_time_delta
    def uploadClassFile(self):
        #点击班级管理
        sidBar=self.find_display_element('//*[@id="sideBar"]/ul/li[2]')
        self.click(sidBar)
        elements=self.find_display_elements('el-collapse-item__header',BY.CLASS_NAME)
        self.click(elements[0])

        #上传学生文件
        element=self.find_element('file',BY.NAME)
        self.input(element,self.studentfile)
        #查找班级名称输入
        element=self.find_display_element('el-input__inner',BY.CLASS_NAME)
        self.input_human(element,self.className)


if __name__=="__main__":
    driver=create_driver()
    task=Task(driver)
    task.switch_last_window()
    task.uploadClassFile()




