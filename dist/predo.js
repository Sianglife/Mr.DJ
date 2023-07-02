"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashInitialization = void 0;
var _b = require('discord.js'), REST = _b.REST, Routes = _b.Routes, SlashCommandBuilder = _b.SlashCommandBuilder;
require('dotenv').config();
var commands = [
    new SlashCommandBuilder().setName('status').setDescription('顯示機器人狀態'),
    new SlashCommandBuilder().setName('ytm').setDescription('播放Youtube音訊').addStringOption(function (option) { return option.setName('url').setDescription('Youtube Link').setRequired(true); }),
    // new SlashCommandBuilder().setName('ytv').setDescription('播放Youtube影片').addStringOption((option: any) => option.setName('query').setDescription('Youtube Link').setRequired(true)),
];
var TOKEN = process.env.DISCORDBOT_TOKEN;
var CLIENT_ID = (_a = process.env.DISCORDBOT_CLIENT_ID) !== null && _a !== void 0 ? _a : "";
var rest = new REST({ version: '10' }).setToken(TOKEN !== null && TOKEN !== void 0 ? TOKEN : "");
function SlashInitialization() {
    rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
        .then(function () { return console.log("Successfully registered ".concat(commands.length, " application commands.")); });
}
exports.SlashInitialization = SlashInitialization;
if ((process.env.NODE_ENV) == 'production') {
    SlashCommandBuilder();
}
