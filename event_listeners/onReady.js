/**
 * @file ready listener
 */

module.exports = bot => {
    bot.on('ready', () => {
        let logChannel = bot.channels.cache.get('710795359844171797');
        let logMsg = `✅ ${bot.user.username} is online on ${bot.guilds.cache.size} server${bot.guilds.cache.size > 1 ? 's' : ''}!`;

        console.log(logMsg);
        logChannel.send(logMsg);
        bot.user.setActivity("AGGRESSIVELY", { type: "STREAMING" });
    });
};
