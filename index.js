require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { getAIResponse,getChatSummary } = require('./src/services/ai.service');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('clientReady', () => {
    console.log("Bot is online!");
});

// Welcome Message Event

client.on('guildMemberAdd', (member) => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome' || ch.name === 'general');
    if (channel) {
        channel.send(`Welcome **${member.displayName}** to ${member.guild.name} 🎉`);
    }
});

const badWords = [
    "sexcy",
    "sexy",
    "harami",
    "kutta",
    "saale",
    "chutiya",
    "kamina",
    "pagal",
    "stupid",
    "besharam"
];

// AI CHAT FEATURE
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.mentions.everyone) return;

// Bad Word Kick 

   const msgContent = message.content.toLowerCase();
   const messageWords = msgContent.split(/ +/);
   const isAbusive = badWords.some(word => messageWords.includes(word));

    if (isAbusive) {
        try {
            
            await message.member.kick("Used abusive language.");

          
            await message.channel.send(`${message.author.displayName} has been kicked for using abusive language.`);
            
        } catch (error) {
            console.error("Kick Error:", error);

            message.channel.send("Unable to kick the user.");
        }
    }

// Summary
    if (message.content === '!saransh' || message.content === '!summary') {
        
        
        await message.channel.sendTyping();

        try {
           
            const messages = await message.channel.messages.fetch({ limit: 20 });
            
            const chatLog = messages.reverse().map(m => `${m.author.username}: ${m.content}`).join('\n');

           
            const summary = await getChatSummary(chatLog);

         
            message.reply(` Chat Summary: \n\n${summary}`);

        } catch (error) {
            console.error(error);
            message.reply("Error Generating Summary.");
        }
    }

// Ai response 
    if (message.mentions.has(client.user)) {

        
        await message.channel.sendTyping();

      const query = message.content.replace(/<@!?[0-9]+>/, '').trim();

        if (!query) return message.reply("Ask Something  (!ask <question>)");


        
        const aiReply = await getAIResponse(query);

       
        if (aiReply.length > 2000) {
            message.reply(aiReply.substring(0, 1990) + "...");
        } else {
            message.reply(aiReply);
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);