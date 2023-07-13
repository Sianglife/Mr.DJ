const { Client, GatewayIntentBits } = require('discord.js');
const { Guilds, GulidVoiceStatus, GulidMessages, MessageContent } = GatewayIntentBits
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const download = require('download');
const m3u8ToMp4 = require("m3u8-to-mp4");
const converter = new m3u8ToMp4();


require('dotenv').config();
const mediaPath = process.env.MEDIA_PATH ?? './media';

interface IFunctionDict {
    [key: string]: Function;
}

interface IMediaResponse {
    title: string;
    url: string;
}

function Dyoutube(url: string, formatID: number = 233): Promise<any> {
    return new Promise((resolve, reject) => {
        const youtubedler = youtubedl.exec(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: [
                'referer:youtube.com',
                'user-agent:googlebot',
            ]
        })
            .then((output: any) => {
                // console.log(output.stdout)
                const res = JSON.parse(output.stdout);
                // console.log(JSON.stringify(res));
                // fs.writeFile('output.json', JSON.stringify(res), (err: any)=>console.log(err));
                for (let item of res.formats) {
                    if (item.format_id == formatID) {
                        const response = {
                            title: res.title,
                            url: item.url,
                        } as IMediaResponse;
                        resolve(response);
                        // console.log(response);
                        return;
                    }
                }
            })
            .catch((err: any) => {
                reject(err);
            })
    })
}

const TOKEN = process.env.DISCORDBOT_TOKEN;

// Cfunctions of commands
async function Cstatus(interaction: any) {
    // console.log(interaction);
    const GulidId = interaction.guildId;
    const name = interaction.guild.name;
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
    await interaction.reply({ embeds: [replyEmbed] });
}

async function Cyoutube_download_music(interaction: any) {
    await interaction.deferReply({ ephemeral: true });
    // console.log('start');
    const channel = interaction.member.voice?.channel;
    if (!channel) {
        await interaction.reply('你必須先加入語音頻道');
        return;
    }
    
    const userid = interaction.user.id;
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    // const connection = getVoiceConnection(channel.guild.id);
    const player = createAudioPlayer();

    // source and play
    const url: string = interaction.options.getString('url');
    console.log(0);
    Dyoutube(url)
    .then(async (res: IMediaResponse) => {
            // console.log(res);
            console.log(111);
            interaction.editReply(`準備播放**${res.title}**`, { ephemeral: true });
            const filename = `${mediaPath}/music_${userid}.mp3`;
            await converter
            .setInputFile(res.url)
            .setOutputFile(filename)
            .start();
            // await download(res.url, mediaPath, { filename: `music_${userid}.mp3` });
            console.log(1);
            const resource = createAudioResource(filename);
            console.log(2);
            player.play(resource);
            console.log(4);
            // interaction.edit(`已播放 **${res.title}**`, { ephemeral: false });
            console.log(5);
            connection.subscribe(player);
        })
        .catch(async (err: any) => {
            console.error(err);
            await interaction.reply(`播放失敗: \`\`\`${err}\`\`\``);
            connection.destroy();
        })
}


const CFunctions: IFunctionDict = {
    'status': Cstatus,
    'y': Cyoutube_download_music,
    'yv': async (interaction: any) => { await interaction.reply('敬請期待') }
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