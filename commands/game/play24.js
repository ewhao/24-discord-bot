const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play24')
        .setDescription('Starts game of 24.'),
    async execute(interaction) {
        await interaction.reply("Starting game of 24.");
    },
};