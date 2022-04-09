const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

const { nasa_auth } = require("../token.json");

module.exports = {
  data:
    new SlashCommandBuilder()
      .setName("rover")
      .setDescription("Get the latest image from one of Curiosity's cameras")
      .addStringOption(option => {
        return option
          .setName("camera")
          .setDescription("The camera from which the image should be fetched")
          .setRequired(true)
          .addChoices(
            {
              choices: [
                ["Front Hazard Avoidance Camera", "fhaz"],
                ["Rear Hazard Avoidance Camera", "rhaz"],
                ["Mast Camera", "mast"],
                ["Chemistry and Camera Complex", "chemcam"],
                ["Mars Hand Lens Imager", "mahli"],
                ["Mars Descent Imager", "mardi"],
                ["Navigation Camera", "navcam"],
              ],
            },
          );
      }),
  async execute(interaction) {
    const manifest_res = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${nasa_auth}`);
    const manifest_json = await manifest_res.json();

    // TODO: finish!

    await interaction.reply("thing");
  },
};
