# Network Pocket

 ![Logo](https://imgur.com/huejlyk.gif)

## Overview
The `network-pocket` is a command-line tool built with Node.js. It provides real-time monitoring of network statistics, including download and upload speeds, network interface information, and update notifications.

## Features
- **Real-time Monitoring**: Constantly displays download and upload speeds in a graphical ASCII chart.
- **Network Interface Details**: Shows details about the default network interface such as IP address, MAC address, and type.
- **Status Notifications**: Provides status notifications when the network state changes.
- **Update Notifications**: Alerts the user about available updates for the tool.

## Dependencies
- `systeminformation`: Fetches system and network information.
- `asciichart`: Generates ASCII charts for visual representation.
- `chalk`: Adds color styles to the console output.
- `update-notifier`: Checks for updates and notifies the user.
- `boxen`: Creates a colored box for update notifications.
- `beeper`: Generates system beeps for notifications.
- `cli-cursor`: Manages the visibility of the cursor in the command line interface.

## Functionality
The tool initializes by fetching default network interface information and starts continuously monitoring network statistics using `systeminformation`. The key functionalities include:
- **Graphical Representation**: Utilizes `asciichart` to create graphical representations of download and upload speeds in real-time.
- **Network Interface Display**: Presents detailed information about the default network interface including IP address, MAC address, and type.
- **Status Updates**: Notifies the user of changes in network status (e.g., "up" or "down") and triggers system beeps for attention.
- **Update Alerts**: Utilizes `update-notifier` to check for available updates and displays notifications when updates are available.

## Usage
1. Install the tool: `npm install -g network-pocket`
2. Run the tool in the terminal: `network-pocket`

## Future Improvements
- Adding additional statistical metrics.
- Enhancing user interface for better interaction.
- Supporting more customization options.

-------

