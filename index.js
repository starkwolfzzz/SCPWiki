const express = require('express');
const app = express();
const port = 3000;

app.listen(port /*, () => console.log(`app listening at http://localhost:${port}`)*/ );

// ================= START BOT CODE ===================

require('dotenv').config();
const config = require("./config.json");

const {
    Client,
    Intents,
    Collection,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS]
});

const request = require(`request`);
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const wait = require('util').promisify(setTimeout);

const rp = require('request-promise');
const cheerio = require('cheerio');

const sharp = require("sharp")
const { ImgurClient } = require('imgur');
let imgurClient = new ImgurClient({ clientId: process.env['IMGURID'] });
var Vibrant = require('node-vibrant')

const fs = require('fs');
const path = require('path');
var reader = require("buffered-reader");
var BinaryReader = reader.BinaryReader;
var DataReader = reader.DataReader;

const GoogleImages = require('google-images');

const googleClient = new GoogleImages(process.env['GOOGLESEARCH'], process.env['GOOGLEAPI']);

const TOKEN = process.env['TOKEN'];
const CLIENT_ID = process.env['CLIENTID'];
const GUILD_ID = process.env['GUILD_ID'];

client.prefix = config.prefix;

function changeConfig(data) {
    filePath = "./config.json";
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}

const slashCommands = [];
client.slashCommands = new Collection();

const topSlashBars = 60
console.log(insertChar("_", topSlashBars))
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
            var neededSpace1 = Math.round(((topSlashBars - 1) - ('Loaded: ' + dir.substring(dir.indexOf("\\") + 1, dir.length) + "/" + file).length) / 2);
            var neededSpace2 = Math.floor(((topSlashBars - 1) - ('Loaded: ' + dir.substring(dir.indexOf("\\") + 1, dir.length) + "/" + file).length) / 2);
            console.log("|" + insertChar(" ", neededSpace1) + '\x1b[32mLoaded:\x1b[0m \x1b[33m' + dir.substring(dir.indexOf("\\") + 1, dir.length).replace("\\", "/") + "\x1b[0m/\x1b[36m" + file + "\x1b[0m" + insertChar(" ", neededSpace2) + "|");
            if (slashCommand.Perms) slashCommand.defaultPermission = false;

            slashCommands.push(slashCommand);
            client.slashCommands.set(slashCommand.name, slashCommand);
        }
    }
}

readSlashCommands('slashCommands')
console.log("|" + insertChar(" ", topSlashBars - 1) + "|")
console.log(insertChar("‾", topSlashBars))

const commands = [];
client.commands = new Collection();

var topBars = 60;
console.log(insertChar("_", topBars))
console.log("|" + insertChar(" ", Math.round(((topBars - 1) - (`Commands`).length) / 2)) + "Commands" + insertChar(" ", Math.floor(((topBars - 1) - (`Commands`).length) / 2)) + "|")
console.log("|" + insertChar("_", topBars - 1) + "|")
console.log("|" + insertChar(" ", topBars - 1) + "|")
const readCommands = dir => {
    const commandFiles = fs.readdirSync(path.join(__dirname, dir));
    for (const file of commandFiles) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))
        if (stat.isDirectory()) {
            readCommands(path.join(dir, file))
        } else {
            const command = require(path.join(__dirname, dir, file));
            var neededSpace1 = Math.round(((topBars - 1) - ('Loaded: ' + dir.substring(dir.indexOf("\\") + 1, dir.length) + "/" + file).length) / 2);
            var neededSpace2 = Math.floor(((topBars - 1) - ('Loaded: ' + dir.substring(dir.indexOf("\\") + 1, dir.length) + "/" + file).length) / 2);
            console.log("|" + insertChar(" ", neededSpace1) + '\x1b[32mLoaded:\x1b[0m \x1b[33m' + dir.substring(dir.indexOf("\\") + 1, dir.length).replace("\\", "/") + "\x1b[0m/\x1b[36m" + file + "\x1b[0m" + insertChar(" ", neededSpace2) + "|");
            commands.push(command);
            client.commands.set(command.name, command);
        }
    }
}

