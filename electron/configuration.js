'use strict';

var nconf = require('nconf').file({file: getUserHome() + '/pcm-conf.json'});

function saveSettings(settingKey,settingValue) 
{
    nconf.set(settingKey,settingValue);
    nconf.save();
} // saveSettings

function readSettings(settingKey) 
{
    nconf.load();
    return nconf.get(settingKey);
} // readSettings

function getUserHome()
{
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
} // getUserHome

module.exports  = {
     'saveSettings' : saveSettings
    ,'readSettings' : readSettings
}