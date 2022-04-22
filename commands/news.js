const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data:
    new SlashCommandBuilder()
      .setName("news")
      .setDescription("Freshly served yCombinator news!"),
  async execute(interaction, _auth, botCache) {
    await interaction.defer();

    let news = await botCache.get("news");

    if (!news) {
      const res = await fetch(
        "https://hacker-news.firebaseio.com/v0/topstories.json",
      );
      const json = await res.json();

      news = json;

      const success = botCache.set("news", json, 2 * 60 * 60);

      if (!success) {
        console.error("Failed to cache news.");
        return await interaction.editReply({ content: "Error: Failed to cache news manifest." });
      }
    }

    let i = 0;
    const fields = [];

    while (i < 5) {
      let data = botCache.get(`news_${i}`);

      if (!data) {
        // construct link
        const link =
          "https://hacker-news.firebaseio.com/v0/item/" +
          encodeURIComponent(news[i]) +
          ".json";

        // fetch data and parse
        data = await fetch(link);
        data = await data.json();

        const success = botCache.set(`news_${i}`, data, 60 * 60);

        if (!success) {
          console.error("Failed to cache news article.");
          return await interaction.editReply({ content: "Error: Failed to cache an article." });
        }
      }

      if (!data.url) continue;
      const url = "[**Link**](" + data.url + ")\n";

      fields.push({ name: data.title, value: (url + "**Score:** " + data.score + " Points\n**User:** " + data.by) });

      i++;
    }

    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setAuthor({ auhtor: "HackerNews", url: "https://news.ycombinator.com/", iconURL: "https://botdata.ryzetech.live/perma/ycomb.png" })
          .setTitle("Top Stories")
          .addFields(fields)
          .setTimestamp(),
      ],
    });
  },
};