function insertChar(char, frequency) {
    var num = 1;
    var c = char;
    for (i = 1; i < frequency; i++) {
        c += char;
        num++
    }
    return (c);
}

readCommands('commands')
console.log("|" + insertChar(" ", topBars - 1) + "|")
console.log(insertChar("‾", topBars))

client.login(TOKEN);

client.on('ready', async() => {
    var type = "playing";
    client.user.setStatus("dnd");
    client.user.setActivity("SCP Containment Breach Unity", {
        type: `PLAYING`
    });

    //Slash commands
    topBars = 60;
    console.log(insertChar("_", topBars))
    console.log("|" + insertChar(" ", Math.round(((topBars - 1) - (`Updated Slash Guilds`).length) / 2)) + "Updated Slash Guilds" + insertChar(" ", Math.floor(((topBars - 1) - (`Updated Slash Guilds`).length) / 2)) + "|")
    console.log("|" + insertChar("_", topBars - 1) + "|")
    console.log("|" + insertChar(" ", topBars - 1) + "|")

    var bar = new Promise((resolve, reject) => {
        var size = client.guilds.cache.size;
        var sizeW = size - 1;
        var n = 0;
        for (i = 0; i < size; i++) {
            const mainGuild = client.guilds.cache.get(client.guilds.cache.map(guild => guild.id)[i]);
            mainGuild.commands.set(slashCommands).then((cmd) => {
                const Roles = (commandName) => {
                    const cmdPerms = slashCommands.find(c => c.name === commandName).Perms;

                    if (!cmdPerms) return null;

                    return mainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms) && !r.managed);
                }

                const fullPermissions = cmd.reduce((accumulator, x) => {
                    const roles = Roles(x.name);
                    if (!roles) return accumulator;

                    const permissions = roles.reduce((a, v) => {
                        return [...a, { id: v.id, type: "ROLE", permission: true }]
                    }, []);

                    return [...accumulator, { id: x.id, permissions }]
                }, []);

                mainGuild.commands.permissions.set({ fullPermissions })
                    .catch((error) => {
                        var neededSpace1 = Math.round(((topBars - 1) - ((mainGuild.name).length)) / 2);
                        var neededSpace2 = Math.floor(((topBars - 1) - ((mainGuild.name).length)) / 2);
                        console.log("|" + insertChar(" ", neededSpace1) + "\x1b[31m" + mainGuild.name + "\x1b[0m" + insertChar(" ", neededSpace2) + "|");
                        if (n == sizeW) {
                            resolve()
                        } else {
                            n += 1;
                        }
                    })
                    .then(() => {
                        var neededSpace1 = Math.round(((topBars - 1) - ((mainGuild.name).length)) / 2);
                        var neededSpace2 = Math.floor(((topBars - 1) - ((mainGuild.name).length)) / 2);
                        console.log("|" + insertChar(" ", neededSpace1) + "\x1b[32m" + mainGuild.name + "\x1b[0m" + insertChar(" ", neededSpace2) + "|");
                        if (n == sizeW) {
                            resolve()
                        } else {
                            n += 1;
                        }
                    });
            })
        }
    })

    bar.then(() => {
        console.log("|" + insertChar(" ", topBars - 1) + "|")
        console.log(insertChar("‾", topBars))
        console.info(`${client.user.tag} is ${client.user.presence.status} and is ${type} ${client.user.presence.activities[0]}`);
        app.get('/', (req, res) => res.send(`${client.user.tag} is ${client.user.presence.status} and is ${type} ${client.user.presence.activities[0]}`));
    })
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    switch (message.channel.name) {
        case "scp":
            if (message.content.toLowerCase().includes("scp")) {
                const channel = message.channel;
                const words = message.content.toLowerCase().replace("-", " ").split(/ +/);
                const listOfNumbers = [];
                for (i = 0; i < words.length; i++) {
                    var word = words[i];
                    if (word == "scp") {
                        listOfNumbers.push(words[i + 1]);
                    }
                }
                
                for (i = 0; i < listOfNumbers.length; i++) {
                    var url = "https://the-scp.foundation/object/scp-" + listOfNumbers[i];
                    if (UrlExists(url)) {
                        rp(url)
                            .then(async function(html) {
                                const $ = cheerio.load(html);
                                const itemNo = $('#item-number').contents().filter(function() { return this.type === 'text'; }).text();
                                const itemUrl = url;
                                const itemName = $('.scp-nickname').text();
                                var itemClass = $('.scp-object-class').attr("alt");
                                var itemClassImg = $('.scp-object-class').attr("src");
                                var itemClassColor = "#882244";
                                var itemImage = $('.scp-image').attr("src");
                                if(!itemImage) {
                                    await googleClient.search(itemNo.replace("-", " "))
                                    .then(images => {
                                        for(i = 0; i < images.length; i++){
                                            if(!images[i].url.includes("i.ytimg.com")){
                                                itemImage = images[i].url;
                                                break;
                                            }
                                        }
                                    });
                                }

                                var itemDescriptionSegmnt = $('.scp-description > p').first().contents().filter(function() { return this.type === 'text'; }).text().substring(0, 1024);
                                var fullItemDescriptionSegmnt = $('.scp-description > p').text();
                                var bigDesc = $('.scp-description > p').length > 1;

                                const itemSpecialContainmentProc = $('.scp-special-containment-procedures > p').first().contents().filter(function() { return this.type === 'text'; }).text().substring(0, 1024);
                                const fullItemSpecialContainmentProc = $('.scp-special-containment-procedures > p').text();
                                var bigCont = $('.scp-special-containment-procedures > p').length > 1;

                                switch(url){
                                    case "https://the-scp.foundation/object/scp-001":
                                        itemClassImg = "https://the-scp.foundation/assets/images/template/none.svg";
                                        itemClass = "None";
                                        itemImage = "";
                                        itemDescriptionSegmnt = "**GENERAL NOTICE 001-Alpha**: In order to prevent knowledge of SCP-001 from being leaked, several/no false SCP-001 files have been created alongside the true file/files. All files concerning the nature of SCP-001, including the decoy/decoys, are protected by a memetic kill agent designed to immediately cause cardiac arrest in any nonauthorized personnel attempting to access the file. Revealing the true nature/natures of SCP-001 to the general public is cause for execution, except as required under ████-███-██████."    
                                    break;
                                    case "https://the-scp.foundation/object/scp-2718":
                                        itemClassImg = "https://the-scp.foundation/assets/images/template/esoteric.svg";
                                        itemImage = "";
                                    break;
                                }

                                var itemFullFootNotes = $('.footnote-footer').get().map((el) => { return $(el).text() }).join("\n");
                                var itemFootNotes = "";
                                var bigNotes = false;
                                if ($('.footnote-footer').get().map((el) => { return $(el).text() }).join("\n").length <= 1024) {
                                    itemFootNotes = $('.footnote-footer').get().map((el) => { return $(el).text() }).join("\n")
                                } else {
                                    bigNotes = true;
                                    var footNotes = $('.footnote-footer').get().map((el) => { return $(el).text() });
                                    while (footNotes.join("\n").length > 1024) {
                                        var popped = footNotes.pop();
                                        if (footNotes.join("\n").length <= 1024) itemFootNotes = footNotes.join("\n")
                                    }
                                }

                                const itemTags = $('.scp-tag').get().map((el) => {
                                    return { title: $(el).find('span').text() }
                                })
                                var bigTags = itemTags.length > 3;

                                var download = function(uri, filename, callback) {
                                    request.head(uri, function(err, res, body) {
                                        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                                    });
                                };


                                if (!fs.existsSync(`images/${itemClass}.png`)) {
                                    var text = [""];
                                    new DataReader("images/server.txt", { encoding: "utf8" })
                                        .on("error", function(error) {
                                            console.log("error: " + error);
                                        })
                                        .on("line", function(line) {
                                            text.push(line);
                                        })
                                        .on("end", () => {
                                            var found = false;

                                            for (i = 0; i < text.length; i++) {
                                                if (text[i].includes(`${itemClass} =`)) {
                                                    download(itemClassImg, `images/${itemClass}.svg`, function() {
                                                        sharp(`images/${itemClass}.svg`)
                                                            .png()
                                                            .toFile("images/" + itemClass + ".png")
                                                            .then(function(info) {
                                                                found = true;
                                                                let v = new Vibrant(`images/${itemClass}.png`)
                                                                v.getPalette((err, palette) => {
                                                                    itemClassColor = palette.Vibrant.hex;
                                                                    itemClassImg = text[i].substr(text[i].indexOf("=") + 2);
                                                                    sendMsg()
                                                                })
                                                            })
                                                            .catch(function(err) {
                                                                console.log(err)
                                                            })
                                                    });
                                                    break;
                                                }

                                                if (!found && i == text.length - 1) {
                                                    download(itemClassImg, `images/${itemClass}.svg`, function() {
                                                        sharp(`images/${itemClass}.svg`)
                                                            .png()
                                                            .toFile("images/" + itemClass + ".png")
                                                            .then(async function(info) {
                                                                const response = await imgurClient.upload("images/" + itemClass + ".png");
                                                                fs.appendFile('images/server.txt', `\n${itemClass} = ${response.data.link}`, (err) => {
                                                                    if (err) throw err;
                                                                    itemClassImg = response.data.link;
                                                                    sendMsg();
                                                                });
                                                            })
                                                            .catch(function(err) {
                                                                console.log(err)
                                                            })
                                                    });
                                                }
                                            }
                                        })
                                        .read();
                                } else {
                                    let v = new Vibrant(`images/${itemClass}.png`)
                                    v.getPalette((err, palette) => {
                                        itemClassColor = palette.Vibrant.hex;
                                        var text = [""];
                                        new DataReader("images/server.txt", { encoding: "utf8" })
                                            .on("error", function(error) {
                                                console.log("error: " + error);
                                            })
                                            .on("line", function(line) {
                                                text.push(line);
                                            })
                                            .on("end", async() => {
                                                var found = false;

                                                for (i = 0; i < text.length; i++) {
                                                    if (text[i].includes(`${itemClass} =`)) {
                                                        found = true;
                                                        itemClassImg = text[i].substr(text[i].indexOf("=") + 2);
                                                        sendMsg()
                                                        break;
                                                    }

                                                    if (!found && i == text.length - 1) {
                                                        const response = await imgurClient.upload("images/" + itemClass + ".png");
                                                        fs.appendFile('images/server.txt', `\n${itemClass} = ${response.data.link}`, (err) => {
                                                            if (err) throw err;
                                                            itemClassImg = response.data.link;
                                                            sendMsg();
                                                        });
                                                    }
                                                }
                                            })
                                            .read();
                                    })
                                }

                                async function sendMsg(l = null, rpl = null) {
                                    var originalEmbed = new MessageEmbed()
                                        .setColor(itemClassColor)
                                        //.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
                                        .setTimestamp();

                                    if (itemNo && itemName) originalEmbed.setTitle(itemNo + " - " + itemName)

                                    if (itemUrl) originalEmbed.setURL(itemUrl)

                                    if (itemClassImg) originalEmbed.setThumbnail(itemClassImg)

                                    if (itemDescriptionSegmnt) originalEmbed.addField(`Description`, itemDescriptionSegmnt)

                                    if (itemSpecialContainmentProc) originalEmbed.addField("Special Containment Procedures", itemSpecialContainmentProc)

                                    if (itemImage) originalEmbed.setImage(itemImage)

                                    if (itemClass && itemClassImg) originalEmbed.setFooter(itemClass, itemClassImg)

                                    if (itemFootNotes) originalEmbed.addField("Footnotes", itemFootNotes)

                                    for (i = 0; i < 3; i++) {
                                        if (itemTags[i]) {
                                            if (i == 0) originalEmbed.addField('Object Class', itemTags[i].title, true)
                                            else originalEmbed.addField('Object Tag', itemTags[i].title, true)
                                        }
                                    };

                                    const originalRow = new MessageActionRow();

                                    function makeid(length) {
                                        var result = '';
                                        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                                        var charactersLength = characters.length;
                                        for (var i = 0; i < length; i++) {
                                            result += characters.charAt(Math.floor(Math.random() *
                                                charactersLength));
                                        }
                                        return result;
                                    }

                                    const descId = message.member.user.username.replace(" ", "") + makeid(50);
                                    const contId = message.member.user.username.replace(" ", "") + makeid(50);
                                    const NotesId = message.member.user.username.replace(" ", "") + makeid(50);
                                    const TagsId = message.member.user.username.replace(" ", "") + makeid(50);

                                    if (bigDesc) originalRow.addComponents(new MessageButton()
                                        .setCustomId(descId)
                                        .setLabel('View Full Description')
                                        .setStyle('PRIMARY'));

                                    if (bigCont) originalRow.addComponents(new MessageButton()
                                        .setCustomId(contId)
                                        .setLabel('View Full Special Containment Procedures')
                                        .setStyle('PRIMARY'));

                                    if (bigNotes) originalRow.addComponents(new MessageButton()
                                        .setCustomId(NotesId)
                                        .setLabel('View All Footnotes')
                                        .setStyle('PRIMARY'));

                                    if (bigTags) originalRow.addComponents(new MessageButton()
                                        .setCustomId(TagsId)
                                        .setLabel('View All Tags')
                                        .setStyle('PRIMARY'));

                                    var reply;

                                    if (l == null) {
                                        if (originalRow.components.length > 0) {
                                            await message.reply({ embeds: [originalEmbed], components: [originalRow] }).then(msg => {
                                                reply = msg;
                                            });
                                        } else {
                                            await message.reply({ embeds: [originalEmbed] }).then(msg => {
                                                reply = msg;
                                            });
                                        }
                                    } else {
                                        await l.update({ embeds: [originalEmbed], components: [originalRow] });
                                        reply = rpl;
                                    }

                                    const filter = i => i.message.id === reply.id && i.user.id === message.member.id;

                                    const collector = message.channel.createMessageComponentCollector({ filter, time: 100000 });

                                    if (collector) {
                                        collector.on('collect', async i => {
                                            if (i.customId === descId) {
                                                collector.stop(`Found Interaction: ${i.customId}`);
                                                descriptionCollected(i, reply);
                                            } else if (i.customId === contId) {
                                                collector.stop(`Found Interaction: ${i.customId}`);
                                                specialContCollected(i, reply);
                                            } else if (i.customId === NotesId) {
                                                collector.stop(`Found Interaction: ${i.customId}`);
                                                footnotesCollected(i, reply);
                                            } else if (i.customId === TagsId) {
                                                collector.stop(`Found Interaction: ${i.customId}`);
                                                tagsCollected(i, reply);
                                            }
                                        });

                                        collector.on('end', async(collected, reason) => {
                                            var replyy = await channel.messages.fetch(reply.id).catch(() => { return false });
                                            if (!reason.includes("Found Interaction: ") && replyy) {
                                                await reply.edit({ components: [] })
                                            }

                                        });
                                    }
                                }

                                async function descriptionCollected(i, reply, pageNo = 1) {

                                    var chunks = fullItemDescriptionSegmnt.match(/.{1,4050}/g);
                                    //console.log(itemNo, fullItemDescriptionSegmnt.length, chunks.length)

                                    /*for (var p = 0; p < fullItemDescriptionSegmnt.length; p += 4050) {
                                        chunks.push(fullItemDescriptionSegmnt.substring(p, p + 4050));
                                    }*/

                                    var embed = new MessageEmbed()
                                        .setColor(itemClassColor)
                                        //.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
                                        .setTimestamp();

                                    if (itemNo && itemName) embed.setTitle(itemNo + " - " + itemName)

                                    if (itemUrl) embed.setURL(itemUrl)

                                    if (itemClassImg) embed.setThumbnail(itemClassImg)

                                    if (itemImage) embed.setImage(itemImage)

                                    if (fullItemDescriptionSegmnt) embed.setDescription(`**Description**\n ${chunks[pageNo - 1]}`)

                                    if (itemClass && itemClassImg) embed.setFooter(itemClass, itemClassImg)

                                    function makeid(length) {
                                        var result = '';
                                        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                                        var charactersLength = characters.length;
                                        for (var i = 0; i < length; i++) {
                                            result += characters.charAt(Math.floor(Math.random() *
                                                charactersLength));
                                        }
                                        return result;
                                    }

                                    const backId = message.member.user.username.replace(" ", "") + makeid(50);
                                    const previousPgId = message.member.user.username.replace(" ", "") + makeid(50);
                                    const nextPgId = message.member.user.username.replace(" ", "") + makeid(50);

                                    const row = new MessageActionRow();

                                    if (pageNo >= 2) {
                                        if (pageNo == chunks.length) {
                                            row.addComponents(new MessageButton()
                                                .setCustomId(previousPgId)
                                                .setLabel(`Previous Page`)
                                                .setStyle('PRIMARY'));
                                        } else {
                                            row.addComponents(new MessageButton()
                                                .setCustomId(previousPgId)
                                                .setLabel(`Previous Page`)
                                                .setStyle('PRIMARY'));
                                            row.addComponents(new MessageButton()
                                                .setCustomId(nextPgId)
                                                .setLabel(`Next Page`)
                                                .setStyle('PRIMARY'));
                                        }
                                    } else {
                                        if (pageNo != chunks.length) {
                                            row.addComponents(new MessageButton()
                                                .setCustomId(nextPgId)
                                                .setLabel(`Next Page`)
                                                .setStyle('PRIMARY'));
                                        }
                                    }

                                    row.addComponents(new MessageButton()
                                        .setCustomId(backId)
                                        .setLabel(`Back to ${itemNo}`)
                                        .setStyle('PRIMARY'));

                                    await i.update({ embeds: [embed], components: [row] });

                                    const newFilter = p => p.message.id === reply.id && p.user.id === message.member.id;

                                    const newCollector = message.channel.createMessageComponentCollector({ newFilter, time: 100000 });

                                    if (newCollector) {
                                        newCollector.on('collect', async i => {
                                            if (i.customId === backId) {
                                                newCollector.stop(`Found Interaction: ${i.customId}`);
                                                sendMsg(i, reply);
                                            } else if (i.customId === previousPgId) {
                                                newCollector.stop(`Found Interaction: ${i.customId}`);
                                                descriptionCollected(i, reply, pageNo - 1);
                                            } else if (i.customId === nextPgId) {
                                                newCollector.stop(`Found Interaction: ${i.customId}`);
                                                descriptionCollected(i, reply, pageNo + 1);
                                            }
                                        })

                                        newCollector.on('end', async(collected, reason) => {
                                            var replyy = await channel.messages.fetch(reply.id).catch(() => { return false });
                                            if (!reason.includes("Found Interaction: ") && replyy) await reply.edit({ components: [] })
                                        });
                                    }
                                }

                                async function specialContCollected(i, reply, pageNo = 1) {

                                    var chunks = fullItemSpecialContainmentProc.match(/.{1,4050}/g);
                                    //console.log(itemNo, fullItemDescriptionSegmnt.length, chunks.length)

                                    /*for (var p = 0; p < fullItemDescriptionSegmnt.length; p += 4050) {
                                        chunks.push(fullItemDescriptionSegmnt.substring(p, p + 4050));
                                    }*/

                                    var embed = new MessageEmbed()
                                        .setColor(itemClassColor)
                                        //.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
                                        .setTimestamp();

                                    if (itemNo && itemName) embed.setTitle(itemNo + " - " + itemName)

                                    if (itemUrl) embed.setURL(itemUrl)

                                    if (itemClassImg) embed.setThumbnail(itemClassImg)

                                    if (itemImage) embed.setImage(itemImage)

                                    if (fullItemSpecialContainmentProc) embed.setDescription(`**Special Containment Procedures**\n ${chunks[pageNo - 1]}`)

                                    if (itemClass && itemClassImg) embed.setFooter(itemClass, itemClassImg)

                                    function makeid(length) {
                                        var result = '';
                                        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                                        var charactersLength = characters.length;
                                        for (var i = 0; i < length; i++) {
                                            result += characters.charAt(Math.floor(Math.random() *
                                                charactersLength));
                                        }
                                        return result;
                                    }

                                    const backId = message.member.user.username.replace(" ", "") + makeid(50);
                                    const previousPgId = message.member.user.username.replace(" ", "") + makeid(50);
                                    const nextPgId = message.member.user.username.replace(" ", "") + makeid(50);

                                    const row = new MessageActionRow();

                                    if (pageNo >= 2) {
                                        if (pageNo == chunks.length) {
                                            row.addComponents(new MessageButton()
                                                .setCustomId(previousPgId)
                                                .setLabel(`Previous Page`)
                                                .setStyle('PRIMARY'));
                                        } else {
                                            row.addComponents(new MessageButton()
                                                .setCustomId(previousPgId)
                                                .setLabel(`Previous Page`)
                                                .setStyle('PRIMARY'));
                                            row.addComponents(new MessageButton()
                                                .setCustomId(nextPgId)
                                                .setLabel(`Next Page`)
                                                .setStyle('PRIMARY'));
                                        }
                                    } else {
                                        if (pageNo != chunks.length) {
                                            row.addComponents(new MessageButton()
                                                .setCustomId(nextPgId)
                                                .setLabel(`Next Page`)
                                                .setStyle('PRIMARY'));
                                        }
                                    }

                                    row.addComponents(new MessageButton()
                                        .setCustomId(backId)
                                        .setLabel(`Back to ${itemNo}`)
                                        .setStyle('PRIMARY'));

                                    await i.update({ embeds: [embed], components: [row] });

                                    const newFilter = p => p.message.id === reply.id && p.user.id === message.member.id;

                                    const newCollector = message.channel.createMessageComponentCollector({ newFilter, time: 100000 });

                                    if (newCollector) {
                                        newCollector.on('collect', async i => {
                                            if (i.customId === backId) {
                                                newCollector.stop(`Found Interaction: ${i.customId}`);
                                                sendMsg(i, reply);
                                            } else if (i.customId === previousPgId) {
                                                newCollector.stop(`Found Interaction: ${i.customId}`);
                                                specialContCollected(i, reply, pageNo - 1);
                                            } else if (i.customId === nextPgId) {
                                                newCollector.stop(`Found Interaction: ${i.customId}`);
                                                specialContCollected(i, reply, pageNo + 1);
                                            }
                                        })

                                        newCollector.on('end', async(collected, reason) => {
                                            var replyy = await channel.messages.fetch(reply.id).catch(() => { return false });
                                            if (!reason.includes("Found Interaction: ") && replyy) await reply.edit({ components: [] })
                                        });
                                    }
                                }

                                async function footnotesCollected(i, reply) {
                                    var embed = new MessageEmbed()
                                        .setColor(itemClassColor)
                                        //.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
                                        .setTimestamp();

                                    if (itemNo && itemName) embed.setTitle(itemNo + " - " + itemName)

                                    if (itemUrl) embed.setURL(itemUrl)

                                    if (itemClassImg) embed.setThumbnail(itemClassImg)

                                    if (itemImage) embed.setImage(itemImage)

                                    if (itemFullFootNotes) embed.setDescription(`**Footnotes**\n ${itemFullFootNotes}`)

                                    if (itemClass && itemClassImg) embed.setFooter(itemClass, itemClassImg)

                                    function makeid(length) {
                                        var result = '';
                                        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                                        var charactersLength = characters.length;
                                        for (var i = 0; i < length; i++) {
                                            result += characters.charAt(Math.floor(Math.random() *
                                                charactersLength));
                                        }
                                        return result;
                                    }

                                    const backId = message.member.user.username.replace(" ", "") + makeid(50);

                                    const row = new MessageActionRow();

                                    row.addComponents(new MessageButton()
                                        .setCustomId(backId)
                                        .setLabel(`Back to ${itemNo}`)
                                        .setStyle('PRIMARY'));

                                    await i.update({ embeds: [embed], components: [row] });

                                    const newFilter = p => p.message.id === reply.id && p.user.id === message.member.id;

                                    const newCollector = message.channel.createMessageComponentCollector({ newFilter, time: 100000 });

                                    if (newCollector) {
                                        newCollector.on('collect', async i => {
                                            if (i.customId === backId) {
                                                newCollector.stop(`Found Interaction: ${i.customId}`);
                                                sendMsg(i, reply);
                                            }
                                        })

                                        newCollector.on('end', async(collected, reason) => {
                                            var replyy = await channel.messages.fetch(reply.id).catch(() => { return false });
                                            if (!reason.includes("Found Interaction: ") && replyy) await reply.edit({ components: [] })
                                        });
                                    }
                                }

                                async function tagsCollected(i, reply) {
                                    var embed = new MessageEmbed()
                                        .setColor(itemClassColor)
                                        //.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
                                        .setTimestamp();

                                    if (itemNo && itemName) embed.setTitle(itemNo + " - " + itemName)

                                    if (itemUrl) embed.setURL(itemUrl)

                                    if (itemClassImg) embed.setThumbnail(itemClassImg)

                                    if (itemImage) embed.setImage(itemImage)

                                    if (itemClass && itemClassImg) embed.setFooter(itemClass, itemClassImg)

                                    for (p = 0; p < itemTags.length; p++) {
                                        if (itemTags[p]) {
                                            if (p == 0) embed.addField('Object Class', itemTags[p].title, true)
                                            else embed.addField('Object Tag', itemTags[p].title, true)
                                        }
                                    };

                                    function makeid(length) {
                                        var result = '';
                                        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                                        var charactersLength = characters.length;
                                        for (var i = 0; i < length; i++) {
                                            result += characters.charAt(Math.floor(Math.random() *
                                                charactersLength));
                                        }
                                        return result;
                                    }

                                    const backId = message.member.user.username.replace(" ", "") + makeid(50);

                                    const row = new MessageActionRow();

                                    row.addComponents(new MessageButton()
                                        .setCustomId(backId)
                                        .setLabel(`Back to ${itemNo}`)
                                        .setStyle('PRIMARY'));

                                    await i.update({ embeds: [embed], components: [row] });

                                    const newFilter = p => p.message.id === reply.id && p.user.id === message.member.id;

                                    const newCollector = message.channel.createMessageComponentCollector({ newFilter, time: 100000 });

                                    if (newCollector) {
                                        newCollector.on('collect', async i => {
                                            if (i.customId === backId) {
                                                newCollector.stop(`Found Interaction: ${i.customId}`);
                                                sendMsg(i, reply);
                                            }
                                        })

                                        newCollector.on('end', async(collected, reason) => {
                                            var replyy = await channel.messages.fetch(reply.id).catch(() => { return false });
                                            if (!reason.includes("Found Interaction: ") && replyy) await reply.edit({ components: [] })
                                        });
                                    }
                                }
                            })
                            .catch(function(err) {
                                console.error(err);
                            });
                    }
                }

                function UrlExists(url) {
                    var http = new XMLHttpRequest();
                    http.open('HEAD', url, false);
                    http.send();
                    if (http.status != 404)
                        return true;
                    else
                        return false;
                }
            }
            break;
    }

    if (!message.content.toLowerCase().startsWith(client.prefix)) return;
    const args = message.content.slice(client.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);
    if (!cmd) return;
    try {
        await cmd.execute(client, message, args);
    } catch (error) {
        if (error) console.error(error);
        await message.reply({ content: 'There was an error while executing this command!' });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    // const arguments = [];

    // for(let option of interaction.options.data){
    //   if(option.type === 'SUB_COMMAND'){
    //     option.options?.forEach((x) => {
    //       if(x.value) arguments.push(option.value);
    //     });
    //   } else if(option.value) arguments.push(option.value)
    // }
    try {
        await command.execute(client, interaction /*, arguments*/ );
    } catch (error) {
        if (error) console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

exports.changeCfg = function(prefix, volume) {
    changeConfig({ prefix, volume })
}