#!/usr/bin/env node
const si = require('systeminformation');
const asciichart = require('asciichart');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const boxen = require('boxen');
const beeper = require('beeper');
const cliCursor = require('cli-cursor');

const notifierText = '■';
const updateCheckInterval = 0;
const maxValueOfArray = 60;
const maxBeepCount = 6;

let totalDownload = [0];
let totalUpload = [0];
let totalDownloadSize = 0;
let totalUploadSize = 0;
let defaultNetwork;
let beepCount = 1;

cliCursor.hide();

const chartConfig = {
    colors: [
        asciichart.lightblue,
        asciichart.green,
    ],
    height: 10,
    min: 1,
};

const pkg = require('./package.json');
const notifier = updateNotifier({
    pkg: {
        name: pkg.name,
        version: pkg.version,
    },
    isGlobal: true,
    shouldNotifyInNpmScript: true,
    updateCheckInterval,
});

async function init() {
    try {
        defaultNetwork = await si.networkInterfaceDefault();
        const networkInterfaces = await si.networkInterfaces();
        defaultNetwork = networkInterfaces.find(networkInterface => networkInterface.iface === defaultNetwork);
    } catch (error) {
        console.error('Error fetching network information:', error);
    }
}

async function updateNetworkStats() {
    try {
        const data = await si.networkStats();
        if (totalDownload.length > maxValueOfArray) {
            totalDownload.shift();
            totalUpload.shift();
        }

        totalDownload.push((data[0].rx_sec / (1024 * 1024)).toFixed(2));
        totalUpload.push((data[0].tx_sec / (1024 * 1024)).toFixed(2));

        totalDownloadSize += data[0].rx_sec;
        totalUploadSize += data[0].tx_sec;

        console.clear();

        console.log('       ' + chalk.blueBright(notifierText + ' download') + ' ' + chalk.green(notifierText + ' upload'));

        console.log(asciichart.plot([totalDownload, totalUpload], chartConfig) + '\n');

        console.log('       ' + chalk.green('▶ ' + defaultNetwork?.iface + ' ') + chalk.keyword('orange')('▶ ' + defaultNetwork?.ip4 + ' ')
            + chalk.yellowBright('▶ ' + defaultNetwork?.mac + ' ') + chalk.redBright('▶ ' + defaultNetwork?.type + ' '));

        if (data[0].operstate !== 'up') {
            console.log('       ' + chalk.whiteBright('Status : ') + chalk.redBright(data[0].operstate));
            if (beepCount % maxBeepCount !== 0) {
                beeper();
                beepCount++;
            }
        } else {
            console.log('       ' + chalk.whiteBright('Status : ') + chalk.yellowBright(data[0].operstate))
            beepCount = 1;
        }

        console.log('       ' + chalk.blueBright('Download: ' + bytesToSize(data[0].rx_sec)) + chalk.green(' Upload: ' + bytesToSize(data[0].tx_sec)));
        console.log('       ' + chalk.blueBright('Total Download: ' + bytesToSize(totalDownloadSize) + chalk.green(' Total Upload: ' + bytesToSize(totalUploadSize))));
        if (notifier.update && notifier.update.latest > pkg.version) {
            console.log(boxen('Update available ' + pkg.version + ' → ' + chalk.green(notifier.update.latest) + '\n' + 'Run ' + chalk.blue('npm i -g network-pocket') +
                ' to update after terminate network-pocket', { align: 'center', margin: { left: 7 }, borderColor: 'green' }));

        }

    } catch (error) {
        console.error('Error updating network stats:', error);
    }
}

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

setInterval(updateNetworkStats, 1000);
init(); // Initialize network info
