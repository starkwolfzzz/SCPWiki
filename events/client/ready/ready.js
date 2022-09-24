const config = require("../../../config.json");
const { Client } = require(`discord.js`);
const express = require("express");
const app = express();
const port = 25593;
var mysql = require("mysql-await");

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
    console.log(" " + insertChar("_", (topBars - 1)));
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
      for (p = 0; p < size; p++) {
        const mainGuild = client.devMode
          ? client.guilds.cache.get(process.env["GUILD_ID"])
          : client.guilds.cache.get(
              client.guilds.cache.map((guild) => guild.id)[p]
            );

        if (client.devMode) {
          p = size - 1;
        }

        await mainGuild.commands
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

            var guildName = mainGuild.name;

            if(mainGuild.name.length > (topBars-2)){
              guildName = mainGuild.name.substring(0, 54) + "...";
            }

            var neededSpace1 = ((topBars - 1 - guildName.length) / 2) === 1/2 ? (Math.floor((topBars - 1 - guildName.length) / 2)) : (Math.round((topBars - 1 - guildName.length) / 2));
            var neededSpace2 = Math.floor(
              (topBars - 1 - guildName.length) / 2
            );
            console.log(
              "|" +
                insertChar(" ", neededSpace1) +
                "\x1b[32m" +
                guildName +
                "\x1b[0m" +
                insertChar(" ", neededSpace2) +
                "|"
            );
          }).catch((error) => {
            var guildName = mainGuild.name;
            
            errors += error;
            var neededSpace1 = (((topBars - 1 - guildName.length) / 2) === 1) ? (Math.floor((topBars - 1 - guildName.length) / 2)) : (Math.round((topBars - 1 - guildName.length) / 2));
            var neededSpace2 = Math.floor(
              (topBars - 1 - guildName.length) / 2
            );
            console.log(
              "|" +
                insertChar(" ", neededSpace1) +
                "\x1b[31m" +
                guildName +
                "\x1b[0m" +
                insertChar(" ", neededSpace2) +
                "|"
            );
          });

          if(p == (size - 1)) resolve();
      }
    });

    bar.then(() => {
      console.log("|" + insertChar(" ", topBars - 1) + "|");
      console.log(" " + insertChar("‾", (topBars - 1)));

      console.info(
        `\x1b[33m${client.user.tag} \x1b[0mis \x1b[32m${client.user.presence.status} \x1b[0mand is \x1b[35m${type} ${client.user.presence.activities[0]}\x1b[0m`
      );
      app.get("/", (req, res) =>
        res.send(
          `${client.user.tag} is ${client.user.presence.status} and is ${type} ${client.user.presence.activities[0]}`
        )
      );
      app.listen(port /*, () => console.log(`app listening at http://localhost:${port}`)*/ );

      if (errors != "") console.log(errors);

      if (client.devMode)
        console.info("Development Mode is \x1b[32mEnabled\x1b[0m!");

      var host = client.devMode ? "130.61.140.70" : "172.18.0.1";

      var db = mysql.createConnection({
        host: host,
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
