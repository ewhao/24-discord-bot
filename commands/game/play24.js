const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play24')
        .setDescription('Starts game of 24.'),
    async execute(interaction) {
        await interaction.reply(createSet().toString());
    },
};

function createSet() {
    let a = Math.ceil(Math.random() * 13);
    let b = Math.ceil(Math.random() * 13);
    let c = Math.ceil(Math.random() * 13);
    let d = Math.ceil(Math.random() * 13);
    return [a, b, c, d];
}

function toString(set) {
    let string = "";
    for (const num in set) {
        switch (num) {
            case 11: 
                string += "J  ";
                break;
            case 12: 
                string += "Q  ";
                break;
            case 13: 
                string += "K  ";
                break;
            default:
                string += num + "  ";
        }
    }
}
