const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quit')
        .setDescription('Quits current game of 24.'),
    async execute(interaction) {
        await interaction.reply("Quitting game. Thanks for playing!");
    },
};