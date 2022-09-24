const {
    Collection
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'slashHandler',
    async execute(client) {
        const slashCommands = [];
        client.slashCommands = new Collection();

        const topSlashBars = 60
        console.log(" " + insertChar("_", (topSlashBars - 1)))
        console.log("|" + insertChar(" ", Math.round(((topSlashBars - 1) - (`Slash Commands`).length) / 2)) + "Slash Commands" + insertChar(" ", Math.floor(((topSlashBars - 1) - (`Slash Commands`).length) / 2)) + "|")
        console.log("|" + insertChar("_", topSlashBars - 1) + "|")
        console.log("|" + insertChar(" ", topSlashBars - 1) + "|")
        const readSlashCommands = dir => {
            const slashCommandFiles = fs.readdirSync(path.join(__dirname, dir));
            for (const file of slashCommandFiles) {
                const stat = fs.lstatSync(path.join(__dirname, dir, file))
                if (stat.isDirectory()) {
                    readSlashCommands(path.join(dir, file))
                } else {
                    const slashCommand = require(path.join(__dirname, dir, file));
                    var filePathBars = ('Loaded: ' + dir.substring(dir.indexOf("\\") + 1, dir.length).replace("\\", "/").replace("../", "").replace("\\", "/") + "/" + file);
                    var filePath = (dir.substring(dir.indexOf("\\") + 1, dir.length).replace("\\", "/").replace("../", "").replace("\\", "/") + "/" + file);

                    if(filePathBars.length > (topSlashBars-2)){
                      filePath = filePath.substring(0, 46) + "...";
                      filePathBars = filePathBars.substring(0, 57) + "...";
                    }
            
                    var neededSpace1 = (Math.round(((topSlashBars - 1) - filePathBars.length) / 2) == 1) ? Math.floor(((topSlashBars - 1) - filePathBars.length) / 2) : Math.round(((topSlashBars - 1) - filePathBars.length) / 2);
                    var neededSpace2 = Math.floor(((topSlashBars - 1) - filePathBars.length) / 2);
                    console.log("|" + insertChar(" ", neededSpace1) + '\x1b[32mLoaded:\x1b[0m \x1b[33m' + filePath + "\x1b[0m" + /*"/\x1b[36m" + file + "\x1b[0m"*/ insertChar(" ", neededSpace2) + "|");
                    
                    if (slashCommand.Perms) slashCommand.defaultPermission = false;

                    slashCommands.push(slashCommand);
                    client.slashCommands.set(slashCommand.name, slashCommand);
                }
            }
        }

        readSlashCommands('../slashCommands')
        console.log("|" + insertChar(" ", topSlashBars - 1) + "|")
        console.log(" " + insertChar("‾", (topSlashBars - 1)))

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