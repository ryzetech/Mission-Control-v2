const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

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
  async execute(interaction, auth, botCache) {
    await interaction.defer();

    // get option thing
    const cam = await interaction.options.getString("camera");

    // get rover manifest
    let manifest_json = botCache.get("nasa-manifest-curiosity");

    // if the manifest has not been cached yet:
    if (!manifest_json) {
      const manifest_res = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${auth.nasa_auth}`);
      manifest_json = await manifest_res.json();

      // set cache                                                     TTL   h    s   = 1h
      const success = botCache.set("nasa-manifest-curiosity", manifest_json, 60 * 60);

      if (!success) {
        console.error("Failed to cache rover manifest.");
      }
    }

    // reverse the camera list so the first one is the default
    const cam_data = manifest_json.photo_manifest.photos.reverse();

    // initialize vars for stats
    let sol = 0;
    let date = "";

    // find latest sol set where the cam has taken an image (and save the date)
    for (const i in cam_data) {
      if (cam_data[i].cameras.includes(cam.toUpperCase())) {
        sol = cam_data[i].sol;
        date = cam_data[i].earth_date;
        break;
      }
    }

    // resolve sol data
    const sol_res = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&camera=${cam}&api_key=${auth.nasa_auth}`);
    const sol_json = await sol_res.json();

    // get last image
    const img = sol_json.photos[sol_json.photos.length - 1].img_src;

    // send
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#0b3d91")
          .setAuthor({ name: "NASA Rover", url: "https://api.nasa.gov/", iconURL: "https://botdata.ryzetech.live/perma/NASA.png" })
          .setTitle(`Curiosity ${cam.toUpperCase()} @ SOL ${sol} | ${date}`)
          .setImage(img),
      ],
    });
  },
};
