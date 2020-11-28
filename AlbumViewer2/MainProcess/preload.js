const { ipcRenderer } = require('electron');

process.once('loaded', () => {
  window.addEventListener('message', evt => {
    if (evt.data.type === 'select-dirs') {
		console.log('preload: evt.data.type = :%s:',evt.data.type);
      ipcRenderer.send('select-dirs')
    }
  });
});
