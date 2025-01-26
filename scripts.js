const api_url = "https://rickandmortyapi.com/api/character";

const guessBtn = document.getElementById('guessBtn')
const characterImg = document.getElementById('characterImg')
const hintDiv = document.getElementById("hint");
const hintUl = document.createElement('ul')
const playAgainBtn = document.getElementById('playAgainBtn')
const who = document.getElementById('who')
let win = false;
let hintIndex = 0
let character = {}
let characterHints = []
let blurAmount = 10;

async function getCharacter() {
    const response = await fetch(api_url);
    const data = await response.json();

    //currently only includes the first 10 characters - increase here
    //increase per game mode? easy/medium/hard
    let characterId = Math.floor(Math.random() * 11)

    character = data.results[characterId]
    characterImg.src = character.image
    characterImg.style.filter = `blur(${blurAmount}px)`
    setupHints(character)
}

function setupHints(character){
    characterHints = [
        `Hint 1: The character is currently ${character.status}`,
        `Hint 2: The character is ${character.species}`,
        `Hint 3: The character is ${character.gender}`,
        `Hint 4: The character's initals are ${getInitals(character.name)}`
    ]
}

function getInitals(name){
    return name
        .split(" ")
        .map(word => word[0])
        .join("");
}

guessBtn.addEventListener('click', function(){
    const userInput = document.getElementById('guessInput').value.toLowerCase().trim()
    const fullName = character.name.toLowerCase()
    const firstName = fullName.split(" ")[0]
    if (userInput === fullName || userInput === firstName){
        win = true
        gameOver(win)
    }
    else{
        blurAmount = Math.max(0, blurAmount - 2)
        characterImg.style.filter = `blur(${blurAmount}px)`
        if (blurAmount == 0){
            win = false;
            gameOver()
        }
        else {
            who.textContent = "False! Try again!"
            renderHint()
        }
    }
})

function renderHint() {
    if (hintIndex < characterHints.length){
        let ul = document.querySelector("ul")
        if (!ul){
            ul = document.createElement("ul")
            hintDiv.appendChild(ul)
        }

        const li = document.createElement("li")
        li.textContent = characterHints[hintIndex]
        ul.appendChild(li)

        hintIndex++
    }
}

//implement W/L counter?
function gameOver(win){
    document.getElementById('guessInput').value = ""
    if (win){
        who.textContent = `You won! It's ${character.name}`
    }
    else{
        who.textContent = `You lost! It's ${character.name}`
    }
    characterImg.style.filter = `blur(0px)`
    guessBtn.disabled = true;
    playAgainBtn.style.display = 'block'
}

playAgainBtn.addEventListener('click', newGame)

function newGame(){
    blurAmount = 10
    hintIndex = 0
    hintDiv.innerHTML = ""
    guessBtn.disabled = false
    playAgainBtn.style.display = 'none'
    who.textContent = "Who am i?"
    getCharacter()
}

getCharacter()
