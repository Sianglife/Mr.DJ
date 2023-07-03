var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
var _this = this;
var _b = require('discord.js'), Client = _b.Client, GatewayIntentBits = _b.GatewayIntentBits;
var Guilds = GatewayIntentBits.Guilds, GulidVoiceStatus = GatewayIntentBits.GulidVoiceStatus, GulidMessages = GatewayIntentBits.GulidMessages, MessageContent = GatewayIntentBits.MessageContent;
var _c = require('@discordjs/voice'), joinVoiceChannel = _c.joinVoiceChannel, createAudioPlayer = _c.createAudioPlayer, createAudioResource = _c.createAudioResource, AudioPlayerStatus = _c.AudioPlayerStatus, VoiceConnectionStatus = _c.VoiceConnectionStatus, getVoiceConnection = _c.getVoiceConnection;
var EmbedBuilder = require('discord.js').EmbedBuilder;
var youtubedl = require('youtube-dl-exec');
var fs = require('fs');
var download = require('download');
require('dotenv').config();
var mediaPath = (_a = process.env.MEDIA_PATH) !== null && _a !== void 0 ? _a : './media';
function Dyoutube(url, musicOnly, formatID) {
    if (musicOnly === void 0) { musicOnly = true; }
    if (formatID === void 0) { formatID = 249; }
    return new Promise(function (resolve, reject) {
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
            .then(function (output) {
            for (var _i = 0, _a = output.formats; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.format_id == formatID) {
                    var response = {
                        title: output.title,
                        url: item.url,
                        // data: item,
                    };
                    console.log(response);
                    resolve(response);
                }
            }
        })
            .catch(function (err) {
            console.error(err);
            reject(err);
        });
    });
}
var TOKEN = process.env.DISCORDBOT_TOKEN;
// Cfunctions of commands
function Cstatus(interaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var GulidId, name, memberCount, replyEmbed;
        return __generator(this, function (_b) {
            GulidId = interaction.guildId;
            name = interaction.guild.name;
            memberCount = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.memberCount;
            replyEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(name + '的狀態')
                .addFields({ name: '伺服器ID', value: GulidId, inline: true }, { name: '成員數量', value: memberCount + '人', inline: true });
            if (interaction.guild.iconURL()) {
                replyEmbed.setThumbnail(interaction.guild.iconURL());
            }
            interaction.reply({ embeds: [replyEmbed] });
            return [2 /*return*/];
        });
    });
}
function Cyoutube_download_music(interaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var channel, userid, connection, player, url;
        return __generator(this, function (_b) {
            channel = (_a = interaction.member.voice) === null || _a === void 0 ? void 0 : _a.channel;
            if (!channel) {
                interaction.reply('你必須先加入語音頻道');
                return [2 /*return*/];
            }
            userid = interaction.user.id;
            connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            player = createAudioPlayer();
            url = interaction.options.getString('url');
            Dyoutube(url)
                .then(function (res) {
                // console.log(res);
                connection.subscribe(player);
                var filename = "".concat(mediaPath, "/music_").concat(userid, ".mp3");
                fs.rmSync(filename, { recursive: true, force: true });
                download(res.url, filename);
                var resource = createAudioResource("".concat(mediaPath, "/music_").concat(userid, ".mp3/videoplayback.webm"));
                interaction.reply("\u6E96\u5099\u64AD\u653E**".concat(res.title, "**"));
                connection.on(VoiceConnectionStatus.Ready, function () {
                    player.play(resource);
                    interaction.reply("\u5DF2\u64AD\u653E **".concat(res.title, "**"));
                });
            })
                .catch(function (err) {
                console.error(err);
                interaction.reply("\u64AD\u653E\u5931\u6557: ".concat(err));
            });
            return [2 /*return*/];
        });
    });
}
var CFunctions = {
    'status': Cstatus,
    'y': Cyoutube_download_music,
    'yv': function (interaction) { interaction.reply('敬請期待'); }
};
// init the client
var client = new Client({
    intents: [
        GatewayIntentBits.Guilds
            | GatewayIntentBits.GuildVoiceStates
            | GatewayIntentBits.GuildMessages
    ]
});
client.once('ready', function () {
    console.log('Ready!');
});
client.on('interactionCreate', function (interaction) { return __awaiter(_this, void 0, void 0, function () {
    var commandName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!interaction.isChatInputCommand())
                    return [2 /*return*/];
                commandName = interaction.commandName;
                // console.log(commandName);
                return [4 /*yield*/, CFunctions[commandName](interaction)];
            case 1:
                // console.log(commandName);
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
client.login(TOKEN);
