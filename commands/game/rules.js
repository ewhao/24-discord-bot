const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('Explains the rules of 24.'),
	async execute(interaction) {
        const rules = "The 24 puzzle is an arithmetical puzzle in which the objective " +
            "is to find a way to manipulate four integers 1-13 so that the end result is 24." +
            "For example, for the numbers `4, 7, 8, 8`, a possible solution is `(7-(8/8))*4`.\n\n" +

            "The rules for this version are as follows;\n" + 
            "- Each number of four numbers provided in a set must be used exactly once\n" + 
            "- Accepted operations are addition (+), subtraction (-), multiplication (-), " +
            "division(/), and parenthesis(()).\n" +
            "- Answers can be wrapped in backticks (`) to prevent other markdown from being applied.\n\n" +

            "See [wikipedia](<https://en.wikipedia.org/wiki/24_(puzzle)) to learn more about " +
            "the game and variations.";
		await interaction.reply(rules);
	},
};
