/*
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░   ░░░░░░░   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ░░░░░░░░░░░░░░░░░░░░░░░░░░░   ░░░░░░░░░░░░░░░░░░░░░░   ░
  ▒  ▒   ▒▒▒    ▒▒  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒
  ▒   ▒   ▒ ▒   ▒▒▒▒▒▒     ▒▒▒     ▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒   ▒   ▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒   ▒   ▒▒▒    ▒  ▒  ▒    ▒▒▒▒   ▒▒▒▒▒   ▒
  ▓   ▓▓   ▓▓   ▓   ▓   ▓▓▓▓▓   ▓▓▓▓▓   ▓▓   ▓▓   ▓▓▓   ▓▓   ▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓▓   ▓▓   ▓▓▓   ▓▓   ▓▓▓   ▓▓▓▓   ▓▓▓▓▓   ▓▓   ▓▓   ▓
  ▓   ▓▓▓  ▓▓   ▓   ▓▓▓    ▓▓▓▓    ▓▓   ▓   ▓▓▓▓   ▓▓   ▓▓   ▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓   ▓▓▓▓   ▓▓   ▓▓   ▓▓▓   ▓▓▓▓   ▓▓▓▓   ▓▓▓▓   ▓   ▓
  ▓   ▓▓▓▓▓▓▓   ▓   ▓▓▓▓▓   ▓▓▓▓▓   ▓   ▓▓   ▓▓   ▓▓▓   ▓▓   ▓▓▓▓▓▓▓▓   ▓▓▓   ▓▓   ▓▓   ▓▓▓   ▓▓   ▓▓▓   ▓ ▓▓   ▓▓▓▓▓   ▓▓   ▓▓   ▓
  █   ███████   █   █      ██      ██   ████   █████    ██   ██████████     ██████   █████    ██   ████   ██    ███████   █████   █
  █████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████ v2

  by ArcticSpaceFox and ryzetech
  made with 🍺 and ❤ in Germany

  Honorable Mentions:
    SteffTek
      dvs endpoint

  Introduction:
    Hello explorer!
    This is the second iteration of Mission Control, the bot for the FoxesInBoxes Discord ( discord.gg/m46vcrm52b ).
    Since Discord added a whole lot of shit to the API and I had to rewrite the whole thing anyways, this is the new and improved version!
    The files in this project are still home to these things:
      - shitty solutions for easy problems
      - amateur code
      - major inefficiencies
      - TODOs and FIXMEs
      - comments which mock the code
      - comments with profanities and insults
      - comments admitting stupidity

    If you want to use this code (for whatever reason), it's licensed under the GNU General Public License v3.0.
    You can read more about it here -> https://github.com/ryzetech/Mission-Control-v2/blob/master/LICENSE

    Thank you for your interest in this project! If you want to contribute, join the Discord server and talk to us
    or propose your changes directly in a pull request. :)
*/

// load shit in
const { Client, Intents, Collection } = require("discord.js");
const auth = require("./token.json");
const fs = require("node:fs");
const NodeCache = require("node-cache");
const cache = new NodeCache();

// why the fuck do we have to do this tho? discord explain!
const botcli = new Client({ intents: [Intents.FLAGS.GUILDS] });

// load all commands whilst ignoring the template
botcli.commands = new Collection();
const commandFiles = fs.readdirSync(__dirname + "/commands").filter(file => file.endsWith(".js") && file !== "template.js");
for (const file of commandFiles) {
  const command = require(`${__dirname}/commands/${file}`);
  botcli.commands.set(command.data.name, command);
}

// bot ready event
botcli.once("ready", () => {
  console.log("Logged in as " + botcli.user.tag);
  // TODO: I should add something for the activity like in the last bot yknow
});

// bot interaction event
botcli.on("interactionCreate", async interaction => {

  // checks if the interaction is actually a command
  if (!interaction.isCommand()) return;

  // gets the command by name
  const command = botcli.commands.get(interaction.commandName);
  if (!command) return;

  // executes the command and return an error message if it fails
  // FIXME: THIS IS THE MOST BASIC ERROR HANDLING SHIT I'VE EVER WRITTEN, MAKE IT BETTER
  try { await command.execute(interaction, auth, cache); }
  catch (runerror) {
    try {
      await interaction.editReply({ content: `There was an error while I executed the command! This might be helpful: \`\`\`${runerror}\`\`\``, ephemeral: true });
    }
    catch (editError) {
      await interaction.reply({ content: `There was an error while I executed the command! This might be helpful: \`\`\`${runerror}\`\`\``, ephemeral: true });
    }
  }
});

// launch this shit
botcli.login(auth.token);