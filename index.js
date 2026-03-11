const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = ".";

// AYARLAR
const erkekRol = "1479821817664507976";
const kadinRol = "1479821817664507977";
const kayitsizRol = "1479821817639206961";
const logKanal = "1479821818297712707";

let kayitSayac = {};

client.on("ready", () => {
  console.log(`${client.user.tag} aktif`);
});

// SUNUCUYA GİRİNCE KAYITSIZ
client.on("guildMemberAdd", member => {
  member.roles.add(kayitsizRol).catch(()=>{});
});

// KOMUTLAR
client.on("messageCreate", async message => {

  if(message.author.bot) return;
  if(!message.content.startsWith(prefix)) return;

  const args = message.content.split(" ");
  const cmd = args[0];

  if(cmd === ".k"){

    const id = args[1];
    const isim = args[2];
    const yas = args[3];

    if(!id || !isim || !yas)
      return message.reply("Kullanım: .k ID İsim Yaş");

    let uye;

    try{
      uye = await message.guild.members.fetch(id);
    }catch{
      return message.reply("Kullanıcı bulunamadı");
    }

    const sonHarf = isim.slice(-1).toLowerCase();

    if(sonHarf === "a"){

      await uye.roles.add(kadinRol);
      await uye.roles.remove([erkekRol, kayitsizRol]);

      message.channel.send(`${uye} kadın olarak kayıt edildi ♀️`);

    }else{

      await uye.roles.add(erkekRol);
      await uye.roles.remove([kadinRol, kayitsizRol]);

      message.channel.send(`${uye} erkek olarak kayıt edildi ♂️`);

    }

    await uye.setNickname(`${isim} | ${yas}`).catch(()=>{});

    if(!kayitSayac[message.author.id])
      kayitSayac[message.author.id] = 0;

    kayitSayac[message.author.id]++;

    const log = message.guild.channels.cache.get(logKanal);

    if(log){
      log.send(`${message.author} → ${uye} kayıt etti`);
    }

  }

  if(cmd === ".kayıtsay"){
    message.reply(`Toplam kayıtın: ${kayitSayac[message.author.id] || 0}`);
  }

});

// LOG
client.on("roleDelete", role => {

  const log = role.guild.channels.cache.get(logKanal);

  if(log){
    log.send(`⚠️ Rol silindi: ${role.name}`);
  }

});

client.on("channelDelete", channel => {

  const log = channel.guild.channels.cache.get(logKanal);

  if(log){
    log.send(`⚠️ Kanal silindi: ${channel.name}`);
  }

});

client.login("MTQ4MTEwMDc3Nzc1MjYyNTMzMw.GOLn7I.Npup6TPs8t35d0v5QcHwBxpMbwped_FqMiwmZ4");