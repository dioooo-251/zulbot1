const fs = require('fs')
const chalk = require('chalk')
const moment = require('moment-timezone')
const hariini = moment.tz('Asia/Jakarta').format('dddd, DD MMMM YYYY')	
const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z')
const renSc = new require('./lib/scrape/noapi')
const Fichan = new require('./lib/functions')
const renSc2 = new require('./lib/scrape/scraperf')
const Styles = (text, style = 1) => {
  var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
  var yStr = {
    1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
  };
  var replacer = [];
  xStr.map((v, i) =>
    replacer.push({
      original: v,
      convert: yStr[style].split('')[i]
    })
  );
  var str = text.toLowerCase().split('');
  var output = [];
  str.map((v) => {
    const find = replacer.find((x) => x.original == v);
    find ? output.push(find.convert) : output.push(v);
  });
  return output.join('');
};
const ab = '`'
//=================================================//
// System
global.baileys = require('@whiskeysockets/baileys')
global.usePairingCode = true
//=================================================//
global.saluran = 'https://whatsapp.com'
global.idsal = "12036329@newsletter" // opsional ID saluran
global.gr = 'https://chat.whatsapp.com/E3GQgdKSRCO5lUK7g3WZUj'
global.yt = 'https://youtube.com'
global.ig = 'https://instagram.com/lyrtzs_' // ubah aja
global.email = 'zulhanz2133@gmail.com' //serah
global.ap = 'https://api.kayyofc.biistoreee.com'
global.region = 'new york' // serah
//—————「 Set Nama Own & Bot 」—————//
global.ownername = 'Zul' //ubah jadi nama mu, note tanda ' gausah di hapus!
global.tumburl = 'https://telegra.ph/file/f982355b1257f83642fae.jpg'
//=================================================//
global.rowner = [["6283822770622", "Zul", true], ["62 83822770622", "Zul", false]];
global.owner = ["6283822770622"] // GLOBAL NOMOR 

