const fs = require('fs');
const yaml = require('js-yaml');
const Discord = require('discord.js');

let config;
try {
    config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
}
catch (err) {
    console.error(err);
    process.exit(err.errno);
}

const { prefix, token } = config;
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    console.log('>', message.content);
    if(message.content === `${prefix}ping`) {
        message.channel.send('pong');
        console.log('Sent pong.');
    }
});

client.login(token);
