require("dotenv").config();
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
  name: "scp",
  description: "TESTCOMMAND",
  async execute(client, interaction) {
    var scpNumber = `049`;
    var url = "https://the-scp.foundation/object/scp-" + scpNumber;
    if (UrlExists(url)) {
      var scpQuery = `SELECT * FROM Scps WHERE Number = ${parseInt(scpNumber)}`;
      var queryResult = await client.db.awaitQuery(scpQuery);

      if (queryResult[0]) {
        queryResult = queryResult[0];
        const itemNo = `SCP-${pad(queryResult.Number, 3)}`;
        const itemUrl = queryResult.URL;
        const itemName = queryResult.Name;
        var itemClass = queryResult.Class;
        var itemClassImg = queryResult.ClassImage;
        var itemClassColor = queryResult.ClassColor;
        var itemImage = queryResult.Image;

        var itemDescriptionSegmnt = queryResult.Description.replace(
          /%60/g,
          "'"
        ).substring(0, 1024);
        var fullItemDescriptionSegmnt = queryResult.Description.replace(
          /%60/g,
          "'"
        );
        var bigDesc =
          queryResult.Description.replace(/%60/g, "'").length > 1024;

        const itemSpecialContainmentProc =
          queryResult.ContainmentProcedures.replace(/%60/g, "'").substring(
            0,
            1024
          );
        const fullItemSpecialContainmentProc =
          queryResult.ContainmentProcedures.replace(/%60/g, "'");
        var bigCont =
          queryResult.ContainmentProcedures.replace(/%60/g, "'").length > 1024;

        var itemFullFootNotes = queryResult.Footnotes;
        var itemFootNotes = "";
        var bigNotes = false;
        if (queryResult.Footnotes.length <= 1024) {
          queryResult.Footnotes;
        } else {
          bigNotes = true;
          var footNotes = queryResult.Footnotes.split("\n");
          while (footNotes.join("\n").length > 1024) {
            var popped = footNotes.pop();
            if (footNotes.join("\n").length <= 1024)
              itemFootNotes = footNotes.join("\n");
          }
        }

        const itemTags = queryResult.Tags.split(", ");
        var bigTags = itemTags.length > 3;

        sendMsg();

        async function sendMsg(l = null, rpl = null) {
          var originalEmbed = new MessageEmbed()
            .setColor(itemClassColor)
            //.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
            .setTimestamp();

          if (itemNo && itemName)
            originalEmbed.setTitle(itemNo + " - " + itemName);

          if (itemUrl) originalEmbed.setURL(itemUrl);

          if (itemClassImg) originalEmbed.setThumbnail(itemClassImg);

          if (itemDescriptionSegmnt)
            originalEmbed.addField(`Description`, itemDescriptionSegmnt);

          if (itemSpecialContainmentProc)
            originalEmbed.addField(
              "Special Containment Procedures",
              itemSpecialContainmentProc
            );

          if (itemImage) originalEmbed.setImage(itemImage);

          if (itemClass && itemClassImg)
            originalEmbed.setFooter({
              text: itemClass,
              iconURL: itemClassImg,
            });

          if (itemFootNotes) originalEmbed.addField("Footnotes", itemFootNotes);

          for (i = 0; i < 3; i++) {
            if (itemTags[i]) {
              if (i == 0)
                originalEmbed.addField("Object Class", itemTags[i], true);
              else originalEmbed.addField("Object Tag", itemTags[i], true);
            }
          }

          const originalRow = new MessageActionRow();

          function makeid(length) {
            var result = "";
            var characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
              result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
              );
            }
            return result;
          }

          const descId =
            interaction.member.user.username.replace(" ", "") + makeid(50);
          const contId =
            interaction.member.user.username.replace(" ", "") + makeid(50);
          const NotesId =
            interaction.member.user.username.replace(" ", "") + makeid(50);
          const TagsId =
            interaction.member.user.username.replace(" ", "") + makeid(50);

          if (bigDesc)
            originalRow.addComponents(
              new MessageButton()
                .setCustomId(descId)
                .setLabel("View Full Description")
                .setStyle("PRIMARY")
            );

          if (bigCont)
            originalRow.addComponents(
              new MessageButton()
                .setCustomId(contId)
                .setLabel("View Full Special Containment Procedures")
                .setStyle("PRIMARY")
            );

          if (bigNotes)
            originalRow.addComponents(
              new MessageButton()
                .setCustomId(NotesId)
                .setLabel("View All Footnotes")
                .setStyle("PRIMARY")
            );

          if (bigTags)
            originalRow.addComponents(
              new MessageButton()
                .setCustomId(TagsId)
                .setLabel("View All Tags")
                .setStyle("PRIMARY")
            );

          var reply;

          if (l == null) {
            if (originalRow.components.length > 0) {
              await interaction
                .reply({
                  embeds: [originalEmbed],
                  components: [originalRow],
                })
                .then((msg) => {
                  reply = msg;
                });
            } else {
              await interaction
                .reply({ embeds: [originalEmbed] })
                .then((msg) => {
                  reply = msg;
                });
            }
          } else {
            await l.update({
              embeds: [originalEmbed],
              components: [originalRow],
            });
            reply = rpl;
          }

          const filter = (i) =>
            i.interaction.id === reply.id &&
            i.user.id === interaction.member.id;

          const collector = interaction.channel.createMessageComponentCollector(
            {
              filter,
              time: 100000,
            }
          );

          if (collector) {
            collector.on("collect", async (i) => {
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

            collector.on("end", async (collected, reason) => {
              var replyy = await channel.messages.fetch(reply.id).catch(() => {
                return false;
              });
              if (!reason.includes("Found Interaction: ") && replyy) {
                await reply.edit({ components: [] });
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

          if (itemNo && itemName) embed.setTitle(itemNo + " - " + itemName);

          if (itemUrl) embed.setURL(itemUrl);

          if (itemClassImg) embed.setThumbnail(itemClassImg);

          if (itemImage) embed.setImage(itemImage);

          if (fullItemDescriptionSegmnt)
            embed.setDescription(`**Description**\n ${chunks[pageNo - 1]}`);

          if (itemClass && itemClassImg)
            embed.setFooter({
              text: itemClass,
              iconURL: itemClassImg,
            });

          function makeid(length) {
            var result = "";
            var characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
              result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
              );
            }
            return result;
          }

          const backId =
            interaction.member.user.username.replace(" ", "") + makeid(50);
          const previousPgId =
            interaction.member.user.username.replace(" ", "") + makeid(50);
          const nextPgId =
            interaction.member.user.username.replace(" ", "") + makeid(50);

          const row = new MessageActionRow();

          if (pageNo >= 2) {
            if (pageNo == chunks.length) {
              row.addComponents(
                new MessageButton()
                  .setCustomId(previousPgId)
                  .setLabel(`Previous Page`)
                  .setStyle("PRIMARY")
              );
            } else {
              row.addComponents(
                new MessageButton()
                  .setCustomId(previousPgId)
                  .setLabel(`Previous Page`)
                  .setStyle("PRIMARY")
              );
              row.addComponents(
                new MessageButton()
                  .setCustomId(nextPgId)
                  .setLabel(`Next Page`)
                  .setStyle("PRIMARY")
              );
            }
          } else {
            if (pageNo != chunks.length) {
              row.addComponents(
                new MessageButton()
                  .setCustomId(nextPgId)
                  .setLabel(`Next Page`)
                  .setStyle("PRIMARY")
              );
            }
          }

          row.addComponents(
            new MessageButton()
              .setCustomId(backId)
              .setLabel(`Back to ${itemNo}`)
              .setStyle("PRIMARY")
          );

          await i.update({ embeds: [embed], components: [row] });

          const newFilter = (p) =>
            p.interaction.id === reply.id &&
            p.user.id === interaction.member.id;

          const newCollector =
            interaction.channel.createMessageComponentCollector({
              newFilter,
              time: 100000,
            });

          if (newCollector) {
            newCollector.on("collect", async (i) => {
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
            });

            newCollector.on("end", async (collected, reason) => {
              var replyy = await channel.messages.fetch(reply.id).catch(() => {
                return false;
              });
              if (!reason.includes("Found Interaction: ") && replyy)
                await reply.edit({ components: [] });
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

          if (itemNo && itemName) embed.setTitle(itemNo + " - " + itemName);

          if (itemUrl) embed.setURL(itemUrl);

          if (itemClassImg) embed.setThumbnail(itemClassImg);

          if (itemImage) embed.setImage(itemImage);

          if (fullItemSpecialContainmentProc)
            embed.setDescription(
              `**Special Containment Procedures**\n ${chunks[pageNo - 1]}`
            );

          if (itemClass && itemClassImg)
            embed.setFooter({
              text: itemClass,
              iconURL: itemClassImg,
            });

          function makeid(length) {
            var result = "";
            var characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
              result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
              );
            }
            return result;
          }

          const backId =
            interaction.member.user.username.replace(" ", "") + makeid(50);
          const previousPgId =
            interaction.member.user.username.replace(" ", "") + makeid(50);
          const nextPgId =
            interaction.member.user.username.replace(" ", "") + makeid(50);

          const row = new MessageActionRow();

          if (pageNo >= 2) {
            if (pageNo == chunks.length) {
              row.addComponents(
                new MessageButton()
                  .setCustomId(previousPgId)
                  .setLabel(`Previous Page`)
                  .setStyle("PRIMARY")
              );
            } else {
              row.addComponents(
                new MessageButton()
                  .setCustomId(previousPgId)
                  .setLabel(`Previous Page`)
                  .setStyle("PRIMARY")
              );
              row.addComponents(
                new MessageButton()
                  .setCustomId(nextPgId)
                  .setLabel(`Next Page`)
                  .setStyle("PRIMARY")
              );
            }
          } else {
            if (pageNo != chunks.length) {
              row.addComponents(
                new MessageButton()
                  .setCustomId(nextPgId)
                  .setLabel(`Next Page`)
                  .setStyle("PRIMARY")
              );
            }
          }

          row.addComponents(
            new MessageButton()
              .setCustomId(backId)
              .setLabel(`Back to ${itemNo}`)
              .setStyle("PRIMARY")
          );

          await i.update({ embeds: [embed], components: [row] });

          const newFilter = (p) =>
            p.interaction.id === reply.id &&
            p.user.id === interaction.member.id;

          const newCollector =
            interaction.channel.createMessageComponentCollector({
              newFilter,
              time: 100000,
            });

          if (newCollector) {
            newCollector.on("collect", async (i) => {
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
            });

            newCollector.on("end", async (collected, reason) => {
              var replyy = await channel.messages.fetch(reply.id).catch(() => {
                return false;
              });
              if (!reason.includes("Found Interaction: ") && replyy)
                await reply.edit({ components: [] });
            });
          }
        }

        async function footnotesCollected(i, reply) {
          var embed = new MessageEmbed()
            .setColor(itemClassColor)
            //.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
            .setTimestamp();

          if (itemNo && itemName) embed.setTitle(itemNo + " - " + itemName);

          if (itemUrl) embed.setURL(itemUrl);

          if (itemClassImg) embed.setThumbnail(itemClassImg);

          if (itemImage) embed.setImage(itemImage);

          if (itemFullFootNotes)
            embed.setDescription(`**Footnotes**\n ${itemFullFootNotes}`);

          if (itemClass && itemClassImg)
            embed.setFooter({
              text: itemClass,
              iconURL: itemClassImg,
            });

          function makeid(length) {
            var result = "";
            var characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
              result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
              );
            }
            return result;
          }

          const backId =
            interaction.member.user.username.replace(" ", "") + makeid(50);

          const row = new MessageActionRow();

          row.addComponents(
            new MessageButton()
              .setCustomId(backId)
              .setLabel(`Back to ${itemNo}`)
              .setStyle("PRIMARY")
          );

          await i.update({ embeds: [embed], components: [row] });

          const newFilter = (p) =>
            p.interaction.id === reply.id &&
            p.user.id === interaction.member.id;

          const newCollector =
            interaction.channel.createMessageComponentCollector({
              newFilter,
              time: 100000,
            });

          if (newCollector) {
            newCollector.on("collect", async (i) => {
              if (i.customId === backId) {
                newCollector.stop(`Found Interaction: ${i.customId}`);
                sendMsg(i, reply);
              }
            });

            newCollector.on("end", async (collected, reason) => {
              var replyy = await channel.messages.fetch(reply.id).catch(() => {
                return false;
              });
              if (!reason.includes("Found Interaction: ") && replyy)
                await reply.edit({ components: [] });
            });
          }
        }

        async function tagsCollected(i, reply) {
          var embed = new MessageEmbed()
            .setColor(itemClassColor)
            //.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
            .setTimestamp();

          if (itemNo && itemName) embed.setTitle(itemNo + " - " + itemName);

          if (itemUrl) embed.setURL(itemUrl);

          if (itemClassImg) embed.setThumbnail(itemClassImg);

          if (itemImage) embed.setImage(itemImage);

          if (itemClass && itemClassImg)
            embed.setFooter({
              text: itemClass,
              iconURL: itemClassImg,
            });

          for (p = 0; p < itemTags.length; p++) {
            if (itemTags[p]) {
              if (p == 0) embed.addField("Object Class", itemTags[p], true);
              else embed.addField("Object Tag", itemTags[p], true);
            }
          }

          function makeid(length) {
            var result = "";
            var characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
              result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
              );
            }
            return result;
          }

          const backId =
            interaction.member.user.username.replace(" ", "") + makeid(50);

          const row = new MessageActionRow();

          row.addComponents(
            new MessageButton()
              .setCustomId(backId)
              .setLabel(`Back to ${itemNo}`)
              .setStyle("PRIMARY")
          );

          await i.update({ embeds: [embed], components: [row] });

          const newFilter = (p) =>
            p.interaction.id === reply.id &&
            p.user.id === interaction.member.id;

          const newCollector =
            interaction.channel.createMessageComponentCollector({
              newFilter,
              time: 100000,
            });

          if (newCollector) {
            newCollector.on("collect", async (i) => {
              if (i.customId === backId) {
                newCollector.stop(`Found Interaction: ${i.customId}`);
                sendMsg(i, reply);
              }
            });

            newCollector.on("end", async (collected, reason) => {
              var replyy = await channel.messages.fetch(reply.id).catch(() => {
                return false;
              });
              if (!reason.includes("Found Interaction: ") && replyy)
                await reply.edit({ components: [] });
            });
          }
        }
      }
    }

    function UrlExists(url) {
      var http = new XMLHttpRequest();
      http.open("HEAD", url, false);
      http.send();
      if (http.status != 404) return true;
      else return false;
    }

    function pad(n, length) {
      var len = length - ("" + n).length;
      return (len > 0 ? new Array(++len).join("0") : "") + n;
    }
  },
};
