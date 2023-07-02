const { Client, GatewayIntentBits } = require('discord.js');
const { Guilds, GulidVoiceStatus, GulidMessages, MessageContent } = GatewayIntentBits
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
require('dotenv').config();

function Dyoutube(url: string, musicOnly: boolean = true) {
    const formatID: number = 234
    youtubedl(url, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
          'referer:youtube.com',
          'user-agent:googlebot'
        ]
    }).then((output: any) => {
        console.log(output.formats)
        fs.writeFile('output.json', JSON.stringify(output.formats, null, 4), (err: any) => {
            console.error(err);
        });
    })
}

const TOKEN = process.env.DISCORDBOT_TOKEN;

// Cfunctions of commands
async function Cstatus(interaction: any) {
    // console.log(interaction);
    const GulidId = interaction.guildId;
    const name = interaction.guild.name;
    const owner = interaction.guild.ownerId;
    const memberCount = interaction.guild?.memberCount;
    const replyEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(name + '的狀態')
        .addFields(
            { name: '伺服器ID', value: GulidId, inline: true },
            { name: '成員數量', value: memberCount + '人', inline: true },
        )
    if (interaction.guild.iconURL()) {
        replyEmbed.setThumbnail(interaction.guild.iconURL());
    }
    interaction.reply({ embeds: [replyEmbed] });
}

async function Cytm(interaction: any) {
    const channel = interaction.member.voice?.channel;
    if (!channel) {
        interaction.reply('你必須先加入語音頻道');
        return;
    }
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    // const connection = getVoiceConnection(channel.guild.id);
    const player = createAudioPlayer();
    
    // source
    const url: string = interaction.options.getString('url');
    const downloader = Dyoutube(url);
    const resource = createAudioResource("C:\\Users\\yu-si\\Downloads\\imotion_en.mp3");
    // console.log(connection);
    connection.subscribe(player);
    connection.on(VoiceConnectionStatus.Ready, () => {
        console.log(1);
        player.play(resource);
        console.log(2);
        interaction.reply('已播放~');
    })
}

interface IFunctionDict {
    [key: string]: Function;
}

const CFunctions: IFunctionDict = {
    'status': Cstatus,
    'ytm': Cytm,
}

// init the client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
        | GatewayIntentBits.GuildVoiceStates
        | GatewayIntentBits.GuildMessages
    ]
})

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;
    const commandName: string = interaction.commandName;
    // console.log(commandName);
    await CFunctions[commandName](interaction);
});

client.login(TOKEN);