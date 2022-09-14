const content = document.getElementById("content")
const m = document.getElementById("menu").querySelectorAll("div")
const section = document.getElementsByClassName("section")

let selected

function change(j) {
    if (selected != j) {
        content.animate([{
            transform: "translateY(20px)"
        }, {
            transform: "translateY(0px)"
        }], {
            duration: 500,
            easing: "ease"
        })
        for (let i = 0; i < m.length; i++) {
            if (i != j) m[i].style.textDecoration = "none"
            else m[i].style.textDecoration = "underline"
        }
        for (let i = 0; i < section.length; i++) {
            if (i != j) section[i].style.display = "none"
            else section[i].style.display = "inline"
        }
        document.title = [
            "MOTZ Martin - Accueil",
            "MOTZ Martin - Compétences",
            "MOTZ Martin - Projets (JS)",
            "MOTZ Martin - Contacter"
        ][j]
        selected = j
    }
}

change(0)