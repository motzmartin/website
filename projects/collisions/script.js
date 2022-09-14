document.getElementById("code").textContent = `function collide(plr, obj, dir) {
    for (let i = 0; i < obj.length; i++) {
        const o = obj[i]
        if (
            plr.x + plr.width > o.x && plr.x < o.x + o.width &&
            plr.y + plr.heigth > o.y && plr.y < o.y + o.heigth
        ) {
            switch (dir) {
                case "left":
                    plr.x = obj.x + obj.width
                    break
                case "top":
                    plr.y = obj.y + obj.height
                    break
                case "right":
                    plr.x = obj.x - plr.width
                    break
                case "down":
                    plr.y = obj.y - plr.heigth
                    break
            }
        }
    }
}`


