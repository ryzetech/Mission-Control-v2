const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data:
    new SlashCommandBuilder()
      .setName("apod")
      .setDescription("The Astronomic Picture of the Day"),
  async execute(interaction, auth, botCache) {
    // defer it. instantly. the nasa servers are slow
    await interaction.defer();

    // try to load a manifest from cache, this is purely for rate limiting reasons
    let apod_json = botCache.get("nasa-apod");

    // if nothing is cached, we need to load the information directly
    if (!apod_json) {
      const apod_res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${auth.nasa_auth}`);
      apod_json = await apod_res.json();

      // cache the manifest                            TTL  m    s  = 1h
      const success = botCache.set("nasa-apod", apod_json, 60 * 60);
      if (!success) {
        console.error("Failed to cache apod.");
        return await interaction.editReply({ content: "Error: Failed to cache APOD." });
      }
    }

    // check if any info on copyright is given
    if (apod_json.copyright === undefined) apod_json.copyright = "None / Public Domain";

    // create the message embed with a bit of constant information
    const embed = new MessageEmbed()
      .setColor("#0b3d91")
      .setAuthor({ name: "NASA APOD", url: "https://api.nasa.gov/", iconURL: "https://botdata.ryzetech.live/perma/NASA.png" })
      .setTitle(`"${apod_json.title}"`);

    // if that "picture" is a video, link it instead of trying to embed it
    // can i rant for a sec? WHY THE F IS IT CALLED PICTURE IF THERE ARE VIDEOS????
    // sure, videos are defo cool but since discord is so bitchy about building embeds it's a nightmare to even handle it
    if (apod_json.media_type === "video") {
      embed.setDescription(`${apod_json.explanation}\n\n*Date: ${apod_json.date}*\n*© ${apod_json.copyright}*\n\n**=> [VIDEO](${apod_json.url}) <=**`);
    }
    else if (apod_json.media_type === "image") {
      embed.setDescription(`${apod_json.explanation}\n\n*Date: ${apod_json.date}*\n*© ${apod_json.copyright}*\n\n**=> [Full Resolution](${apod_json.hdurl}) <=**`);
      embed.setImage(apod_json.url);
    }

    // editing the reply because we defered it earlier
    await interaction.editReply({ embeds: [embed] });
  },
};
