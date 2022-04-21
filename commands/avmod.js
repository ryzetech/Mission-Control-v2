const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

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

    // TODO: check if that works, i actually have no idea
    // TODO: add long rendering shit (triggered, lolice)

    await interaction.editReply({ embeds: [
      new MessageEmbed()
        .setTitle(`${usr.user.tag}' Avatar`)
        .setDescription(`Modifier: ${filter.toUpperCase()}`)
        .setURL(
          `https://some-random-api.ml/canvas/${filter}/?avatar=${usr.user.displayAvatarURL(
            { format: "png" },
          )}`,
        )
        .setImage(
          `https://some-random-api.ml/canvas/${filter}/?avatar=${usr.user.displayAvatarURL(
            { format: "png" },
          )}`,
        ),
    ] });
  },
};
