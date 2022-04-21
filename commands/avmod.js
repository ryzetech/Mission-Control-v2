const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  data:
    new SlashCommandBuilder()
      .setName("avmod")
      .setDescription("Modify your or someone elses avatar")
      .addStringOption(option => {
        return option
          .setName("filter")
          .setDescription("Choose your desired filter")
          .setRequired(true)
          .addChoices(
            {
              choices: [
                ["Glass", "glass"],
                ["GTA Wasted", "wasted"],
                ["Greyscale", "grayscale"],
                ["Inverted Colors", "inverted"],
                ["Inverted Greyscale", "invertedgrayscale"],
                ["Brightness", "brightness"],
                ["Threshold", "threshold"],
                ["Sepia filter", "sepia"],
                ["Pixelated", "pixelate"],
                ["Red Overlay", "red"],
                ["Green Overlay", "green"],
                ["Blue Overlay", "blue"],
                ["GAY", "gay"],
                ["Jailed", "jail"],
                ["Comrade!", "comrade"],
                ["Simpcard", "simpcard"],
                ["Horny License", "horny"],
                ["GTA Mission passed", "passed"],
              ],
            },
          );
      })
      .addUserOption(option => {
        return option
          .setName("user")
          .setDescription("Mention an optional user to modify their avatar")
          .setRequired(false);
      }),
  async execute(interaction) {
    await interaction.defer();

    const filter = interaction.getString("filter");
    const usr = interaction.getUser("user");

    const msg = new MessageEmbed()
      .setTitle(`${usr.user.tag}' Avatar`)
      .setDescription(`Modifier: ${filter.toUpperCase()}`)
      .setURL(
        `https://some-random-api.ml/canvas/${filter}/?avatar=${usr.user.displayAvatarURL(
          { format: "png" },
        )}`,
      );

    if (["triggered", "lolice"].includes(filter)) {
      const attachment = new MessageAttachment(
        `https://some-random-api.ml/canvas/${filter}/?avatar=${usr.user.displayAvatarURL(
          { format: "png" },
        )}`,
        "att.gif",
      );

      msg.setImage("attatchment://att.gif");

      await interaction.editReply({ embeds: [msg], files: [attachment] });
    }
    else {
      msg.setImage(
        `https://some-random-api.ml/canvas/${filter}/?avatar=${usr.user.displayAvatarURL(
          { format: "png" },
        )}`,
      );
      await interaction.editReply({ embeds: [msg] });
    }
  },
};
