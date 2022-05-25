const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ping",
    description: "Replies with the latency of the bot",
    async execute(client, message, args) {
        const msgEmbed1 = new MessageEmbed()
        .setColor("F9A602")
        .setTitle("Tavern Bartender Ping")
        .setDescription(`Checking for bot ping...`)
        .setTimestamp()

        message.reply({ embeds: [msgEmbed1] }).then (async (msg) =>{
            const timestamp = message.createdTimestamp;
            const latency = msg.createdTimestamp - timestamp;
            const apiLatency = Math.round(client.ws.ping)

            const msgEmbed = new MessageEmbed()
                .setColor("F9A602")
                .setTitle("Tavern Bartender Ping")
                .setDescription(`🏓 pong`)
                .addFields({
                    name: 'Latency',
                    value: `${latency} ms`
                }, )
                .addField('Api Latency', `${apiLatency} ms`)
                .setTimestamp()
                .setFooter(`${latency} ms`)

            msg.edit({ embeds: [msgEmbed] })
        })
    }
}