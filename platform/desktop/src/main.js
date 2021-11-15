// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path';
import url from 'url';
import { app, Menu, ipcMain, shell } from 'electron';
import appMenuTemplate from './menu/app_menu_template';
import editMenuTemplate from './menu/edit_menu_template';
import devMenuTemplate from './menu/dev_menu_template';
import createWindow from './helpers/window';
import aidoc from './helpers/aidoc';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from 'env';

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath} (${env.name})`);
}

const setApplicationMenu = () => {
  const menus = [appMenuTemplate, editMenuTemplate];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// We can communicate with our window (the renderer process) via messages.
const initIpc = () => {
  const api = aidoc();
  ipcMain.on('need-app-path', (event, arg) => {
    event.reply('app-path', app.getAppPath());
  });
  ipcMain.on('open-external-link', (event, href) => {
    shell.openExternal(href);
  });
  ipcMain.on('study_open', (event, data) => {
    console.log('study opened', data);

    try {
      api.login(data.user);
      api.studyOpen(data.user, data.study);
    } catch (e) {
      console.error(e);
    }
  });
  ipcMain.on('study_close', (event, data) => {
    console.log('study_closed');

    try {
      api.login(data.user);
      api.studyOpen(data.user, data.study);
    } catch (e) {
      console.error(e);
    }
  });
};

app.on('ready', () => {
  setApplicationMenu();
  initIpc();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    title: 'aidoc Demo',
    webPreferences: {
      // Two properties below are here for demo purposes, and are
      // security hazard. Make sure you know what you're doing
      // in your production app.
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      // Spectron needs access to remote module
      enableRemoteModule: env.name === 'test',
    },
  });

  mainWindow.on('page-title-updated', function(e) {
    e.preventDefault();
  });

  mainWindow.loadURL(
    url.format({
      pathname: 'localhost:3000',
      protocol: 'http:',
      slashes: true,
    })
  );

  if (env.name === 'development') {
    mainWindow.openDevTools();
  }
});

app.on('window-all-closed', () => {
  app.quit();
});
