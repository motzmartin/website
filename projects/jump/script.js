const c = document.querySelector("canvas")
const ctx = c.getContext("2d")

const rand = (i) => Math.floor(Math.random() * i)

const fps = 60
let now
let then = Date.now()
const interval = 1000 / fps
let delta

const map = new Array()

for (let i = 0; i < 100; i++) {
    const width = rand(50) + 20
    map.push({
        x: rand(c.width - width),
        y: rand(c.width / 12) * 12,
        width: width,
        height: 2
    })
}

map.push({
    x: -1,
    y: 0,
    width: 1,
    height: c.height
}, {
    x: 0,
    y: -1,
    width: c.width,
    height: 1
}, {
    x: c.width,
    y: 0,
    width: 1,
    height: c.height
}, {
    x: 0,
    y: c.height,
    width: c.width,
    height: 1
})

class Player {
    constructor() {
        this.width = 10
        this.height = 10
        this.x = 1
        this.y = c.height - this.height - 1
        this.dir = [false, false]
        this.jump = false
        this.jump_coeff = 0
        this.fall_coeff = 0
    }
    frame() {
        if (this.jump && this.jump_coeff == 0) this.jump_coeff = -1
        for (let i = 0; i < 5; i++) {
            if (this.dir[0]) {
                this.x -= 0.5
                this.collide("left")
            }
            if (this.dir[1]) {
                this.x += 0.5
                this.collide("right")
            }
            if (this.jump_coeff < 0 && this.fall_coeff == 0) {
                this.y += this.jump_coeff
                if (this.collide("up")) {
                    this.jump_coeff = 0
                } else {
                    this.jump_coeff += 0.01
                    this.fall_coeff = 0
                }
            } else {
                this.y += this.fall_coeff
                if (this.collide("down")) {
                    this.fall_coeff = 0
                    this.jump_coeff = 0
                } else if (this.fall_coeff < 1) {
                    this.fall_coeff += 0.01
                }
            }

        }
        ctx.fillStyle = "#F00"
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height)
    }
    collide(dir) {
        for (let i = 0; i < map.length; i++) {
            const m = map[i]
            if (
                this.x + this.width > m.x && this.x < m.x + m.width &&
                this.y + this.height > m.y && this.y < m.y + m.height
            ) {
                switch (dir) {
                    case "left":
                        this.x = m.x + m.width
                        return true
                    case "up":
                        this.y = m.y + m.height
                        return true
                    case "right":
                        this.x = m.x - this.width
                        return true
                    case "down":
                        this.y = m.y - this.height
                        return true
                }
            }
        }
        return false
    }
}

function keyPressed(key, bool) {
    switch (key) {
        case "q":
            plr.dir[0] = bool
            break
        case "d":
            plr.dir[1] = bool
            break
        case " ":
            plr.jump = bool
            break
    }
}

document.onkeydown = (e) => keyPressed(e.key, true)
document.onkeyup = (e) => keyPressed(e.key, false)

const plr = new Player()

function frame() {
    window.requestAnimationFrame(frame)
    now = Date.now()
    delta = now - then
    if (delta > interval) {
        then = now - (delta % interval)
        //----------
        ctx.fillStyle = "#111"
        ctx.fillRect(0, 0, c.width, c.height)
        ctx.fillStyle = "#FFF"
        for (let i = 0; i < map.length; i++) {
            ctx.fillRect(map[i].x, map[i].y, map[i].width, map[i].height)
        }
        plr.frame()
        //----------
    }
}

frame()