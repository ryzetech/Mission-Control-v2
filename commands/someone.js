const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data:
  new SlashCommandBuilder()
    .setName("someone")
    .setDescription("Use this command to randomly select somebody")
    .addStringOption(option => {
      return option
        .setName("msg")
        .setDescription("The message to send to the selected user (not required)")
        .setRequired(false);
    }),
  async execute(interaction) {
    const user = interaction.guild.members.cache.at(Math.floor(Math.random() * interaction.guild.members.cache.size()));

    let out = `<@${user.id}> `;
    const msg = await interaction.options.getString("msg");

    if (!msg) out += "You have been selected by /someone!";
    else out += msg;

    await interaction.reply(out);
  },
};
