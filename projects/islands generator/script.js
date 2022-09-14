const c = document.querySelector("canvas")
const ctx = c.getContext("2d")

const rand = (i) => Math.floor(Math.random() * i)

let tiles = new Array()

function patch(x, y) {
    const array = new Array()
    if (x > 0) array.push(tiles[y][x - 1])
    if (y > 0) array.push(tiles[y - 1][x])
    if (x < 99) array.push(tiles[y][x + 1])
    if (y < 99) array.push(tiles[y + 1][x])
    if (x > 0 && y > 0) array.push(tiles[y - 1][x - 1])
    if (x < 99 && y > 0) array.push(tiles[y - 1][x + 1])
    if (x < 99 && y < 99) array.push(tiles[y + 1][x + 1])
    if (x > 0 && y < 99) array.push(tiles[y + 1][x - 1])
    let sum = 0
    for (let i = 0; i < array.length; i++) sum += array[i]
    return sum / array.length
}

for (let y = 0; y < 100; y++) {
    const line = new Array()
    for (let x = 0; x < 100; x++) {
        const c = rand(100)
        for (let i = 0; i < 1; i++) line.push(c)
    }
    for (let i = 0; i < 1; i++) tiles.push(line)
}

for (let i = 0; i < 20; i++) {
    const array = new Array()
    for (let y = 0; y < 100; y++) {
        const line = new Array()
        for (let x = 0; x < 100; x++) line.push(patch(x, y))
        array.push(line)
    }
    tiles = array
}

const begin = 49

const diff = 1

for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
        const target = tiles[y][x]

        if (
            x < 2 ||
            x > 97 ||
            y < 2 ||
            y > 97
        ) ctx.fillStyle = ["#492201", "#562B00", "#633200"][rand(3)] // border
        else if (target < begin) ctx.fillStyle = "#0D3042" // water
        else if (target < begin + diff) ctx.fillStyle = "#103B51" // light water
        else if (target < begin + diff * 2) ctx.fillStyle = ["#E1AA72", "#FFE29C", "#EABF7D", "#DB9A59", "#FDDDA0"][rand(5)] // sand
        else ctx.fillStyle = ["#899450", "#737C41", "#646B3A", "#545A30", "#484D28"][rand(5)] // grass
        ctx.fillRect(x * 6, y * 6, 6, 6)

    }
}