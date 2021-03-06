#!/usr/bin/env node
const si = require('systeminformation');
const asciichart = require ('asciichart');
const chalk = require('chalk');
const notifierText = '■';
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const boxen = require('boxen');
const beeper = require('beeper');
const cliCursor = require('cli-cursor');

const totalDownload = [0];
const totalUpload = [0];
const maxValueOfArray = 60;
const maxBeepCount = 6;

let totalDownloadSize = 0;
let totalUploadSize = 0;
let defaultNetwork;
let beepCount=1;

cliCursor.hide();


const config = {
    colors: [
        asciichart.blue,
        asciichart.green,
    ],
    height:  10,
    min:1,
}

const notifier = updateNotifier({
	pkg: {
		name: pkg.name,
		version: pkg.version,
	},
	isGlobal:true,
    shouldNotifyInNpmScript: true,
    updateCheckInterval: 0,
});

si.networkInterfaceDefault().then(data => defaultNetwork = data);
si.networkInterfaces().then(data => {
    defaultNetwork = data.filter(networkInterface => networkInterface.iface === defaultNetwork)[0];
});


setInterval(function() {
    si.networkStats().then(data => {
        if(totalDownload.length > maxValueOfArray){
            totalDownload.shift();
            totalUpload.shift()
        }
        
        totalDownload.push((data[0].rx_sec / (1024*1024)).toFixed(2));
        totalUpload.push((data[0].tx_sec / (1024*1024)).toFixed(2));   
        
        totalDownloadSize += data[0].rx_sec;
        totalUploadSize += data[0].tx_sec;

        console.clear();

        console.log('       ' + chalk.blue(notifierText + ' download')  + ' ' + chalk.green(notifierText + ' upload') );

        console.log (asciichart.plot ([ totalDownload, totalUpload ], config) + '\n')

        console.log('       ' + chalk.green( '▶ ' + defaultNetwork?.iface + ' ') + chalk.keyword('orange')( '▶ ' + defaultNetwork?.ip4 + ' ') 
        + chalk.yellowBright( '▶ ' + defaultNetwork?.mac + ' ') + chalk.blue( '▶ ' + defaultNetwork?.type + ' '));

        if(data[0].operstate !== 'up'){
            console.log('       ' + chalk.whiteBright('Status : ') + chalk.redBright( data[0].operstate));
            if(beepCount % maxBeepCount !== 0){
                beeper();
                beepCount ++;
            }
        }
        else{
            console.log('       ' + chalk.whiteBright('Status : ') + chalk.yellowBright( data[0].operstate))
            beepCount=1;
        }

        console.log('       ' + chalk.blue('Download: ' + bytesToSize(data[0].rx_sec)) + chalk.green( ' Upload: ' + bytesToSize(data[0].tx_sec)));
        console.log('       ' + chalk.blue('Total Download: ' + bytesToSize(totalDownloadSize) + chalk.green( ' Total Upload: ' + bytesToSize(totalUploadSize))));
        if (notifier.update && notifier.update.latest > pkg.version ) {
            console.log(boxen('Update available ' + pkg.version + ' → ' + chalk.green(notifier.update.latest) + '\n' + 'Run ' + chalk.blue('npm i -g network-pocket') +
             ' to update after terminate network-pocket' , {align: 'center' , margin:{left: 7} , borderColor: 'green' }));
   
        }
        
    });
}, 1000)


function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
 }
