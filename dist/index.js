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
var _this = this;
var _a = require('discord.js'), Client = _a.Client, GatewayIntentBits = _a.GatewayIntentBits;
var Guilds = GatewayIntentBits.Guilds, GulidVoiceStatus = GatewayIntentBits.GulidVoiceStatus, GulidMessages = GatewayIntentBits.GulidMessages, MessageContent = GatewayIntentBits.MessageContent;
var _b = require('@discordjs/voice'), joinVoiceChannel = _b.joinVoiceChannel, createAudioPlayer = _b.createAudioPlayer, createAudioResource = _b.createAudioResource, AudioPlayerStatus = _b.AudioPlayerStatus, VoiceConnectionStatus = _b.VoiceConnectionStatus, getVoiceConnection = _b.getVoiceConnection;
var EmbedBuilder = require('discord.js').EmbedBuilder;
require('dotenv').config();
var TOKEN = process.env.DISCORDBOT_TOKEN;
// Cfunctions of commands
function Cstatus(interaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var GulidId, name, owner, memberCount, replyEmbed;
        return __generator(this, function (_b) {
            GulidId = interaction.guildId;
            name = interaction.guild.name;
            owner = interaction.guild.ownerId;
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
function Cytm(interaction) {
    return __awaiter(this, void 0, void 0, function () {
        var url, connection, player, resource;
        return __generator(this, function (_a) {
            url = interaction.options.getString('url');
            connection = getVoiceConnection(interaction.guildId);
            player = createAudioPlayer();
            resource = createAudioResource(url);
            connection.subscribe(player);
            player.play(resource);
            connection.on(VoiceConnectionStatus.Ready, function () {
                interaction.reply('已撥放~');
            });
            return [2 /*return*/];
        });
    });
}
var Cfunctions = {
    "status": Cstatus
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
    var commandName, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!interaction.isChatInputCommand())
                    return [2 /*return*/];
                commandName = interaction.commandName;
                _a = commandName;
                switch (_a) {
                    case 'status': return [3 /*break*/, 1];
                    case 'ytm': return [3 /*break*/, 3];
                }
                return [3 /*break*/, 5];
            case 1: return [4 /*yield*/, Cstatus(interaction)];
            case 2:
                _b.sent();
                return [3 /*break*/, 7];
            case 3: return [4 /*yield*/, Cytm(interaction)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [4 /*yield*/, interaction.reply('Unknown command.')];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
client.login(TOKEN);
