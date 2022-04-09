const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data:
    new SlashCommandBuilder()
      .setName("animal")
      .setDescription("Gets an animal of your choice!")
      .addStringOption(option => {
        return option
          .setName("type")
          .setDescription("Specify an animal!")
          .setRequired(true)
          .addChoices(
            {
              choices: [
                ["dog", "dog"],
                ["cat", "cat"],
                ["panda", "panda"],
                ["fox", "fox"],
                ["koala", "koala"],
                ["bird", "birb"],
                ["red panda", "red_panda"],
              ],
            },
          );
      }),
  async execute(interaction) {
    const animal = await interaction.options.getString("animal");

    const res = await fetch("https://some-random-api.ml/img/" + animal);
    const json = await res.json();

    const embed = new MessageEmbed()
      .setTitle("Random " + animal)
      .setImage(json.link)
      .setAuthor({ name: "powered by SRA", url: "https://some-random-api.ml/" });

    await interaction.reply({ embeds: [embed] });
  },
};
