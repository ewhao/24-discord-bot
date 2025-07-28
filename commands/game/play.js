const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Starts game of 24.'),
    async execute(interaction) {
        const startMessage = "Starting game of 24.\n\n" +
            "Rules:\n" +
            "- Each number of four numbers provided in a set must be used exactly once.\n" +
            "- Accepted operations are addition (+), subtraction (-), multiplication (-), " +
            "division(/), and parenthesis(()).\n" +
            "- Answers can be wrapped in backticks (`) to prevent other markdown from being applied.\n\n"
        await interaction.reply(startMessage);
    },
};