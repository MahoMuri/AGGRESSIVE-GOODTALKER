const { getMember } = require("../../functions.js");
const { stripIndents } = require("common-tags");

// Imported for documentation purposes
const Discord = require("discord.js");

module.exports = {
    name: 'giverole',
    aliases: ['grole'],
    category:"moderations",
    description: "Gives a role to a certain user",
    usage:[`\`-<command | alias> <Usertag|Mention> <RoleID: Plain text>\``],

    /**
     * Executes the command
     *
     * @param bot {Discord.Client} The bot instance
     * @param message {Discord.Message} The referenced message containing the command
     * @param args {String} Command arguments
     */
    run: async (bot, message, args) => {

        // Can user manage roles?
        if (!message.member.hasPermission("MANAGE_ROLES")) {
            message.reply("You don't have access to this command!");
            return;
        }

        // Does message have a user-mention?
        if (!message.mentions.members.first()) {
            message.reply('Please provide a member to give the role to.');
            return;
        }

        // Does message have any role to give?
        if (!args) {
            message.reply('Please provide role to give!');
            return;
        }

        const targetMember = getMember(message, args.join(" "));
        // Try setting via role-mention
        let role = message.mentions.roles.first();
        // If no role-mention, proceed
        if (!role) {
            // Check for role
            const toGive = args.slice(1).join(" ");
            role = message.guild.roles.cache.find(role => role.name === toGive);
            // If not valid name, proceed to check via role-id
            if (!role) {
                // Check for role-id
                role = message.guild.roles.cache.find(role => role.id === toGive);
                if (!role) {
                    // Unknown role, consider as FAILURE
                    message.channel.send('Cannot give an unknown role');
                    return;
                }
            }
        }

        // Sanity check: can user give this role?
        // This short-circuits to TRUE when sender is the owner of the guild.
        if (message.guild.ownerID !== message.member.id && message.member.roles.highest.comparePositionTo(role) <= 0) {
            message.reply('Cannot give role that is same or higher than your own.');
            return;
        }

        try {
            if (targetMember.roles.cache.has(role.id)) {
                message.channel.send(`\`${targetMember.user.tag}\` already has the ${role.name} role!`);
                return;
            }
            await targetMember.roles.add(role);
            message.channel.send(`${role.name} has been successfully given to \`${targetMember.user.tag}!\``);
        } catch (error) {
            message.channel.send(stripIndents `Couldn't give the role here's why:
            \`${error.message}\``);
        }
    }
};
