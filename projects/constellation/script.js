const c = document.querySelector("canvas")
const ctx = c.getContext("2d")

c.width = window.innerWidth
c.height = window.innerHeight

const rand = (i) => Math.random() * i
const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)

const p = new Array()

class Point {
    constructor() {
        this.color = rand(1) < 0.5 ? "#1F618D" : "#1E8449"
        this.x = rand(c.width)
        this.y = rand(c.height)
        this.x_add = rand(2) - 1
        this.y_add = rand(2) - 1
    }
    frame() {
        this.x += this.x_add
        this.y += this.y_add
        if (this.x <= 0 || this.x > c.width) this.x_add *= -1
        if (this.y <= 0 || this.y > c.height) this.y_add *= -1
        for (let i = 0; i < p.length; i++) {
            if (dist(this, p[i]) < 200) {
                ctx.beginPath()
                ctx.moveTo(this.x, this.y)
                ctx.lineTo(p[i].x, p[i].y)
                ctx.strokeStyle = this.color
                ctx.stroke()
            }
        }
    }
}

for (let i = 0; i < 100; i++) p.push(new Point)

const fps = 60
let now
let then = Date.now()
const interval = 1000 / fps
let delta

function frame() {
    window.requestAnimationFrame(frame)
    now = Date.now()
    delta = now - then
    if (delta > interval) {
        then = now - (delta % interval)
        //----------
        ctx.fillStyle = "#111"
        ctx.fillRect(0, 0, c.width, c.height)
        for (let i = 0; i < p.length; i++) p[i].frame()
        window.requestAnimationFrame(frame)
        //----------
    }
}

frame()