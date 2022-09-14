const c = document.querySelector("canvas")
const ctx = c.getContext("2d")

const rand = (i) => Math.floor(Math.random() * i)

class Tile {
    constructor() {
        this.col = rand(4)
        this.color = this.col == 1 || this.col == 2 ? "#F0F" : "#000"
        this.y = -10
        this.dead = false
    }
    frame() {
        for (let j = 0; j < 10; j++) {
            this.y += 1
            for (let i = 0; i < keys.length; i++) {
                if (keys[this.col].work) {
                    const t = Date.now() - keys[this.col].time
                    if (t <= 100 && this.y + 20 > 560) {
                        const obj = {
                            time: Date.now()
                        }
                        if (t <= 20) obj.timing = 0
                        else if (t <= 50) obj.timing = 1
                        else obj.timing = 2
                        timing = obj
                        this.dead = true
                    }
                }
            }
        }
        if (this.y > c.height) {
            this.dead = true
            timing = {
                time: Date.now(),
                timing: 3
            }
        }
        ctx.fillStyle = this.color
        ctx.fillRect(this.col * 100, this.y, 100, 10)
    }
}

let timing = null

const keys = new Array()
for (let i = 0; i < 4; i++) {
    keys.push({
        time: null,
        work: true
    })
}

function keyPressed(key) {
    switch (key) {
        case "d":
            keys[0].time = Date.now()
            break
        case "f":
            keys[1].time = Date.now()
            break
        case "j":
            keys[2].time = Date.now()
            break
        case "k":
            keys[3].time = Date.now()
            break
    }
}

document.onkeydown = (e) => keyPressed(e.key)

const tiles = new Array()

const fps = 60
let now
let then = Date.now()
const interval = 1000 / fps
let delta

let spawn = 0

function frame() {
    window.requestAnimationFrame(frame)
    now = Date.now()
    delta = now - then
    if (delta > interval) {
        then = now - (delta % interval)
        //----------
        if (spawn-- <= 0) {
            tiles.push(new Tile())
            spawn = 10
        }
        ctx.fillStyle = "#FFF"
        ctx.fillRect(0, 0, c.width, c.height)
        if (timing != null) {
            ctx.font = "36px consolas"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillStyle = ["#00F", "#0FF", "#0F0", "#F00"][timing.timing]
            ctx.fillText(["perfect", "good", "ok", "miss"][timing.timing], c.width / 2, c.height / 2)
        }
        ctx.fillStyle = "#000"
        for (let i = 1; i < 4; i++) ctx.fillRect(i * 100, 0, 1, c.height)
        for (let i = tiles.length - 1; i >= 0; i--) {
            tiles[i].frame()
            if (tiles[i].dead) tiles.splice(i, 1)
        }
        ctx.fillStyle = "#F00"
        ctx.fillRect(0, 560, c.width, 2)
        //----------
    }
}

frame()