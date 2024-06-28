require("../setting")
require("./settings")
const store = makeInMemoryStore({ "logger": pino({ "level": "silent" }).child({ "level": "silent" })})

exports.makeWASocket = (connectionUpdate, options = {}) => {
  const kayydev = makeWASocket(connectionUpdate)
  
  kayydev.name = `${botname}`
  kayydev.number = kayydev.user?.["id"]["split"](":")[0] + "@s.whatsapp.net"
  kayydev.owner = {
    "name": `${botname} WhatsApp`,
    "number": `${owner}@s.whatsapp.net`
  }
  
  kayydev.reply = async (mesegs, teks, urlImage) => {
    if (!urlImage) {
    try {
      await kayydev.sendMessage(mesegs.chat, {
      "text": teks
      }, { "quoted": mesegs })
    } catch (error) {
      console.log("Terjadi Kesalahan" + error)
    }
    } else {
    try {
      await kayydev.sendMessage(mesegs.chat, {
      "image": { "url": '' + urlImage },
      "caption": teks
      }, { "quoted": mesegs })
    } catch (error) {
      console.log("Terjadi Kesalahan" + error)
    }
    }
  }
  
  kayydev.groups = async () => {
    const pArtiCpnts = await kayydev.groupFetchAllParticipating()
    return Object.values(pArtiCpnts)
  }
  
  kayydev.showGroups = async msgse => {
    const getDlgc = await kayydev.groups()
    try {
    const All1 = getDlgc.map((txty1, txty2) => {
      const meksh = ["*NAME*: " + txty1.subject + "\n*ID*: " + txty1.id.split("@")[0] + "@g.us" + "\n*JUMLAH MEMBER*: " + txty1.participants.length + " Member"].join("\n\n")
      return meksh
    }).join("\n\n")
    kayydev.reply(msgse, "List Group\n\n" + All1)
    } catch (Ror) {
    kayydev.reply(msgse, "List Group\n\n" + Ror)
    console.log("ERROR! " + "List Group\n" + Ror)
    }
  }
  
  kayydev.pushContacts = async (nsgegs, idgcnye, txt1ortxt2) => {
    try {
    const mtData = await kayydev.groupMetadata(idgcnye)
    let { participants } = mtData
    participants = participants.map(v => v.id)
    const Txt1 = txt1ortxt2.split("|")[0]
    const Txt2 = parseInt((txt1ortxt2.split("|")[1] || 15) + "000")
    if (!Txt1 || !Txt2 || isNaN(Txt2)) {
      return kayydev.reply(nsgegs, "PUSH CONTACTS\n\n" + "*Format yang anda berikan tidak valid*\n*Contoh*: .pushcontacts Hallo ... Pesan|5*")
    } else {
      await kayydev.reply(nsgegs, "PUSH CONTACTS\n\n" + "*Push Contacts Start*:\n*Target*: " + participants.length + " members\n*Text*: " + Txt1 + "\n*Delay*: " + Txt2)
      let prtcpnts = 0
      const stIntvral = setInterval(async () => {
      if (prtcpnts === participants.length) {
        await kayydev.reply(nsgegs, "PUSH CONTACTS\n\n" + "*Push Contacts selesai*\n*" + prtcpnts + " pesan telah berhasil dikirim*")
        return clearInterval(stIntvral)
      } else {
        if (Object.keys(nsgegs.message)[0] === "imageMessage") {
        const urlImeg = await downloadMediaMessage(nsgegs, "buffer", {}, { "logger": pino })
        await kayydev.sendMessage(participants[prtcpnts], { "image": urlImeg, "caption": '' + Txt1 })
        } else {
        await kayydev.sendMessage(participants[prtcpnts], { "text": '' + Txt1 })
        }
        prtcpnts++
      }
      }, Txt2)
    }
    } catch (conError) {
    kayydev.reply(nsgegs, "PUSH CONTACTS\n" + conError)
    }
  }
  
  kayydev.sendChatAllGroup = async (mesegesp, tx1tx2) => {
    const getidnya = await kayydev.groupFetchAllParticipating()
    const groups = Object.entries(getidnya).slice(0).map((entry) => entry[1])
    const anu = groups.map((v) => v.id)
    try {
    const Txt1 = tx1tx2.split("|")[0]
    const Txt2 = parseInt((tx1tx2.split("|")[1] || 15) + "000")
    if (!Txt1 || !Txt2 || isNaN(Txt2)) {
      return kayydev.reply(mesegesp, "CHAT ALL GROUP\n\n" + "*Format yang anda berikan tidak valid*\n*Contoh*: .jpm Hallo ... Pesan|5*")
    } else {
      await kayydev.reply(mesegesp, "CHAT ALL GROUP\n\n" + "*Broadcast Start*:\n*Target*: " + anu.length + " groups\n*Text*: " + Txt1 + "\n*Delay*: " + Txt2)
      let idgcwy = 0
      const stIntvral = setInterval(async () => {
      if (idgcwy === anu.length) {
        await kayydev.reply(mesegesp, "CHAT ALL GROUP\n\n" + "*Broadcast Selesai*\n*" + idgcwy + " pesan telah berhasil dikirim*")
        return clearInterval(stIntvral)
      } else {
        if (Object.keys(mesegesp.message)[0] === "imageMessage") {
        const urlImeg = await downloadMediaMessage(mesegesp, "buffer", {}, { "logger": pino })
        await kayydev.sendMessage(anu[idgcwy], { "image": urlImeg, "caption": '' + Txt1 })
        } else {
        await kayydev.sendMessage(anu[idgcwy], { "text": '' + Txt1 })
        }
        idgcwy++
      }
      }, Txt2)
    }
    } catch (ErrorK) {
    kayydev.reply(mesegesp, "CHAT ALL GROUP\n\n" + ErrorK)
    }
  }
  
  kayydev.saveContacts = async (messgs, Prtcipnts) => {
    try {
    const getPrtpnts = Prtcipnts.map((send1, send2) => {
      const SvdQ = "[" + send2 + "] Auto saved by " + kayydev.name + " (" + send1.id.split("@")[0x0] + ")"
      const hsilDtbs = ["BEGIN:VCARD", "VERSION:3.0", "FN:" + SvdQ, "ORG:" + kayydev.name, "TEL;type=CELL;type=VOICE;waid=" + send1.id.split("@")[0x0] + ":+" + send1.id.split("@")[0x0], "END:VCARD", ''].join("\n")
      return hsilDtbs
    }).join('')
    await kayydev.sendMessage(messgs.key.remoteJid, { "document": Buffer.from(getPrtpnts, "utf8"), "fileName": "contacts.vcf", "caption": "*Silahkan Di Pencet Untuk Save Kontak*", "mimetype": "text/x-vcard" }, { "quoted": messgs })
    } catch (SvdError) {
    kayydev.reply(messgs, "AUTO SAVE CONTACTS\n\n" + '' + SvdError)
    }
  }
  
  kayydev.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
    let decode = jidDecode(jid) || {}
    return decode.user && decode.server && decode.user + '@' + decode.server || jid
    } else return jid
  }
  
  if (kayydev.user && kayydev.user.id) kayydev.user.jid = kayydev.decodeJid(kayydev.user.id)
  kayydev.chats = {}
  kayydev.contacts = {}
  
  kayydev.downloadM = async (m, type, filename = '') => {
    if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
    const stream = await downloadContentFromMessage(m, type)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])
    }
    if (filename) await fs.promises.writeFile(filename, buffer)
    return filename && fs.existsSync(filename) ? filename : buffer
  }
  
  kayydev.downloadMediaMessage = async (message) => {
    let quoted = message.msg ? message.msg : message
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])
    }
    return buffer
  }
  
  kayydev.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])
    }
    let type = await FileType.fromBuffer(buffer)
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
    await fs.writeFileSync(trueFileName, buffer)
    return trueFileName
  }
  
  kayydev.sendStimg = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
    buffer = await writeExifImg(buff, options)
    } else {
    buffer = await imageToWebp(buff)
    }
    await kayydev.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
    return buffer
  }

  kayydev.sendStvid = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
    buffer = await writeExifVid(buff, options)
    } else {
    buffer = await videoToWebp(buff)
    }
    await kayydev.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
    return buffer
  }
  Object.defineProperty(kayydev, 'name', {
    value: { ...(options.chats || {}) },
    configurable: true,
  })
  if (kayydev.user?.id) kayydev.user.jid = kayydev.decodeJid(kayydev.user.id)
  store.bind(kayydev.ev)
  return kayydev
}