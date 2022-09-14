const text = document.getElementById("text");
const key = document.getElementById("key");
const letters = "abcdefghijklmnopqrstuvwxyz";
const hex = "0123456789abcdef";

const select = (i, str) => i - str.length * Math.floor(i / str.length);

function sort(param) {
    const input = param ? text : key;
    let str = "";
    for (let i = 0; i < input.value.length; i++) {
        if ((param ? letters : hex).indexOf(input.value[i]) != -1) str += input.value[i];
    }
    input.value = str;
}

function crypt(param) {
    let str = "";
    for (let i = 0; i < text.value.length; i++) {
        const variant = hex.indexOf(key.value[select(i, key.value)]);
        str += letters[select(letters.indexOf(text.value[i]) + (param ? variant : -variant), letters)];
    }
    text.value = str;
}

function randKey() {
    key.value = "";
    for (let i = 0; i < text.value.length; i++) key.value += hex[Math.floor(Math.random() * hex.length)];
}