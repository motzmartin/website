const c = document.querySelector("canvas")
const ctx = c.getContext("2d")

const rand = (i) => Math.floor(Math.random() * i)

const audio = new Audio("beep.wav")
audio.volume = 0.3

function genTile() {
    let x, y
    do {
        x = rand(4)
        y = rand(4)
    } while (tiles[y][x] == 1 || (x == mouse_x && y == mouse_y))
    tiles[y][x] = 1
}

let mouse_x, mouse_y, clicked, start, end, elapsed, begin, selected, are_clicked, tiles

function set() {
    mouse_x = 0
    mouse_y = 0
    clicked = 0
    start = false
    end = false
    elapsed = 0
    begin = undefined
    selected = new Array()
    are_clicked = {
        z: false,
        e: false
    }
    tiles = new Array()
    for (let y = 0; y < 4; y++) {
        const line = new Array()
        for (let x = 0; x < 4; x++) line.push(0)
        tiles.push(line)
    }
    for (let i = 0; i < 3; i++) genTile()
}

set()

c.onmousemove = (e) => {
    mouse_x = Math.floor(e.clientX / 150)
    mouse_y = Math.floor(e.clientY / 150)
}

c.onmousedown = (e) => click()

document.onkeydown = (e) => {
    if (e.key == "z" || e.key == "e") {
        if (are_clicked[e.key] == false) {
            are_clicked[e.key] = true
            click()
        }
    }
    if (e.key == " " && end == true) set()
}

document.onkeyup = (e) => {
    if (e.key == "z" || e.key == "e") are_clicked[e.key] = false
}

function click() {
    if (!end) {
        const obj = {
            x: mouse_x,
            y: mouse_y
        }
        if (tiles[mouse_y][mouse_x] == 1) {
            obj.color = "#0F0"
            obj.time = Date.now()
            tiles[mouse_y][mouse_x] = 0
            clicked += 1
            genTile()
            audio.currentTime = 0
            audio.play()
            if (!start) {
                start = true
                begin = Date.now()
            }
        } else {
            obj.color = "#F00"
            obj.time = null
            end = true
        }
        selected.push(obj)
    }
}

function frame() {
    if (!end) elapsed = Date.now() - begin
    let write = false
    if (elapsed >= 30000) {
        end = true
        write = true
    }
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            ctx.fillStyle = tiles[y][x] == 0 || end == 1 ? "#FFF" : "#000"
            ctx.fillRect(x * 150, y * 150, 150, 150)
        }
    }
    for (let i = selected.length - 1; i >= 0; i--) {
        ctx.fillStyle = selected[i].color
        if (selected[i].time != null && Date.now() - selected[i].time >= 50) selected.splice(i, 1)
        else ctx.fillRect(selected[i].x * 150, selected[i].y * 150, 150, 150)
    }
    ctx.fillStyle = "#444"
    for (let i = 1; i < 4; i++) ctx.fillRect(i * 150, 0, 1, 600)
    for (let i = 1; i < 4; i++) ctx.fillRect(0, i * 150, 600, 1)
    ctx.fillStyle = "#DDD"
    ctx.fillRect(0, 600, 600, 50)
    ctx.fillStyle = "#000"
    ctx.font = "16px consolas"
    ctx.textBaseline = "middle"
    ctx.textAlign = "left"
    ctx.fillText("> clicked: " + clicked, 20, 625)
    ctx.textAlign = "right"
    ctx.fillText("> time left: " + (start ? 30 - Math.floor(elapsed / 1000) : "--"), 580, 625)
    if (write) {
        ctx.textAlign = "center"
        ctx.fillText(Math.floor(clicked / 30 * 100) / 100 + " tiles per second", 300, 625)
    } else if (end) {
        ctx.textAlign = "center"
        ctx.fillText("press space to restart", 300, 625)
    }
    window.requestAnimationFrame(frame)
}

window.requestAnimationFrame(frame)