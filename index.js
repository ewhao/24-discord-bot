// Require the necessary discord.js classes
const dotenv = require('dotenv');
dotenv.config();
const fs = require('node:fs'); // file system
const path = require('node:path'); // path utility
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { getValidSet, checkAnswer, solveSet, Results } = require('./game');

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

// Command handler - dynamically retrieve command files
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set new item in Collection with key as command name and value as exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a require "data or "execute" property.`);
		}
	}
}

// Event handler - dynamically retrieve event files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Start game of 24
client.on('messageCreate', async message => {
	if (message.content == "Starting game of 24.") {
		const set = getValidSet();
		const sols = solveSet(set);
		console.log(set);
		console.log(sols)

		let setMessage = await message.channel.send(set.toString().replaceAll(',', ' '));
		const collectionFilter = m => {
			return ((!m.author.bot && checkAnswer(m.content, set) == Results.CORRECT) ||
				checkAnswer(m.content, set) == Results.QUIT);
		}

		message.channel.awaitMessages({
			filter: collectionFilter,
			max: 1,
			time: 45000,
			errors: ['time']
		}).then(collected => {
			if (collected.first().content == Results.CORRECT) {
				collected.first().reply("yippee");
			}
		}).catch(() => {
			message.channel.send(`Ran out of time! Potential solutions are: \n\`${sols.toString().replaceAll(',', '\n')}\``);
		});
	}
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);