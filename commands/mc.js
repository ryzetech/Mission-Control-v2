const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const fetch = require("node-fetch");

module.exports = {
  data:
    new SlashCommandBuilder()
      .setName("minecraft")
      .setDescription("See infos about a Minecraft player")
      .addStringOption(option => {
        return option
          .setName("username")
          .setDescription("the username to check")
          .setRequired(true);
      }),
  async execute(interaction) {
    try {
      const uname = interaction.options.getString("username");

      const res = await fetch("https://some-random-api.ml/mc?username=" + encodeURIComponent(uname));
      const json = await res.json();

      if (!json.error) {

        const embed = new MessageEmbed()
          .setAuthor({ name: "MC Fetch", iconURL: "https://botdata.ryzetech.live/perma/grassblock.png" })
          .setTitle(json.username)
          .setThumbnail("https://crafatar.com/avatars/" + json.uuid + "?overlay=true")
          .setImage("https://crafatar.com/renders/body/" + json.uuid + "?overlay=true");

        let namelist;

        if (json.name_history.length > 25) {
          namelist = "\n";

          for (const i in json.name_history) {
            namelist +=
              i == 0
                ? json.name_history[i].name +
                "\n-> " +
                json.name_history[i].changedToAt
                : "\n\n" +
                json.name_history[i].name +
                "\n-> " +
                json.name_history[i].changedToAt;

            // wrap shit into codebox
            namelist = "```" + namelist + "```";

            embed.setDescription(
              `${json.uuid}\n\n**Name History (old to new):**\n${namelist}`,
            );
          }
        }
        else {
          for (const i in json.name_history) {
            const name = json.name_history[i].name;
            const date = json.name_history[i].changedToAt;
            namelist.push({ name, date });
          }

          embed.setDescription(`${json.uuid}\n\n**Name History (old to new):**`);
          embed.addFields(namelist);
        }

        await interaction.reply({ embeds: [embed] });
      }
      else {
        await interaction.reply({ embeds: [
          new MessageEmbed()
            .setAuthor({ name: "MC Fetch", iconURL: "https://botdata.ryzetech.live/perma/grassblock.png" })
            .setTitle("❌ An error occured! :(")
            .setDescription("Error Message: *" + json.error + "*"),
        ] });
      }
    }
    catch {
    // lol
    }
  },
};
