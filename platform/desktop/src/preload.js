import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    let validChannels = ['study_open', 'study_close'];
    console.log('send', channel, data);
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  recieve: (channel, func) => {
    console.log('recieve', channel, func);
    let validChannels = ['toOHIF'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
