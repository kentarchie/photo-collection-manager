
const electron = require('electron');
const settings = electron.remote.require('electron-settings');

const basic_settings = {
    'user' :  {
        'image-extensions' : []
        ,'language' : 'en'
        ,'locations' : []
        ,'names' : []
    }
    ,app :  {
        'window-specs' {
            'top' : 0
            ,'left' : 0
            ,'width' : 800
            ,'height' : 600
        }
        ,'recent-albums' : []
    }
}

class ManageSettings 
{
  constructor(albumPath)
  {
      if(settings.has('user'))
        initSetting();
  } // constructor
} // ManageSettingd
  