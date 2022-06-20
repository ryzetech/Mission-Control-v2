// a template for creating new commands! NEVER EDIT THIS FILE! NEVER!
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data:
    new SlashCommandBuilder()
      .setName("avatar")
      .setDescription("Gets your or someone else's avatar picture or gif"),
  async execute(interaction) {
    const usrPFP = interaction.user.displayAvatarURL({ animated: true });
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(interaction.user.username + "'s Avatar")
          .setImage(usrPFP),
      ],
    });
  },
};

// no comments needed i think