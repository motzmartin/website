function text() {
    const Discord = require("discord.js")
    const fs = require("fs")
    const canvas = require('canvas')

    const client = new Discord.Client()

    const data = JSON.parse(fs.readFileSync("data.json"))

    const rand = (i) => Math.floor(Math.random() * i)
    const expRequired = (level) => 2 ** level * 10

    client.on("ready", () => {
        client.user.setActivity("/help")
    })

    function saveData() {
        fs.writeFileSync("data.json", JSON.stringify(data, null, 4))
    }

    const colors = [
        "#E14A3A",
        "#9958B4",
        "#3498DB",
        "#1ABC9C",
        "#2ECC71",
        "#F1C40F",
        "#E67E22"
    ]

    function setRanks() {
        const ranking = new Array()
        const keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            const user = data[keys[i]]
            ranking.push({
                user: keys[i],
                total: user.level + user.exp / expRequired(user.level)
            })
        }
        ranking.sort((a, b) => b.total - a.total)
        for (let i = 0; i < ranking.length; i++) data[ranking[i].user].rank = i + 1
    }

    function getColor(c = null) {
        let new_color
        do {
            new_color = colors[rand(colors.length)]
        } while (new_color == c)
        return new_color
    }

    client.on("message", (msg) => {
        if (!msg.author.bot) {
            //
            let user = data[msg.author.id]
            if (user == undefined) {
                const array = new Array()
                for (let i = 0; i < 24; i++) array.push(0)
                user = {
                    level: 0,
                    exp: 0,
                    sentence: "",
                    color: getColor(),
                    messages: array
                }
                data[msg.author.id] = user
            }
            //
            user.messages[new Date().getHours()] += 1
            //
            user.name = msg.author.tag
            let exp_added = Math.ceil(msg.content.length / 20)
            user.exp += exp_added > 4 ? 4 : exp_added
            if (user.exp >= expRequired(user.level)) {
                user.exp = 0
                user.level += 1
                msg.channel.send({
                    embed: {
                        color: user.color,
                        title: "Congratulation !",
                        description: msg.author.tag + " is now Level " + user.level + " !"
                    }
                })
            }
            //
            setRanks()
            const args = msg.content.split(" ")
            switch (args[0]) {
                case "/user":
                    let user
                    if (args[1]) user = msg.mentions.users.first()
                    else user = msg.author
                    if (user == undefined || data[user.id] == undefined) {
                        msg.channel.send({
                            embed: {
                                color: "#FF0000",
                                title: "An error has occured",
                                description: "This user does not exist in the database"
                            }
                        })
                    } else {
                        const target = data[user.id]
                        canvas.registerFont("YuseiMagic-Regular.ttf", {
                            family: "YuseiMagic-Regular"
                        })
                        const c = canvas.createCanvas(350, 300)
                        const ctx = c.getContext("2d")
                        ctx.fillStyle = "#111"
                        ctx.fillRect(0, 0, c.width, c.height)
                        ctx.textBaseline = "top"
                        const avatar = canvas.loadImage(user.avatarURL({
                            format: "png"
                        }))
                        avatar.then((img) => {
                            //Avatar
                            ctx.beginPath()
                            ctx.arc(275, 75, 50, 0, 2 * Math.PI, false)
                            ctx.save()
                            ctx.clip()
                            ctx.drawImage(img, 225, 25, 100, 100)
                            ctx.restore()
                            //Presence status
                            ctx.beginPath()
                            ctx.arc(310, 110, 12, 0, 2 * Math.PI, false)
                            ctx.fillStyle = "#111"
                            ctx.fill()
                            switch (user.presence.status) {
                                case "online":
                                    ctx.fillStyle = "#3E9971"
                                    break
                                case "idle":
                                    ctx.fillStyle = "#FAA61A"
                                    break
                                case "offline":
                                    ctx.fillStyle = "#727C8A"
                                    break
                                case "dnd":
                                    ctx.fillStyle = "#E94545"
                                    break
                            }
                            ctx.beginPath()
                            ctx.arc(310, 110, 8, 0, 2 * Math.PI, false)
                            ctx.fill()
                            //Graph
                            ctx.fillStyle = "#1A1A1A"
                            ctx.fillRect(37, 150, 276, 120)
                            ctx.font = "12px 'YuseiMagic-Regular'"
                            ctx.textAlign = "center"
                            ctx.fillStyle = "#222"
                            for (let i = 1; i < 12; i++) ctx.fillRect(0 + 37, i * 10 + 150, 276, 1)
                            for (let i = 1; i < 23; i++) {
                                let height = 120
                                if ((i - 1) % 3 == 0) {
                                    height = 125
                                    let str = i.toString()
                                    if (str.length == 1) str = "0" + str
                                    ctx.fillText(str + "h", i * 12 + 37, 275)
                                }
                                ctx.fillRect(i * 12 + 37, 0 + 150, 1, height)
                            }
                            let max = target.messages[0]
                            for (let i = 1; i < target.messages.length; i++) {
                                if (target.messages[i] > max) max = target.messages[i]
                            }
                            ctx.beginPath()
                            for (let i = 0; i < target.messages.length; i++) {
                                const coords = {
                                    x: i * 12 + 37 - 0.5,
                                    y: (12 - Math.round(target.messages[i] * (11 / max))) * 10 + 150 - 0.5
                                }
                                if (i == 0) ctx.moveTo(coords.x, coords.y)
                                else ctx.lineTo(coords.x, coords.y)
                            }
                            ctx.strokeStyle = "#777"
                            ctx.stroke()
                            //Rank
                            ctx.font = "96px 'YuseiMagic-Regular'"
                            ctx.textAlign = "left"
                            ctx.fillStyle = "#222"
                            ctx.fillText(target.rank, 0, -30)
                            //Username
                            ctx.font = "24px 'YuseiMagic-Regular'"
                            let str = target.name
                            let reduced = false
                            while (ctx.measureText(str).width > 170) {
                                str = str.slice(0, -1)
                                reduced = true
                            }
                            if (reduced) str += "..."
                            ctx.fillStyle = target.color
                            ctx.fillText(str, 25, 25)
                            //Exp bar
                            ctx.lineCap = "round"
                            ctx.lineWidth = 8
                            ctx.beginPath()
                            ctx.moveTo(25 + 8, 80)
                            ctx.lineTo(195, 80)
                            ctx.strokeStyle = "#333"
                            ctx.stroke()
                            ctx.beginPath()
                            ctx.moveTo(30, 80)
                            ctx.lineTo(target.exp / expRequired(target.level) * 165 + 30, 80)
                            ctx.strokeStyle = target.color
                            ctx.stroke()
                            //Level & sentence
                            ctx.font = "14px 'YuseiMagic-Regular'"
                            const str_level = "Level " + target.level + " (" + target.exp + "/" + expRequired(target.level) + ")"
                            //
                            let str_sentence = target.sentence
                            let str_reduced = false
                            while (ctx.measureText(str_sentence).width > 170) {
                                str_sentence = str_sentence.slice(0, -1)
                                str_reduced = true
                            }
                            if (str_reduced) str_sentence += "..."
                            //
                            ctx.fillStyle = "#FFF"
                            ctx.fillText(str_level + "\\n« " + str_sentence + " »", 25, 90)
                            //
                            const attachment = new Discord.MessageAttachment(c.toBuffer(), "infos.png")
                            msg.channel.send(attachment)
                        })
                    }
                    break
                case "/say":
                    const sentence = args.slice(1, args.length).join(" ")
                    if (sentence.length > 50) {
                        msg.channel.send({
                            embed: {
                                color: "#FF0000",
                                title: "An error has occured",
                                description: "Please write a correct sentence (max: 50)"
                            }
                        })
                    } else {
                        msg.channel.send({
                            embed: {
                                color: data[msg.author.id].color,
                                title: "Your profile has been updated",
                                description: "You are saying « " + sentence + " »"
                            }
                        })
                        data[msg.author.id].sentence = sentence
                    }
                    break
                case "/newcolor":
                    const new_color = getColor(data[msg.author.id].color)
                    data[msg.author.id].color = new_color
                    msg.channel.send({
                        embed: {
                            color: new_color,
                            title: "Your profile has been updated",
                            description: "Your color is now " + new_color
                        }
                    })
                    break
                case "/help":
                    msg.channel.send({
                        embed: {
                            color: "#9B59B6",
                            title: "Commands",
                            description: `
                            \`/user {mention}\`
                            - show user infos
                            \`/say [sentence]\`
                            - set new sentence
                            \`/newcolor\`
                            - change your color
                            `
                        }
                    })
                    break
            }
            saveData()
        }
    })

    client.login("token")
}