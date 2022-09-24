const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'eventHandler',
    async execute(client) {
        const topEventBars = 60
        console.log(" " + insertChar("_", (topEventBars - 1)))
        console.log("|" + insertChar(" ", Math.round(((topEventBars - 1) - (`Events`).length) / 2)) + "Events" + insertChar(" ", Math.floor(((topEventBars - 1) - (`Events`).length) / 2)) + "|")
        console.log("|" + insertChar("_", topEventBars - 1) + "|")
        console.log("|" + insertChar(" ", topEventBars - 1) + "|")
        const readEvents = dir => {
            const eventFiles = fs.readdirSync(path.join(__dirname, dir));
            for (const file of eventFiles) {
                const stat = fs.lstatSync(path.join(__dirname, dir, file))
                if (stat.isDirectory()) {
                    readEvents(path.join(dir, file))
                } else {
                    const event = require(path.join(__dirname, dir, file));
                    var filePathBars = ('Loaded: ' + dir.substring(dir.indexOf("\\") + 1, dir.length).replace("\\", "/").replace("../", "").replace("\\", "/") + "/" + file);
                    var filePath = (dir.substring(dir.indexOf("\\") + 1, dir.length).replace("\\", "/").replace("../", "").replace("\\", "/") + "/" + file);

                    if(filePathBars.length > (topEventBars-2)){
                      filePath = filePath.substring(0, 46) + "...";
                      filePathBars = filePathBars.substring(0, 57) + "...";
                    }
            
                    var neededSpace1 = (Math.round(((topEventBars - 1) - filePathBars.length) / 2) == 1) ? Math.floor(((topEventBars - 1) - filePathBars.length) / 2) : Math.round(((topEventBars - 1) - filePathBars.length) / 2);
                    var neededSpace2 = Math.floor(((topEventBars - 1) - filePathBars.length) / 2);
                    console.log("|" + insertChar(" ", neededSpace1) + '\x1b[32mLoaded:\x1b[0m \x1b[33m' + filePath + "\x1b[0m" + /*"/\x1b[36m" + file + "\x1b[0m"*/ insertChar(" ", neededSpace2) + "|");

                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(client, ...args));
                    } else {
                        client.on(event.name, (...args) => event.execute(client, ...args));
                    }
                }
            }
        }

        readEvents('../events/client')
        console.log("|" + insertChar(" ", topEventBars - 1) + "|")
        console.log(" " + insertChar("‾", (topEventBars - 1)))

        function insertChar(char, frequency) {
            var num = 1;
            var c = char;
            for (i = 1; i < frequency; i++) {
                c += char;
                num++
            }
            return (c);
        }
    },
}