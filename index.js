const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const html = require("./generateHTML");

const asyncWriteFile = util.promisify(fs.writeFile);

const googleAPIKey = "AIzaSyCc-vDRqzogLK0gD7Q4EFlJRSPfxDP7Cno";



const questions = () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "color",
            choices: ["red", "blue", "green", "orange", "purple", "pink"],
            message: "What is your favorite color scheme?"
        },
        {
            type: "input",
            name: "username",
            message: "What is your github username?"
        }
    ]);
}

const init = async () => {
    try {
        const data = await questions();
        const githubURL = `https://api.github.com/users/${data.username}`;

    
        axios.get(githubURL)
        .then(function(response) {
            avatar = response.data.avatar_url;

                name = response.data.name;

                location = response.data.location;

                gitHubUrl = response.data.html_url;

                blog = response.data.blog;

                bio = response.data.bio;

                repos = response.data.public_repos;

                followers = response.data.followers;

                stars = response.data.starred_url;

                following = response.data.following;


                axios.get(githubURL + "/starred")
                .then(function (response ) {
                    stars = response.data.length;

                    googleMaps = `https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=12&size=400x400&key=${googleAPIKey}`;

                    let pdf = html.generateHTML(data, avatar, name, location, gitHubUrl, blog, repos, followers, stars, following, googleMaps);

                        asyncWriteFile("index.html", pdf);

                        conversion({

                            file: "index.html",

                            html: pdf

                        },

                            function (err, result) {

                                if (err) {

                                    return console.log(err);

                                }

                                result.stream.pipe(fs.createWriteStream('profile.pdf'));

                                conversion.kill();

                            }

                        )

                    });

            });

        console.log("Successfully created your Portfolio!")

    }

    catch (error) {

        console.log(error);

    }



}



init()











