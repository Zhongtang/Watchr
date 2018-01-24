const fs = require('fs')
const path = require('path')

module.exports = {
    // load all monitor strategies
    load: () => {
        fs.readdirSync(__dirname).forEach((monitorStrategyFile) => {
            if (monitorStrategyFile === 'index.js') {
                return
            }
            if (monitorStrategyFile === 'load.js') {
                console.error('[WARNING] Not reloading load function')
                return
            }

            // e.g. static => require('./staticMonitor.js')
            // TODO: default key to path.basename(monitorStrategyFile, '.js')
            let monitorStrategy = require(path.join(__dirname, monitorStrategyFile))
            module.exports[monitorStrategy.name()] = monitorStrategy;
        });
    }
}
