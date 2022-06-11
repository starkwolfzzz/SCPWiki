const { Message } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    /**
     * @param {Message} message
     * @returns 
     */
    async execute(client, message) {
        if (message.member.id === "730699006438801428" || (message.member.id === "460454915568041984" && message.guild.id === "914986395704131654" && message.channel.id === "975910036259876914")) {
            message.reply({content: `I literally did not ask <@${message.member.id}>, shut the fuck up.`})
        }
    },
};