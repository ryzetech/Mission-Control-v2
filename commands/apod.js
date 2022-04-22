const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data:
    new SlashCommandBuilder()
      .setName("apod")
      .setDescription("The Astronomic Picture of the Day"),
  async execute(interaction, auth, botCache) {
    await interaction.defer();

    let apod_json = botCache.get("nasa-apod");

    if (!apod_json) {
      const apod_res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${auth.nasa_auth}`);
      apod_json = await apod_res.json();

      const success = botCache.set("nasa-apod", apod_json, 60 * 60);
      if (!success) {
        console.error("Failed to cache apod.");
        return await interaction.editReply({ content: "Error: Failed to cache APOD." });
      }
    }

    if (apod_json.copyright === undefined) apod_json.copyright = "None / Public Domain";

    const embed = new MessageEmbed()
      .setColor("#0b3d91")
      .setAuthor({ name: "NASA APOD", url: "https://api.nasa.gov/", iconURL: "https://botdata.ryzetech.live/perma/NASA.png" })
      .setTitle(`"${apod_json.title}"`);

    if (apod_json.media_type === "video") {
      embed.setDescription(`${apod_json.explanation}\n\n*Date: ${apod_json.date}*\n*© ${apod_json.copyright}*\n\n**=> [VIDEO](${apod_json.url}) <=**`);
    }
    else if (apod_json.media_type === "image") {
      embed.setDescription(`${apod_json.explanation}\n\n*Date: ${apod_json.date}*\n*© ${apod_json.copyright}*\n\n**=> [Full Resolution](${apod_json.hdurl}) <=**`);
      embed.setImage(apod_json.url);
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
