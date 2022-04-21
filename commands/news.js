const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data:
  new SlashCommandBuilder()
    .setName("news")
    .setDescription("Freshly served yCombinator news!"),
  async execute(interaction) {
    await interaction.defer();

    const res = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
    );
    const json = await res.json();

    let i = 0;
    const fields = [];

    while (i < 5) {
      let data;

      // construct link
      const link =
      "https://hacker-news.firebaseio.com/v0/item/" +
      encodeURIComponent(json[i]) +
      ".json";

      // fetch data and parse
      data = await fetch(link);
      data = await data.json();

      if (!data.url) continue;
      const url = "[**Link**](" + data.url + ")\n";

      fields.push({ name: data.title, value: (url + "**Score:** " + data.score + " Points\n**User:** " + data.by) });

      i++;
    }

    await interaction.editReply({ embeds: [
      new MessageEmbed()
        .setAuthor({ auhtor: "HackerNews", url: "https://news.ycombinator.com/", iconURL: "https://botdata.ryzetech.live/perma/ycomb.png" })
        .setTitle("Top Stories")
        .addFields(fields)
        .setTimestamp(),
    ] });
  },
};
