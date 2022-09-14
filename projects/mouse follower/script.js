const c = document.querySelector("canvas")
const ctx = c.getContext("2d")

let x = 0
let y = 0

let rad = 0

document.onmousemove = (e) => {
    rad = -Math.atan2(e.clientX - 300, e.clientY - 300) + Math.PI / 2
    x = Math.floor(Math.cos(rad) * 20)
    y = Math.floor(Math.sin(rad) * 20)
}

const random_color = () => colors[Math.floor(Math.random() * colors.length)]

const colors = [
    "#C0392B", "#E74C3C",
    "#9B59B6", "#8E44AD",
    "#2980B9", "#3498DB",
    "#1ABC9C", "#16A085",
    "#27AE60", "#2ECC71",
    "#F1C40F", "#F39C12",
    "#E67E22", "#D35400"
]

let top_color
let right_color
let bottom_color
let left_color

let top_changed = false
let right_changed = false
let bottom_changed = false
let left_changed = false

function resetChange(i) {
    if (i != 0 && i != 1) top_changed = false
    if (i != 1 && i != 2) right_changed = false
    if (i != 2 && i != 3) bottom_changed = false
    if (i != 0 && i != 3) left_changed = false
}

function frame() {
    ctx.fillStyle = "#EEE"
    ctx.fillRect(0, 0, c.width, c.height)
    const top = () => {
        ctx.beginPath()
        ctx.moveTo(280, 280)
        ctx.lineTo(280 + x, 280 + y)
        ctx.lineTo(320 + x, 280 + y)
        ctx.lineTo(320, 280)
        ctx.closePath()
        ctx.fillStyle = top_color
        ctx.fill()
    }
    const right = () => {
        ctx.beginPath()
        ctx.moveTo(320, 280)
        ctx.lineTo(320 + x, 280 + y)
        ctx.lineTo(320 + x, 320 + y)
        ctx.lineTo(320, 320)
        ctx.closePath()
        ctx.fillStyle = right_color
        ctx.fill()
    }
    const bottom = () => {
        ctx.beginPath()
        ctx.moveTo(320, 320)
        ctx.lineTo(320 + x, 320 + y)
        ctx.lineTo(280 + x, 320 + y)
        ctx.lineTo(280, 320)
        ctx.closePath()
        ctx.fillStyle = bottom_color
        ctx.fill()
    }
    const left = () => {
        ctx.beginPath()
        ctx.moveTo(280, 320)
        ctx.lineTo(280 + x, 320 + y)
        ctx.lineTo(280 + x, 280 + y)
        ctx.lineTo(280, 280)
        ctx.closePath()
        ctx.fillStyle = left_color
        ctx.fill()
    }
    if (rad > 0 && rad <= Math.PI / 2) {
        resetChange(0)
        if (!top_changed) {
            top_changed = true
            top_color = random_color()
        }
        if (!left_changed) {
            left_changed = true
            left_color = random_color()
        }
        top()
        left()
    } else if (rad > Math.PI / 2 && rad <= Math.PI) {
        resetChange(1)
        if (!top_changed) {
            top_changed = true
            top_color = random_color()
        }
        if (!right_changed) {
            right_changed = true
            right_color = random_color()
        }
        top()
        right()
    } else if (rad > Math.PI && rad <= Math.PI + Math.PI / 2) {
        resetChange(2)
        if (!bottom_changed) {
            bottom_changed = true
            bottom_color = random_color()
        }
        if (!right_changed) {
            right_changed = true
            right_color = random_color()
        }
        bottom()
        right()
    } else {
        resetChange(3)
        if (!bottom_changed) {
            bottom_changed = true
            bottom_color = random_color()
        }
        if (!left_changed) {
            left_changed = true
            left_color = random_color()
        }
        bottom()
        left()
    }
    ctx.beginPath()
    ctx.moveTo(280 + x, 280 + y)
    ctx.lineTo(320 + x, 280 + y)
    ctx.lineTo(320 + x, 320 + y)
    ctx.lineTo(280 + x, 320 + y)
    ctx.closePath()
    ctx.fillStyle = "#333"
    ctx.fill()
    const x0 = 280 + x
    const y0 = 280 + y
    ctx.fillStyle = "#FFF"
    ctx.fillRect(x0 + 9, y0 + 10, 2, 2)
    ctx.fillRect(x0 + 29, y0 + 10, 2, 2)
    ctx.beginPath()
    ctx.moveTo(x0 + 10, y0 + 25)
    ctx.lineTo(x0 + 15, y0 + 30)
    ctx.lineTo(x0 + 25, y0 + 30)
    ctx.lineTo(x0 + 30, y0 + 25)
    ctx.strokeStyle = "#FFF"
    ctx.stroke()
    window.requestAnimationFrame(frame)
}

window.requestAnimationFrame(frame)