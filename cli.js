#!/usr/bin/env node

const si = require('systeminformation');
const asciichart = require ('asciichart');
const chalk = require('chalk');
const notifierText = '■';

const totalDownload = [0];
const totalUpload = [0];
let totalDownloadSize = 0;
let totalUploadSize = 0;
let defaultNetwork;

const maxValueOfArray = 60;

var config = {
    colors: [
        asciichart.blue,
        asciichart.green,
    ],
    height:  10,
    min:1,
}

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

        console.log('       ' + chalk.green( '▶ ' + defaultNetwork?.iface + ' ') + chalk.keyword('orange')( '▶ ' + defaultNetwork?.ip4 + ' ') 
        + chalk.yellowBright( '▶ ' + defaultNetwork?.mac + ' ') + chalk.blue( '▶ ' + defaultNetwork?.type + ' '));

        data[0].operstate === 'up' ? console.log('       ' + chalk.whiteBright('Status : ') + chalk.yellowBright( data[0].operstate)) : console.log('       ' + chalk.whiteBright('Status : ') + chalk.redBright( data[0].operstate));

        console.log('       ' + chalk.blue('Download: ' + bytesToSize(data[0].rx_sec)) + chalk.green( ' Upload: ' + bytesToSize(data[0].tx_sec)));
        console.log('       ' + chalk.blue('Total Download: ' + bytesToSize(totalDownloadSize) + chalk.green( ' Total Upload: ' + bytesToSize(totalUploadSize))));
        


    });
    
    console.clear();
    console.log('       ' + chalk.blue(notifierText + ' download')  + ' ' + chalk.green(notifierText + ' upload') );
    console.log (asciichart.plot ([ totalDownload, totalUpload ], config) + '\n')
   
   
}, 1000)


function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
 }
