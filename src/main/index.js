import { app, BrowserWindow, ipcMain, dialog, Menu, Tray,shell } from 'electron'
import webServer from "./webServer/server"
import ClassDb from "./dbServer/classDb"
import JobDb from "./dbServer/jobDb"
import ClassToJobDb from "./dbServer/classToJobDb"
import IpDb from "./dbServer/ipDb"
const compress = require("./compress");
const path = require("path");
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 800,
    height: 600,
    useContentSize: true,
    width: 800,
    frame: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('close', (eve) => {
    mainWindow.hide();
    eve.preventDefault();
    const options = {
      type: 'warning',
      title: '提示',
      message: "开启的服务可能会受影响,确定关闭程序",
      buttons: ['取消', '确认']
    }
    dialog.showMessageBox(options, function (index) {
      if (index) {
        mainWindow = null
        app.quit()
      }
      else {
        mainWindow.show();
      }
    });

  })
  mainWindow.on('show', () => {
    tray.setHighlightMode('always');
  })
  mainWindow.on('hide', () => {
    tray.setHighlightMode('never');
  });
  mainWindow.webContents.openDevTools();
  let tray = new Tray(path.join(path.resolve("."), '/build/icons/icon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示', click: () => {
        mainWindow.show();
        mainWindow.isVisible() ? mainWindow.setSkipTaskbar(false) : mainWindow.setSkipTaskbar(true);
        
      }
    },
    {
      label: '帮助', click: () => {
        shell.openExternal("https://github.com/GeneralAndKing");
      }
    },
    { label: '退出', click: () => { mainWindow.close() } },//我们需要在这里有一个真正的退出（这里直接强制退出）
  ])
  tray.setToolTip('help-teacher')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => { //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
    mainWindow.show();
    mainWindow.isVisible() ? mainWindow.setSkipTaskbar(false) : mainWindow.setSkipTaskbar(true);
  })
  //设置停止服务的回调函数 向渲染进程发送消息
  let closeCallBack = function () {
    mainWindow.webContents.send('closeWebServer');
  }
  //设置压缩文件的回调
  let compressCallBack = function (jobName, className) {
    let successCallBack = function () {
      mainWindow.webContents.send('compress', true);
    }
    let errorCallBack = function () {
      mainWindow.webContents.send('compress', false);
    }
    compress(className, jobName, errorCallBack, successCallBack);
  }

  global.classDb = new ClassDb();
  global.jobDb = new JobDb();
  global.classToJobDb = new ClassToJobDb();
  global.ipDb = new IpDb();
  global.webServer = new webServer(closeCallBack, compressCallBack);

  ipcMain.on('close', e => {
    mainWindow.hide();
  });
  ipcMain.on('hide-window', e => {
    mainWindow.minimize()
  })
  ipcMain.on('max-window', e => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow.maximize()
    }
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


