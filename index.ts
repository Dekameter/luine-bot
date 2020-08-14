import * as fs from "fs";
import yaml from "js-yaml";
import * as Discord from "discord.js";

import { parseSizes } from "./size.js";

// Adapted from: https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#using-regular-expressions
function getUserFromMention(mention: string) {
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(/^<@!?(\d+)>$/);
    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches) {
        return;
    }

    // However the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    const id = matches[1];

    return client.users.cache.get(id);
}

interface bot_config { prefix: string, token: string }
let config: bot_config;
try {
    let yaml_obj = yaml.safeLoad(fs.readFileSync("config.yml", "utf8"));
    if(typeof yaml_obj === "string" || !yaml_obj) {
        console.error("'config.yml' does not meet correct format.");
        process.exit(-1);
    }
    if(Object.keys(yaml_obj).length !== 2 || !yaml_obj.hasOwnProperty("prefix") || !yaml_obj.hasOwnProperty("token")) {
        console.error("'config.yml' should only have the two properties 'prefix' and 'token'.");
        process.exit(-1)
    }

    config = yaml_obj as bot_config;
}
catch (e) {
    console.error(e.stack || String(e));
    process.exit(-1);
}

const { prefix, token } = config;
// const { prefix, token } = config;
const client = new Discord.Client();

client.once("ready", () => {
    console.log("Ready!");
});

client.on("message", message => {
    if(!message.content.startsWith(prefix) || message.author.bot || !message.member) {
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    if(args.length === 0) {
        return;
    }
    const command = args.shift()!.toLowerCase();

    if(command === 'size') {
        if(args.length === 0) {
            let end_name_capture = /\(([^)]+)\)$/.exec(message.member.displayName);
            if(!end_name_capture) {
                message.channel.send(`Error: ${message.author}'s nickname does not have any size information.`)
                    .then(msg => console.log(`Sent message: ${msg}`))
                    .catch(console.error);
                return;
            }

            let size_txt = end_name_capture[1];

            try {
                let size = parseSizes(size_txt);
                message.channel.send(`${message.author}'s size is currently ${size} meters.`)
                    .then(msg => console.log(`Sent message: ${msg}`))
                    .catch(console.error);
            }
            catch (e) {
                console.error(e.message);
                message.channel.send(`Error: ${message.author}'s nickname does not have any size information.`)
                    .then(msg => console.log(`Sent message: ${msg}`))
                    .catch(console.error);
            }
            // console.log(message.member.displayName.replace(end_name_capture[0], ""));
        }
        else if(args.length === 1) {
            const targetUser = message.mentions.users.first();


        }
    }
});

client.login(token);
