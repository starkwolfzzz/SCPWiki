const config = require("../../../config.json");
const { Client } = require(`discord.js`);
const express = require("express");
const app = express();
var mysql = require("mysql");

var errors = "";

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   * @returns
   */
  async execute(client) {
    var type = "playing";
    client.user.setStatus("dnd");
    client.user.setActivity("SCP Containment Breach Unity", {
      type: `${type.toUpperCase()}`,
    });

    if (client.devMode) {
      var type = "playing";
      client.user.setStatus("idle");
      client.user.setActivity("Under Development!", {
        type: `${type.toUpperCase()}`,
      });
    }

    //Slash commands
    topBars = 60;
    console.log(insertChar("_", topBars));
    console.log(
      "|" +
        insertChar(
          " ",
          Math.round((topBars - 1 - `Updated Guilds`.length) / 2)
        ) +
        "Updated Guilds" +
        insertChar(
          " ",
          Math.floor((topBars - 1 - `Updated Guilds`.length) / 2)
        ) +
        "|"
    );
    console.log("|" + insertChar("_", topBars - 1) + "|");
    console.log("|" + insertChar(" ", topBars - 1) + "|");

    var bar = new Promise(async (resolve, reject) => {
      var size = client.guilds.cache.size;
      var sizeW = size - 1;
      var n = 0;
      for (i = 0; i < size; i++) {
        if (client.devMode) {
          mainGuild = client.guilds.cache.get(process.env["GUILD_ID"]);
          i = size;
          n = sizeW;
        } else {
          mainGuild = client.guilds.cache.get(
            client.guilds.cache.map((guild) => guild.id)[i]
          );
        }

        mainGuild.commands
          .set(client.slashCommands)
          .then((cmd) => {
            const Roles = (commandName) => {
              const cmdPerms = client.slashCommands.find(
                (c) => c.name === commandName
              ).Perms;

              if (!cmdPerms) return null;

              return mainGuild.roles.cache.filter(
                (r) => r.permissions.has(cmdPerms) && !r.managed
              );
            };

            var neededSpace1 = Math.round(
              (topBars - 1 - mainGuild.name.length) / 2
            );
            var neededSpace2 = Math.floor(
              (topBars - 1 - mainGuild.name.length) / 2
            );
            console.log(
              "|" +
                insertChar(" ", neededSpace1) +
                "\x1b[32m" +
                mainGuild.name +
                "\x1b[0m" +
                insertChar(" ", neededSpace2) +
                "|"
            );
            if (n == sizeW) {
              resolve();
            } else {
              n += 1;
            }
          })
          .catch((error) => {
            errors += error;
            var neededSpace1 = Math.round(
              (topBars - 1 - mainGuild.name.length) / 2
            );
            var neededSpace2 = Math.floor(
              (topBars - 1 - mainGuild.name.length) / 2
            );
            console.log(
              "|" +
                insertChar(" ", neededSpace1) +
                "\x1b[31m" +
                mainGuild.name +
                "\x1b[0m" +
                insertChar(" ", neededSpace2) +
                "|"
            );
            if (n == sizeW) {
              resolve();
            } else {
              n += 1;
            }
          });
      }
    });

    bar.then(() => {
      console.log("|" + insertChar(" ", topBars - 1) + "|");
      console.log(insertChar("‾", topBars));

      console.info(
        `\x1b[33m${client.user.tag} \x1b[0mis \x1b[32m${client.user.presence.status} \x1b[0mand is \x1b[35m${type} ${client.user.presence.activities[0]}\x1b[0m`
      );
      app.get("/", (req, res) =>
        res.send(
          `${client.user.tag} is ${client.user.presence.status} and is ${type} ${client.user.presence.activities[0]}`
        )
      );

      if (errors != "") console.log(errors);

      if (client.devMode)
        console.info("Development Mode is \x1b[32mEnabled\x1b[0m!");

      var db = mysql.createConnection({
        host: "130.61.140.70",
        user: "u13_GrpgZwOYe8",
        password: "BjY^oTsSbRWL5!YABalE5YC+",
        database: "s13_Main_SCP",
        port: 3306,
      });

      db.connect(function (err) {
        if (err) throw err;
        console.info("Database \x1b[32mConnected\x1b[0m!");
      });
      client.db = db;
    });

    function insertChar(char, frequency) {
      var num = 1;
      var c = char;
      for (i = 1; i < frequency; i++) {
        c += char;
        num++;
      }
      return c;
    }
  },
};
