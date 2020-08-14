import * as fs from "fs";
import yaml from "js-yaml";
import * as Discord from "discord.js";

import { parseSizes } from "./size.js";

interface luine_config { prefix: string, token: string }
let config: luine_config;
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

    config = yaml_obj as luine_config;
}
catch (err) {
    console.error(err.stack || String(err));
    process.exit(err.errno);
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
        if(!args) {
            let end_name_capture = /\(([^)]+)\)$/.exec(message.member.displayName);
            if(!end_name_capture) {
                message.channel.send(`Error: ${message.author}'s nickname does not have any size information.`);
                return;
            }

            let size_txt = end_name_capture[1];
            console.log(size_txt);

            try {
                parseSizes(size_txt);
            }
            catch (e) {
                message.channel.send(`Error: ${message.author}'s nickname does not have any size information.`);
                console.error(e.message);
            }
            // console.log(message.member.displayName.replace(end_name_capture[0], ""));
        }
    }
});

client.login(token);
