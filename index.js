const express = require('express');
const app = express();
const port = 25593;

app.listen(port /*, () => console.log(`app listening at http://localhost:${port}`)*/ );

// ================= START BOT CODE ===================

require('dotenv').config();

const {
    Client,
    Intents
} = require('discord.js');

const client = new Client({
    partials: ["CHANNEL"],
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
    ]
});

const fs = require('fs');
const path = require('path');

if(fs.existsSync("./dev")){
    client.devMode = true;
}

function changeConfig(data) {
    let filePath = "./config.json";
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}

const readHandlers = async dir => {
    const handlerFiles = fs.readdirSync(path.join(__dirname, dir));
    for (const file of handlerFiles) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))
        if (stat.isDirectory()) {
            readHandlers(path.join(dir, file))
        } else {
            const handler = require(path.join(__dirname, dir, file));
            try {
                await handler.execute(client);
            } catch (error) {
                if (error) console.error(error);
            }
        }
    }
}

readHandlers('handlers')

client.login(process.env['TOKEN']);

client.on(`rateLimit`, (data) => {
    console.log(data)
})

module.exports.changeCfg = function(prefix) {
    changeConfig({ prefix })
}