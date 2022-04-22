const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data:
    new SlashCommandBuilder()
      .setName("spacex")
      .setDescription("Information about the next SpaceX launch"),
  async execute(interaction) {
    const mission_res = await fetch("https://api.spacexdata.com/v4/launches/next");
    const mission_json = await mission_res.json();

    mission_json.date_unix = mission_json.date_unix * 1000;

    const embed = new MessageEmbed()
      .setAuthor({ name: "SpaceX - Launch", iconURL: "https://botdata.ryzetech.live/perma/elon.png" })
      .setTitle(mission_json.name)
      .setThumbnail(
        mission_json.links.patch.small,
      );

    if (!mission_json.details) embed.setDescription("No description available");
    else embed.setDescription(mission_json.details);

    if (mission_json.tbd) {
      embed.addField("Countdown to T-0", "TO BE DETERMINED");
    }
    else {
      embed.addField(
        "Countdown to T-0",
        `<t:${mission_json.date_unix}\n*Accuracy level: ${mission_json.date_precision}*`,
      );
    }

    if (mission_json.cores[0].core === null) {
      embed.addField("Booster Information", "**NO INFORMATION AVAILABLE**");
    }
    else {
      const core_res = await fetch("https://api.spacexdata.com/v4/cores/" + mission_json.cores[0].core);
      const core_json = await core_res.json();

      embed.addField(
        "Booster Information",
        `Serial NO: ${core_json.serial}\nReuse Counter: ${core_json.reuse_count}\nLast Update: \`${core_json.last_update}\``,
      );
    }

    if (mission_json.launchpad === null) {
      embed.addField("Launchpad Information", "**NO INFORMATION AVAILABLE**");
    }
    else {
      const launchpad_res = await fetch("https://api.spacexdata.com/v4/launchpads/" + mission_json.launchpad);
      const launchpad_json = await launchpad_res.json();

      embed.addField(
        "Launchpad Information",
        `Name: ${launchpad_json.name}\nLocality: \`${launchpad_json.locality}, ${launchpad_json.region}\`\nSuccess Rate: ${launchpad_json.launch_successes}/${launchpad_json.launch_attempts}`,
      );
    }

    if (mission_json.cores[0].landpad === null) {
      embed.addField(
        "Landpad Information",
        "**NO INFORMATION AVAILABLE**",
      );
    }
    else {
      const landpad_res = await fetch("https://api.spacexdata.com/v4/landpads/" + mission_json.cores[0].landpad);
      const landpad_json = await landpad_res.json();

      embed.addField(
        "Landpad Information",
        `Name: ${landpad_json.full_name}\nLocality: \`${landpad_json.locality}, ${landpad_json.region}\`\nSuccess Rate: ${landpad_json.landing_successes}/${landpad_json.landing_attempts}`,
      );
    }

    if (mission_json.payloads[0] === null) {
      embed.addField(
        "Payload Information",
        "**NO INFORMATION AVAILABLE**",
      );
    }
    else {
      let fieldValue = "";

      for (const index in mission_json.payloads) {
        const payload_res = await fetch("https://api.spacexdata.com/v4/payloads/" + mission_json.payloads[index]);
        const payload_json = await payload_res.json();

        if (payload_json.mass_kg === null) payload_json.mass_kg = "N/A";
        else payload_json.mass_kg += "kg";

        fieldValue += `**-- ${parseInt(index) + 1} --**\n`;
        fieldValue += `Name: ${payload_json.name}\nType: ${payload_json.type}\nOrbit: ${payload_json.orbit}\nMass: ${payload_json.mass_kg}\n\n`;
      }

      embed.addField(
        "Payload Information",
        fieldValue,
      );
    }

    if (mission_json.capsules.length > 0) {
      const capsule_res = await fetch("https://api.spacexdata.com/v4/capsules/" + mission_json.capsules[0]);
      const capsule_json = await capsule_res.json();

      const fieldValue = `Type: ${capsule_json.type}\nSerial: ${capsule_json.serial}\nReuse Counter: ${capsule_json.reuse_count}\nLast Update: \`${capsule_json.last_update}\``;

      embed.addFields(
        {
          name: "Dragon Information",
          value: fieldValue,
        },
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
