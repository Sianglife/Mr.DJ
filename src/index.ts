const { Client, GatewayIntentBits } = require('discord.js');
const { Guilds, GulidVoiceStatus, GulidMessages, MessageContent } = GatewayIntentBits
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const download = require('download');

require('dotenv').config();
const mediaPath = process.env.MEDIA_PATH ?? './media';

interface IFunctionDict {
    [key: string]: Function;
}

interface IMediaResponse {
    title: string;
    url: string;
    format?: any;
    quality?: string;
    error?: string;
}

function Dyoutube(url: string, musicOnly: boolean = true, formatID: number = 249): Promise<any> {
    return new Promise((resolve, reject) => {
        youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: [
                'referer:youtube.com',
                'user-agent:googlebot'
            ]
        })
            .then((output: any) => {
                for (let item of output.formats) {
                    if(item.format_id == formatID) {
                        const response = {
                            title: output.title,
                            url: item.url,
                            // data: item,
                        } as IMediaResponse;
                        console.log(response)
                        resolve(response);
                    }
                }
            })
            .catch((err: any) => {
                console.error(err);
                reject(err);
            });
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
    interaction.reply({ embeds: [replyEmbed] });
}

async function Cyoutube_download_music(interaction: any) {
    const channel = interaction.member.voice?.channel;
    if (!channel) {
        interaction.reply('你必須先加入語音頻道');
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
    Dyoutube(url)
        .then((res: IMediaResponse) => {
            // console.log(res);
            connection.subscribe(player);
            const filename = `${mediaPath}/music_${userid}.mp3`
            fs.rmSync(filename, { recursive: true, force: true });
            download(res.url, filename)
            const resource = createAudioResource(`${mediaPath}/music_${userid}.mp3/videoplayback.webm`);
            interaction.reply(`準備播放**${res.title}**`)
            connection.on(VoiceConnectionStatus.Ready, () => {
                player.play(resource);
                interaction.reply(`已播放 **${res.title}**`);
            });
        })
        .catch((err: any) => {
            console.error(err);
            interaction.reply(`播放失敗: ${err}`);
        })
}


const CFunctions: IFunctionDict = {
    'status': Cstatus,
    'y': Cyoutube_download_music,
    'yv': (interaction:any) => {interaction.reply('敬請期待')}
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