const queryString = require("query-string");
const colors = require("../../colors.json");
const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

// Create a reuseable axios instance
const axiosInstance = axios.create({
    baseURL: "https://api.thecatapi.com/v1/images",
    timeout: 5000,
    headers: {
        // you need an API key to get access to all the iamges, or see the requests you've made in the stats for your account
        "X-API-KEY": process.env.CAT_API_KEY
    }
});

module.exports = {
    name: "cat",
    aliases: ["meow", "purr"],
    category: "entertainment",
    description: "Displays a random cat",
    usage: [`\`-<command | alias>\``],
    run: async (bot, message, args) => {
        let nsg = await message.channel.send("Generating...");

        async function loadImage(sub_id) {
            let query_params = {
                has_breeds: true, // we only want images with at least one breed data object - name, temperament etc
                mime_types: "jpg,png", // we only want static images as Discord doesn't like gifs
                size: "small", // get the small images as the size is prefect for Discord's 390x256 limit
                sub_id: sub_id, // pass the message senders username so you can see how many images each user has asked for in the stats
                limit: 1, // only need one
            };
            // convert this obejc to query string
            let querystring = queryString.stringify(query_params);
            let response;

            try {
                // Send the request
                response = (await axiosInstance.get(`/search?${querystring}`)).data;
            } catch (e) {
                console.log(e);
            }
            return response;
        }

        let breed;

        try {
            // pass the name of the user who sent the message for stats later, expect an array of images to be returned.
            let images = await loadImage(message.author.username);

            // get the Image, and first Breed from the returned object.
            let image = images[0];
            breed = image.breeds[0];

            //console.log("message processed", "showing", breed);
            let cEmbed = new MessageEmbed()
                .setTitle("Here's a random cat!")
                .setColor(colors.Turquoise)
                .addFields(
                    {
                        name: "**Breed:**",
                        value: `*${breed.name}*`,
                        inline: true
                    },
                    {
                        name: "**Temperament:**",
                        value: `*${breed.temperament}*`,
                        inline: true
                    },
                    {
                        name: "**Life Span:**",
                        value: `*${breed.life_span} years*`,
                        inline: true
                    },
                    {
                        name: "**Description:**",
                        value: `${breed.description}`,

                    },

                )
                .setImage(image.url);
            message.channel.send(cEmbed);
        } catch (error) {
            const embed = new MessageEmbed()
                .setColor(colors.Red)
                .setTitle("Error")
                .setDescription('Oops, it seems that I took too long to respond. Please try again.');
            message.channel.send(embed);
            console.log(breed.name);
        }
        nsg.delete();
    },
};
