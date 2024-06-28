/*
## Credits
- Creator: natan ⚡
- Base: natan ⚡
- Creator Nomor: +62 819-3572-3403
## Don't delete this credit
*/
require('./setting')
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  PHONENUMBER_MCC,
  generateWAMessageFromContent,
  generateMessageID,
  getMessage,
  downloadContentFromMessage,
  makeInMemoryStore,
  jidDecode,
  getAggregateVotesInPollMessage,
  proto
} = require("@whiskeysockets/baileys")
const fs = require('fs')
const pino = require('pino')
const chalk = require('chalk')
const path = require('path')
const axios = require('axios')
const FileType = require('file-type')
const readline = require("readline");
const yargs = require('yargs/yargs')
const NodeCache = require("node-cache")
const pairingCode = process.argv.includes("-pairing");
const msgRetryCounterCache = new NodeCache()
const {
  HttpsProxyAgent
} = require("https-proxy-agent");
const agent = new HttpsProxyAgent("http://proxy:clph123@103.123.63.106:3128");
const _ = require('lodash')
const {
  Boom
} = require('@hapi/boom')
const PhoneNumber = require('awesome-phonenumber')
const {
  imageToWebp,
  imageToWebp3,
  videoToWebp,
  writeExifImg,
  writeExifImgAV,
  writeExifVid
} = require('./lib/exif')
const {
  smsg,
  isUrl,
  generateMessageTag,
  getBuffer,
  getSizeMedia,
  fetchJson,
  await,
  sleep
} = require('./lib/myfunc')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const question = (text) => new Promise((resolve) => rl.question(text, resolve));
//=================================================//
var low
try {
  low = require('lowdb')
} catch (e) {
  low = require('./lib/lowdb')
}
//=================================================//
const {
  Low,
  JSONFile
} = low
const mongoDB = require('./lib/mongoDB')
//=================================================//
//=================================================//
const store = makeInMemoryStore({
  logger: pino().child({
    level: 'silent',
    stream: 'store'
  })
})
//=================================================//
opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : /mongodb/i.test(opts['db']) ? new mongoDB(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`))
DATABASE = db
loadDatabase = async function loadDatabase() {
  if (db.READ) return new Promise((resolve) => setInterval(function() {
    (!db.READ ? (clearInterval(this), resolve(db.data == null ? loadDatabase() : db.data)) : null)
  }, 1 * 1000))
  if (db.data !== null) return
  db.READ = true
  await db.read()
  db.READ = false
  db.data = {
    users: {},
    chats: {},
    settings: {},
    ...(db.data || {})
  }
  db.chain = _.chain(db.data)
}
loadDatabase()
if (!opts['test']) {
  if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write()
    //if (!opts['tmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp'], tmp.forEach(filename => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])))
  }, 30 * 1000)
}
//=================================================//
//=================================================//
global.sessionName = 'KayySession'
async function connectToWhatsApp() {
    process.on('unhandledRejection', (err) => console.error(err))
    const {
      state,
      saveCreds
    } = await useMultiFileAuthState("./" + sessionName);
  const kayydev = makeWASocket({
      printQRInTerminal: !pairingCode,
      logger: pino({
        level: "silent",
      }),
      browser: ['Ubuntu', 'Edge', '110.0.1587.56'],
      auth: state,
      msgRetryCounterCache,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 0,
      keepAliveIntervalMs: 10000,
      emitOwnEvents: true,
      fireInitQueries: true,
      generateHighQualityLinkPreview: true,
      syncFullHistory: true,
      markOnlineOnConnect: true,
      patchMessageBeforeSending: message => {
        const requiresPatch = !!(message.buttonsMessage || message.listMessage);
        if (requiresPatch) {
          message = {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadataVersion: 2,
                  deviceListMetadata: {}
                },
                ...message
              }
            }
          };
        }
        return message;
      },
      getMessage
    });
    kayydev.ev.on("creds.update", saveCreds)
    if (pairingCode && !kayydev.authState.creds.registered) {
      console.log(chalk.black(chalk.bgCyan(`Enter Mobile Number`)))
      let phoneNumber = await question(`${chalk.bgCyan('- Number')}: `);
      phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
      if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
        console.log(chalk.black(chalk.bgRed(`Start with your country's WhatsApp code, Example 62xxx:`)));
        console.log(chalk.black(chalk.bgCyan(`Enter Mobile Number:`)));
        phoneNumber = await question(`${chalk.black(chalk.bgWhite('- Number'))}: `);
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
      }
      let code = await kayydev.requestPairingCode(phoneNumber)
      code = code?.match(/.{1,4}/g)?.join("-") || code
      console.log(chalk.black(chalk.bgBlue(`Your Pairing Code`)));
      console.log(chalk.black(chalk.bgWhite(`Code: ${code}`)));
      rl.close()
    }
  //=================================================//
  kayydev.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {}
      return decode.user && decode.server && decode.user + '@' + decode.server || jid
    } else return jid
  }
  //=================================================//
  kayydev.ev.on('messages.upsert', async chatUpdate => {
    try {
      mek = chatUpdate.messages[0]
      if (!mek.message) return
      mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
      if (mek.key && mek.key.remoteJid === 'status@broadcast') return
      if (!kayydev.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
      if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
      m = smsg(kayydev, mek, store)
      require("./kayydev")(kayydev, m, chatUpdate, store)
    } catch (err) {
      console.log(err)
    }
  })
  kayydev.ev.on('call', async (celled) => {
    let botNumber = await kayydev.decodeJid(kayydev.user.id)
    let koloi = global.anticall
    if (!koloi) return
    console.log(celled)
    for (let kopel of celled) {
      if (kopel.isGroup == false) {
        if (kopel.status == "offer") {
          let nomer = await kayydev.sendTextWithMentions(kopel.from, `*${kayydev.user.name}* tidak bisa menerima panggilan ${kopel.isVideo ? `video` : `suara`}. Maaf @${kopel.from.split('@')[0]} kamu akan diblokir. Silahkan hubungi Owner membuka blok !`)
          kayydev.sendContact(kopel.from, owner.map(i => i.split("@")[0]), nomer)
          await sleep(8000)
          await kayydev.updateBlockStatus(kopel.from, "block")
        }
      }
    }
  })
  //=================================================//
  kayydev.ev.on('group-participants.update', async (anu) => {
    if (!wlcm.includes(anu.id)) return
    console.log(anu)
    try {
      let metadata = await kayydev.groupMetadata(anu.id)
      let participants = anu.participants
      for (let num of participants) {
        // Get Profile Picture User
        try {
          ppuser = await kayydev.profilePictureUrl(num, 'image')
        } catch {
          ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
        }
        // Get Profile Picture Group
        try {
          ppgroup = await kayydev.profilePictureUrl(anu.id, 'image')
        } catch {
          ppgroup = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
        }
        if (anu.action == 'add') {
          let wel = `Hii @${num.split("@")[0]},\nWelcome To ${metadata.subject}`
          kayydev.sendMessage(anu.id, {
            document: fs.readFileSync('./media/doc.pdf'),
            thumbnailUrl: ppuser,
            mimetype: 'application/pdf',
            fileLength: 99999,
            pageCount: '100',
            fileName: `Bot Made By Natannn`,
            caption: wel,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: true,
                title: `© Welcome Message`,
                body: `${botname}`,
                thumbnailUrl: ppuser,
                sourceUrl: global.gr,
                mediaType: 1,
                renderLargerThumbnail: true
              }
            }
          })
        } else if (anu.action == 'remove') {
          let txtLeft = `GoodBye @${num.split("@")[0]} 👋\nLeaving From ${metadata.subject}`
          kayydev.sendMessage(anu.id, {
            document: fs.readFileSync('./media/doc.pdf'),
            thumbnailUrl: ppuser,
            mimetype: 'application/pdf',
            fileLength: 99999,
            pageCount: '100',
            fileName: `Bot Made By Natannn`,
            caption: txtLeft,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: true,
                title: `© GoodBye Message`,
                body: `${botname}`,
                thumbnailUrl: ppuser,
                sourceUrl: global.gr,
                mediaType: 1,
                renderLargerThumbnail: true
              }
            }
          })
        } else if (anu.action == 'promote') {
          let a = `Congratulations @${num.split("@")[0]}, on being promoted to admin of this group ${metadata.subject} 🎉`
          kayydev.sendMessage(anu.id, {
            document: fs.readFileSync('./media/doc.pdf'),
            thumbnailUrl: ppuser,
            mimetype: 'application/pdf',
            fileLength: 99999,
            pageCount: '100',
            fileName: `Bot Made By Natan`,
            caption: a,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: true,
                title: `Promoted In ${metadata.subject}`,
                body: `${botname}`,
                thumbnailUrl: ppuser,
                sourceUrl: global.gr,
                mediaType: 1,
                renderLargerThumbnail: true
              }
            }
          })
        } else if (anu.action == 'demote') {
          let a = `Congratulations @${num.split("@")[0]}, on being demote to admin of this group ${metadata.subject} 🎉`
          kayydev.sendMessage(anu.id, {
            document: fs.readFileSync('./media/doc.pdf'),
            thumbnailUrl: ppuser,
            mimetype: 'application/pdf',
            fileLength: 99999,
            pageCount: '100',
            fileName: `Bot Made By Natan`,
            caption: a,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: true,
                title: `Demoted In ${metadata.subject}`,
                body: `${botname}`,
                thumbnailUrl: ppuser,
                sourceUrl: global.gr,
                mediaType: 1,
                renderLargerThumbnail: true
              }
            }
          })
        }
      }
    } catch (err) {
      console.log(err)
    }
  })
  //=================================================//
  kayydev.ev.on('contacts.update', update => {
    for (let contact of update) {
      let id = kayydev.decodeJid(contact.id)
      if (store && store.contacts) store.contacts[id] = {
        id,
        name: contact.notify
      }
    }
  })
  //=================================================//
  kayydev.getName = (jid, withoutContact = false) => {
    id = kayydev.decodeJid(jid)
    withoutContact = kayydev.withoutContact || withoutContact
    let v
    if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
      v = store.contacts[id] || {}
      if (!(v.name || v.subject)) v = kayydev.groupMetadata(id) || {}
      resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
    })
    else v = id === '0@s.whatsapp.net' ? {
      id,
      name: 'WhatsApp'
    } : id === kayydev.decodeJid(kayydev.user.id) ? kayydev.user : (store.contacts[id] || {})
    return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
  }
  //=================================================//
  kayydev.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    let list = []
    for (let i of kon) {
      list.push({
        displayName: await kayydev.getName(i + '@s.whatsapp.net'),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await kayydev.getName(i + '@s.whatsapp.net')}\nFN:${await kayydev.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:aplusscell@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://chat.whatsapp.com/HbCl8qf3KQK1MEp3ZBBpSf\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
      })
    }
    //=================================================//
    kayydev.sendMessage(jid, {
      contacts: {
        displayName: `${list.length} Kontak`,
        contacts: list
      },
      ...opts
    }, {
      quoted
    })
  }
  //=================================================//
  //Kalau Mau Self Lu Buat Jadi false
  kayydev.public = true
  //=================================================//
  //=================================================//
  kayydev.ev.on('creds.update', saveCreds)
  //=================================================//
  kayydev.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(message, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    return buffer
  }
  //=================================================//
  kayydev.sendImage = async (jid, path, caption = '', quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    return await kayydev.sendMessage(jid, {
      image: buffer,
      caption: caption,
      ...options
    }, {
      quoted
    })
  }
  
   kayydev.sendList = async (jid, title, footer, btn, options = {}) => {
                let msg = generateWAMessageFromContent(jid, {
                    viewOnceMessage: {
                        message: {
                            "messageContextInfo": {
                                "deviceListMetadata": {},
                                "deviceListMetadataVersion": 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                ...options,
                                body: proto.Message.InteractiveMessage.Body.create({ text: title }),
                                footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || "Powered By Natan" }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [
                                        {
                                            "name": "single_select",
                                            "buttonParamsJson": JSON.stringify(btn)
                                        },
                                    ]
                                })
                            })
                        }
                    }
                }, {})
                return await kayydev.relayMessage(msg.key.remoteJid, msg.message, {
                    messageId: msg.key.id
                })
            }
    
  //=================================================//
  kayydev.sendText = (jid, text, quoted = '', options) => kayydev.sendMessage(jid, {
    text: text,
    ...options
  }, {
    quoted
  })
  //=================================================//
  kayydev.sendTextWithMentions = async (jid, text, quoted, options = {}) => kayydev.sendMessage(jid, {
    text: text,
    contextInfo: {
      mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net')
    },
    ...options
  }, {
    quoted
  })
  //=================================================//
  kayydev.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options)
    } else {
      buffer = await imageToWebp(buff)
    }
    await kayydev.sendMessage(jid, {
      sticker: {
        url: buffer
      },
      ...options
    }, {
      quoted
    })
    return buffer
  }
  kayydev.sendImageAsStickerAV = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImgAV(buff, options)
    } else {
      buffer = await imageToWebp2(buff)
    }
    await kayydev.sendMessage(jid, {
      sticker: {
        url: buffer
      },
      ...options
    }, {
      quoted
    })
    return buffer
  }
  kayydev.sendImageAsStickerAvatar = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options)
    } else {
      buffer = await imageToWebp3(buff)
    }
    await kayydev.sendMessage(jid, {
      sticker: {
        url: buffer
      },
      ...options
    }, {
      quoted
    })
    return buffer
  }
  kayydev.sendPoll = (jid, name = '', values = [], selectableCount = global.select) => {
    return kayydev.sendMessage(jid, {
      poll: {
        name,
        values,
        selectableCount
      }
    })
  };
  //=================================================//
  kayydev.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options)
    } else {
      buffer = await videoToWebp(buff)
    }
    await kayydev.sendMessage(jid, {
      sticker: {
        url: buffer
      },
      ...options
    }, {
      quoted
    })
    return buffer
  }
  //=================================================//
  kayydev.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    let type = await FileType.fromBuffer(buffer)
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
    // save to file
    await fs.writeFileSync(trueFileName, buffer)
    return trueFileName
  }
  //=================================================
  kayydev.cMod = (jid, copy, text = '', sender = kayydev.user.id, options = {}) => {
    //let copy = message.toJSON()
    let mtype = Object.keys(copy.message)[0]
    let isEphemeral = mtype === 'ephemeralMessage'
    if (isEphemeral) {
      mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
    }
    let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
    let content = msg[mtype]
    if (typeof content === 'string') msg[mtype] = text || content
    else if (content.caption) content.caption = text || content.caption
    else if (content.text) content.text = text || content.text
    if (typeof content !== 'string') msg[mtype] = {
      ...content,
      ...options
    }
    if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
    else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
    if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
    else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
    copy.key.remoteJid = jid
    copy.key.fromMe = sender === kayydev.user.id
    return proto.WebMessageInfo.fromObject(copy)
  }
  kayydev.sendFile = async (jid, PATH, fileName, quoted = {}, options = {}) => {
    let types = await kayydev.getFile(PATH, true)
    let {
      filename,
      size,
      ext,
      mime,
      data
    } = types
    let type = '',
      mimetype = mime,
      pathFile = filename
    if (options.asDocument) type = 'document'
    if (options.asSticker || /webp/.test(mime)) {
      let {
        writeExif
      } = require('./lib/exif')
      let media = {
        mimetype: mime,
        data
      }
      pathFile = await writeExif(media, {
        packname: global.packname,
        author: global.packname2,
        categories: options.categories ? options.categories : []
      })
      await fs.promises.unlink(filename)
      type = 'sticker'
      mimetype = 'image/webp'
    } else if (/image/.test(mime)) type = 'image'
    else if (/video/.test(mime)) type = 'video'
    else if (/audio/.test(mime)) type = 'audio'
    else type = 'document'
    await kayydev.sendMessage(jid, {
      [type]: {
        url: pathFile
      },
      mimetype,
      fileName,
      ...options
    }, {
      quoted,
      ...options
    })
    return fs.promises.unlink(pathFile)
  }
  kayydev.parseMention = async (text) => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
  }
  //=================================================//
  kayydev.copyNForward = async (jid, message, forceForward = false, options = {}) => {
    let vtype
    if (options.readViewOnce) {
      message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
      vtype = Object.keys(message.message.viewOnceMessage.message)[0]
      delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
      delete message.message.viewOnceMessage.message[vtype].viewOnce
      message.message = {
        ...message.message.viewOnceMessage.message
      }
    }
    let mtype = Object.keys(message.message)[0]
    let content = await generateForwardMessageContent(message, forceForward)
    let ctype = Object.keys(content)[0]
    let context = {}
    if (mtype != "conversation") context = message.message[mtype].contextInfo
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo
    }
    const waMessage = await generateWAMessageFromContent(jid, content, options ? {
      ...content[ctype],
      ...options,
      ...(options.contextInfo ? {
        contextInfo: {
          ...content[ctype].contextInfo,
          ...options.contextInfo
        }
      } : {})
    } : {})
    await kayydev.relayMessage(jid, waMessage.message, {
      messageId: waMessage.key.id
    })
    return waMessage
  }
  //=================================================//
  kayydev.sendReact = async (jid, emoticon, keys = {}) => {
    let reactionMessage = {
      react: {
        text: emoticon,
        key: keys
      }
    }
    return await kayydev.sendMessage(jid, reactionMessage)
  }
  //=================================================//
  kayydev.getFile = async (PATH, save) => {
    let res
    let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
    //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
    let type = await FileType.fromBuffer(data) || {
      mime: 'application/octet-stream',
      ext: '.bin'
    }
    filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
    if (data && save) fs.promises.writeFile(filename, data)
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data
    }
  }
  kayydev.serializeM = (m) => smsg(kayydev, m, store)
  kayydev.ev.on("connection.update", async (update) => {
    const {
      connection,
      lastDisconnect
    } = update;
    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete Session and Scan Again`);
        process.exit();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting....");
        connectToWhatsApp();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Lost from Server, reconnecting...");
        connectToWhatsApp();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("Connection Replaced, Another New Session Opened, Please Restart Bot");
        process.exit();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(`Device Logged Out, Please Delete Folder Session yusril and Scan Again.`);
        process.exit();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...");
        connectToWhatsApp();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...");
        connectToWhatsApp();
      } else {
        console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log(chalk.black(chalk.bgWhite('Berhasil Tersambung')))
      if (global.db.data == null) await loadDatabase()
      kayydev.sendMessage('6281935723403' + "@s.whatsapp.net", {
        text: `*⚡️ _natanbotz_ ꜱᴜᴋꜱᴇꜱ ᴛᴇʀʜᴜʙᴜɴɢ ⚡️*`
      });
    }
    // console.log('Connected...', update)
  });
  return kayydev
}
connectToWhatsApp()
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright(`Update ${__filename}`))
  delete require.cache[file]
  require(file)
})