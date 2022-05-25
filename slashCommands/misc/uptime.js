const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "uptime",
    description: "Checks for bot uptime",
    async execute(client, interaction) {
        if (interaction.member.id == 460454915568041984) {
            const uptimeTS = client.uptime;

            const msgEmbed = new MessageEmbed()
                .setColor("F9A602")
                .setTitle("Tavern Bartender Uptime")
                .setDescription(`The bot has been up for ${msToTime(uptimeTS, "highest")}.`)
                .addFields({
                    name: 'Days',
                    value: `${msToTime(uptimeTS, "days")}`,
                    inline: true
                }, {
                    name: 'Hours',
                    value: `${msToTime(uptimeTS, "hours")}`,
                    inline: true
                }, {
                    name: 'Minutes',
                    value: `${msToTime(uptimeTS, "minutes")}`,
                    inline: true
                }, {
                    name: 'Seconds',
                    value: `${msToTime(uptimeTS, "seconds")}`,
                    inline: true
                }, )
                .addField('Milliseconds', `${msToTime(uptimeTS, "milliseconds")}`, true)
                .setTimestamp()
                .setFooter(`${msToTime(uptimeTS)}`)
            interaction.reply({ embeds: [msgEmbed], ephemeral: true });
        }
    }
}

function msToTime(duration, type = "none") {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
        days = Math.floor((duration / (1000 * 60 * 60 * 24)));

    switch (type) {
        case "none":
            days = (days < 10) ? "0" + days : days;
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            return days + ":" + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
            break;
        case "highest":
            if (days > 0) return days + " days";
            else if (hours > 0) return hours + " hrs";
            else if (minutes > 0) return minutes + " mins";
            else if (seconds > 0) return seconds + " secs";
            else if (milliseconds > 0) return milliseconds + " ms";
            break;
        case "days":
            return days;
            break;
        case "hours":
            return hours;
            break;
        case "minutes":
            return minutes;
            break;
        case "seconds":
            return seconds;
            break;
        case "milliseconds":
            return milliseconds;
            break;
    }
}