//==========================Biiofc=======================//
global.keyopenai = `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`
//====================BY Biiofc=============================//
global.botname = 'ZulBot - MD' //ubah jadi nama bot mu, note tanda ' gausah di hapus!
global.packname = 'Create By Zul' // ubah aja ini nama sticker
global.author = `At ${hariini}\n${time}` // ubah aja ini nama sticker
global.hiasan = `	◦  `
global.prefa = ['','!','.',',','🐤','🗿']
global.sp = '⭔' // Gausah Juga
global.wlcm = []
global.wlcmm = []
global.themeemoji = "乂"
global.tTeks = '      ◦‎‎‎  .'
global.tTeks2 = '> '
global.gris = '`'
global.wm = `natan`
global.namaStore = 'natan'
global.ownerStore = 'natan'
//=================================================//
// ApiKeys
global.xfarApi = `OYi6LEZ6QY`
global.caliph = `MyBiibotz`
global.KayBii = `BiiXKayy`
global.zenzkey = `zenzkey_41b4fe7a5d` // ZahwaZein
global.btbApi = `w4SYozNA`
global.ApiNx = `kceScM`
global.skizo = `Twelve`
global.skizo2 = `kyuu`
global.beta = 'BRexrqpD' // https://api.betabotz.org
global.kimz = `kayy`
global.ziro = `ojbSxpdBb4`
global.xyro = `4OfcqDtWMj`
global.rose = 'Aliciazyn'
global.arif = `AR-xQWGNiqhwVaJ`
global.arifyn = `AR-eS8sE0ShK48c`
global.ibeng = `j8a2H4Tly6`
global.ibeng3 = `a5wXu8gj58`
global.ibeng2 =`uYmf6Sgjxl`
global.xeonApi = `976b505f`
global.rbot = `punyaku`
global.miftah = `free`
global.qyuApi = `XjEycutl8w`
global.ApiNeko = `7198c803`
global.ramz = `kayydev`
global.pitu = `3aa275992a`
global.yanzApi = `kyuurzy`
global.ifung = `sCbXLTDebA`
global.alya = `muzan23`
global.zoner = `6D0979`
global.koi = `tWQaPXtQH8`
global.rdnApi = `5o7fzt6nir2`
global.ouzen = `zenzkey_a3ac079e820f` //https://api.ouzen.xyz/
global.kicode = `KC-euHoZ2JgkOhs`
global.maelyn = `SvbxiWHTmt`
global.apikey = `XingYuEmperor`
//=================================================//
global.trash = fs.readFileSync('./process.json')
global.document = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
global.link = ""
global.select = 2
global.footer = Styles(`${tTeks2}_simple whatsapp bot made by Zul_`)
global.footer2 = Styles(`simple whatsapp bot made by Zul`)
global.running = "Pannel Pterodactyl"
global.typemenu = 'v8' 
// 'v1' Image ORI!
// 'v2' Image Kece!
// 'v3' Video GIF!
// 'v4' store!
// 'v5' CallVideo!
// 'v6' Document!
// 'v7' Image and Gif!
// 'v8' Grup!
// 'v9' Type2!
// 'v10' Type2+Gif!
// 'v11' Docu + bussines message
// 'v12' docu + contexinfo
global.REPLICATE_API_TOKEN = 'r8_4pfPFNgOFCN7URD8nsMG2zkWo0gMVr214tNms'
global.apilinode = '75a4103e2105b1bf8913542f88ef1de75e7bf93469fe131e39a4f840878e45ef'
global.apitokendo = `ksoskai`
global.domainotp = 'https://tokoclaude.com/api'
global.apikeyotp = '5e78689a6173667fcce2ae127323eeb4'
global.domain = 'https://natantamvan.panellstoree.com' // Isi Domain Lu
global.apikey2 = 'ptla_iBHfkUzmwOBJWtTox7mHWy4cTOkFBZCRkiMhFrNyYA2' // Isi Apikey Plta Lu
global.capikey2 = 'ptlc_wYy0lRmJYsBoBFzmnl8S5SnrVz9toDMoj3alqxlgvAg' // Isi Apikey Pltc Lu
global.eggsnya = '15' // id eggs yang dipakai
global.location = '1' // id location
//=================================================//
global.scrap = renSc2
global.chApi = renSc
global.Func = Fichan
global.tag = `© 2024 | ${botname}`
global.systemN = `*[ System Notice ]*`
global.mess = {
    ban: Styles('*[ System Access Failed ]* you are banned by the owner'),
    badm: Styles('*[ System Notice ]* please add bot *admin*'),
    regis: Styles(`*[ System Access Failed ]*\n\nKamu belum daftar!\nSilahkan daftar dengan cara *.daftar*`),
    premium: Styles('*[ System Notice ]* this only premium user'),
    search: Styles('🔍 *Search for server. . .*'),
    done: Styles('Done Ga Bang?? Done...'),
    success: Styles('*[ Loaded Success ]*'),
    admin: Styles('*[ System Notice ]* for *admin!* not *npc*'),
    owner: Styles('*[ System Access Failed ]* Access Denied'),
    group: Styles('*[ System Notice ]* Use this in group chat!'),
    private: Styles('*[ System Notice ]* Use this in private chat!'),
    bot: Styles('*[ System Notice ]* Only Bot user'),
    wait: Styles('*[ Loading ]* Please Wait'),
    getdata: Styles('Scraping metadata . . .'),
    fail: Styles('Can\'t get metadata!'),
    error: Styles('*[ System Failed ]* Error, please contact the owner'),
    errorF: Styles('*[ System Failed ]* Sorry this feature is in error.'),
}


// SETTING GAME
global.gamewaktu = 60 // Game waktu
global.bmin = 1000 // Balance minimal 
global.bmax = 10000 // Balance maksimal
//Gausah Juga

// DATABASE GAME

global.suit = {};
global.tictactoe = {};
global.petakbom = {};
global.kuis = {};
global.siapakahaku = {};
global.asahotak = {};
global.susunkata = {};
global.caklontong = {};
global.family100 = {};
global.tebaklirik = {};
global.tebaklagu = {};
global.tebakgambar2 = {};
global.tebakkimia = {};
global.tebakkata = {};
global.tebakkalimat = {};
global.tebakbendera = {};
global.tebakanime = {};
global.kuismath = {};
//=================================================//
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})