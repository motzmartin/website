const c = document.querySelector("canvas")
const ctx = c.getContext("2d")

c.width = 600
c.height = 600

const rand = (i) => Math.floor(Math.random() * i)

let finished = false
let score = 0

function clearCanvas() {
    ctx.fillStyle = "#111"
    ctx.fillRect(0, 0, c.width, c.height)
}

class Player {
    constructor() {
        this.x = 100
        this.y = 300
        this.width = 15
        this.height = 15
        this.y_add = 0
    }
    frame() {
        if (this.y_add < 5) this.y_add += 0.3
        this.y += this.y_add
        let died = false
        if (this.y > c.height || this.y < -this.height) {
            died = true
        }
        for (let i = 0; i < pipes.length; i++) {
            const p = pipes[i]
            if (this.x + this.width > p.x && this.x < p.x + p.width) {
                if (this.y < p.end_start || this.y + this.height > p.end_start + p.end_height) {
                    died = true
                }
            }
        }
        if (died) {
            finished = true
            clearCanvas()
            ctx.fillStyle = "#FFF"
            ctx.font = "28px consolas"
            ctx.textBaseline = "middle"
            ctx.textAlign = "center"
            ctx.fillText("You died", c.width / 2, c.height / 2)
            ctx.font = "20px consolas"
            ctx.fillText("Score: " + score, c.width / 2, c.height / 2 + 30)
        }
        ctx.fillStyle = "#F00"
        ctx.fillRect(this.x, Math.floor(this.y), this.width, this.height)
    }
}

class Pipe {
    constructor() {
        this.x = c.width
        this.end_height = rand(200) + 70
        this.end_start = rand(c.height - 200 - this.end_height) + 100
        this.width = 10
    }
    frame() {
        this.x -= 3
        ctx.fillStyle = "#FFF"
        ctx.fillRect(this.x, 0, this.width, c.height)
        ctx.fillStyle = "#111"
        ctx.fillRect(this.x, this.end_start, this.width, this.end_height)
        return this.x < -this.width
    }
}

c.onmousedown = () => plr.y_add = -5

const pipes = new Array()
const plr = new Player()

const fps = 60
let now
let then = Date.now()
const interval = 1000 / fps
let delta

let spawn = 0

function frame() {
    if (!finished) requestAnimationFrame(frame)
    now = Date.now()
    delta = now - then
    if (delta > interval) {
        then = now - (delta % interval)
        //----------
        clearCanvas()
        for (let i = pipes.length - 1; i >= 0; i--) {
            if (pipes[i].frame()) {
                pipes.splice(i, 1)
                score += 1
            }
        }
        if (!spawn--) {
            spawn = 100 - score
            pipes.push(new Pipe())
        }
        plr.frame()
        //----------
    }
}

frame()