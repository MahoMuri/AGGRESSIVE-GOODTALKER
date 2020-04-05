  
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const colors = require("../../colors.json");

module.exports = {
    name: "report",
    category: "moderation",
    description: "Reports a member",
    usage: "<mention, id>",
    run: async (bot, message, args) => {
        // If the bot can delete the message, do so
        if (message.deletable) message.delete();

        // Either a mention or ID
        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No person found
        if (!rMember)
            return message.reply("Couldn't find that person?").thenm.delete({timeout: 5000, reason :"It had to be done."});

        // The member has BAN_MEMBERS or is a bot
        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.channel.send("Can't report that member").then({timeout: 5000, reason :"It had to be done."});

        // If there's no argument
        if (!args[1])
            return message.channel.send("Please provide a reason for the report").then({timeout: 5000, reason :"It had to be done."});
        
        const channel = message.guild.channels.cache.find(c => c.name === "reports")
            
        // No channel found
        if (!channel)
            return message.channel.send("Couldn't find a `#reports` channel").then({timeout: 5000, reason :"It had to be done."});

        const embed = new MessageEmbed()
            .setColor(colors.Red)
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL())
            .setAuthor("Reported member", rMember.user.displayAvatarURL())
            .setDescription(stripIndents`**Member:** ${rMember} (${rMember.user.id})
            **Reported by:** ${message.member}
            **Reported in:** ${message.channel}
            **Reason:** ${args.slice(1).join(" ")}`);

        return channel.send(embed);
    }
}