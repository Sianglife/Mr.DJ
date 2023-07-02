const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

export interface ICommand {
  name: string,
  description: string,
}

const commands = [
  new SlashCommandBuilder().setName('status').setDescription('顯示機器人狀態'),
  new SlashCommandBuilder().setName('ytm').setDescription('播放Youtube音訊').addStringOption((option: any) => option.setName('url').setDescription('Youtube Link').setRequired(true)),
  // new SlashCommandBuilder().setName('ytv').setDescription('播放Youtube影片').addStringOption((option: any) => option.setName('query').setDescription('Youtube Link').setRequired(true)),
]

const TOKEN: string | undefined = process.env.DISCORDBOT_TOKEN;
const CLIENT_ID: string | undefined = process.env.DISCORDBOT_CLIENT_ID ?? "";

const rest = new REST({ version: '10' }).setToken(TOKEN ?? "");


rest.put(
  Routes.applicationCommands(CLIENT_ID),
  { body: commands }
)
.then(()=>console.log(`Successfully registered ${commands.length} application commands.`))

