const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data:
    new SlashCommandBuilder()
      .setName("pokemon")
      .setDescription("Search the allmighty Pokédex!")
      .addStringOption(option => {
        return option
          .setName("type")
          .setDescription("The Pokémon you want to look for")
          .setRequired(true);
      }),
  async execute(interaction) {
    const pokemon = await interaction.options.getString("type");

    const embed = new MessageEmbed();

    try {
      const res = fetch(
        "https://some-random-api.ml/pokedex?pokemon=" + encodeURIComponent(pokemon),
      );
      const json = await res.json();

      if (!json.error) {
        let typelist = "",
          genderlist = "",
          evoLine = "",
          abilities = "",
          eggGroups = "",
          species = "";


        // processing info into a nice format
        // remember this shit? thats the EXACT SAME code i have used in v1 and i cant come up with anything better
        for (const i in json.type) { typelist += i == 0 ? json.type[i] : ", " + json.type[i]; }
        for (const i in json.gender) { genderlist += i == 0 ? json.gender[i] : " / " + json.gender[i]; }
        for (const i in json.species) { species += i == 0 ? json.species[i] : " " + json.species[i]; }
        for (const i in json.family.evolutionLine) {
          evoLine += i == 0 ? "" : " => ";
          evoLine +=
            json.family.evolutionLine[i] ===
              json.name.charAt(0).toUpperCase() + json.name.slice(1)
              ? "**" + json.family.evolutionLine[i] + "**"
              : json.family.evolutionLine[i];
        }
        if (json.family.evolutionLine.length == 0) evoLine = "N/A";
        for (const i in json.abilities) { abilities += i == 0 ? json.abilities[i] : ", " + json.abilities[i]; }
        for (const i in json.egg_groups) { eggGroups += i == 0 ? json.egg_groups[i] : ", " + json.egg_groups[i]; }


        embed
          .setAuthor({ name: "Pokédex powered by SRA", url: "https://some-random-api.ml/", iconURL: "https://botdata.ryzetech.live/perma/pokeball.png" })
          .setTitle(json.name.charAt(0).toUpperCase() + json.name.slice(1))
          .setDescription("**" + species + "**\n" + json.description)
          .setThumbnail(json.sprites.animated)
          .addFields(
            { name: "Type(s)", value: typelist, inline: true },
            { name: "ID", value: json.id, inline: true },
            { name: "Generation", value: json.generation, inline: true },
            { name: "Height", value: json.height, inline: true },
            { name: "Weight", value: json.weight, inline: true },
            {
              name: "Base Experience",
              value: json.base_experience,
              inline: true,
            },
            { name: "Gender distribution", value: genderlist, inline: false },
            { name: "HP", value: json.stats.hp, inline: true },
            { name: "Attack", value: json.stats.attack, inline: true },
            { name: "Defense", value: json.stats.defense, inline: true },
            { name: "Speed", value: json.stats.defense, inline: true },
            {
              name: "Special Attack",
              value: json.stats.sp_atk,
              inline: true,
            },
            {
              name: "Special Defense",
              value: json.stats.sp_def,
              inline: true,
            },
            { name: "TOTAL", value: json.stats.total, inline: false },
            { name: "Abilities", value: abilities, inline: true },
            { name: "Egg Groups", value: eggGroups, inline: true },
            { name: "Evolution Line", value: evoLine, inline: true },
          );
      }
      else {
        embed
          .setAuthor({ name: "Pokédex powered by SRA", url: "https://some-random-api.ml/", iconURL: "https://botdata.ryzetech.live/perma/pokeball.png" })
          .setTitle("❌ An error occured! :(")
          .setThumbnail("https://botdata.ryzetech.live/perma/missingno.png")
          .setDescription("Error Message: *" + json.error + "*");
      }
      await interaction.reply({ embeds: [embed] });
    }
    catch (error) {
      await interaction.reply({ message: `Something went terribly wrong. Sorry :(\n\nERRMSG:\n*${error.message}*` });
    }
  },
};
