const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data:
    new SlashCommandBuilder()
      .setName("news")
      .setDescription("Freshly served yCombinator news!"),
  async execute(interaction, _auth, botCache) {
    // defering here is absolutely crucial
    // the endpoint often needs several seconds to process the sheer amount of stories
    // seriously yComb, what the fuck? stop using firebase
    await interaction.defer();

    // try to cache the news manifest
    // fun fact: this actually hasn't to do with rate limiting since there is no such rate limit
    // it has rather to do with the long waiting time
    let news = await botCache.get("news");

    // get the news to cache them
    if (!news) {
      const res = await fetch(
        "https://hacker-news.firebaseio.com/v0/topstories.json",
      );
      const json = await res.json();

      news = json;

      // cache the news manifest             TTL  m    s
      const success = botCache.set("news", json, 30 * 60);

      if (!success) {
        console.error("Failed to cache news.");
        return await interaction.editReply({ content: "Error: Failed to cache news manifest." });
      }
    }

    let i = 0;
    const fields = [];

    // get the first five stories
    while (i < 5) {
      // check if the story is cached by id
      let data = botCache.get(`news_${news[i]}`);

      if (!data) {
        // construct link
        const link =
          "https://hacker-news.firebaseio.com/v0/item/" +
          encodeURIComponent(news[i]) +
          ".json";

        // fetch data and parse
        data = await fetch(link);
        data = await data.json();

        // the stories have a long lifetime since they are unlikely to be changed
        //                                                TTL h    m    s
        const success = botCache.set(`news_${news[i]}`, data, 4 * 60 * 60);

        if (!success) {
          console.error("Failed to cache news article.");
          return await interaction.editReply({ content: "Error: Failed to cache an article." });
        }
      }

      // continue without increment if the story doesn't have a url
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
