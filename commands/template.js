// a template for creating new commands! NEVER EDIT THIS FILE! NEVER!
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data:
  new SlashCommandBuilder()
    .setName("template")
    .setDescription("description"),
  async execute(interaction) {
    // do the stuff here!
    await interaction.reply("thing");
  },
};
