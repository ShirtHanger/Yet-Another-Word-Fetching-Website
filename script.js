import { apiLink } from "./link.js"

const userInput = document.getElementById("user-input")
const submitButton = document.getElementById("submit-button")

const fetchedWordContainer = document.getElementById("fetched-word-container")

const inputDisplay = document.getElementById("input-display")

const partOfSpeechDisplay = document.getElementById("part-of-speech-display")
const definitionDisplay = document.getElementById("definition-display")

const exampleDisplay = document.getElementById("example-display")
const synonymsDisplay = document.getElementById("synonyms-display")
const antonymsDisplay = document.getElementById("antonyms-display")

const sourceDisplay = document.getElementById("source-display")
const sourceList = document.getElementById("source-list")

/* EVENT LISTENERS */

submitButton.addEventListener("click", async () => {

    fetchedWordContainer.innerHTML = "" /* Clear the container before adding new word */

    let fetchedWord = userInput.value.trim()

    let wordData = await getWord(apiLink, fetchedWord) /* Returns a list containing 1 or multiple objects */

    inputDisplay.innerHTML = `${wordData.word} (${wordData.phonetic})`

    /* No error handling as of now */

    /* Work on proper iteration, some words can be used as nouns AND verbs AND other stuff
    wordData.meanings, the drill that contains everything */

    fetchedWordContainer.appendChild(inputDisplay)

    
    for (let aspect of wordData.meanings) {


        let responseBlock = document.createElement("article")
        responseBlock.classList.add("response-block")

        responseBlock.innerHTML = `
            <h3>As a ${aspect.partOfSpeech}</h3>
            <h4>Definitions</h4>
            <ul class="definition-display" id="${aspect.partOfSpeech}-definition"></ul>
            <h4>Examples</h4>
            <ul class="example-display" id="${aspect.partOfSpeech}-example"></ul>
        `
        
        fetchedWordContainer.appendChild(responseBlock)

        /* Redefine defintion-display, with the part of speech attached, so the loop properly targets each part of speech */
        let definitionDisplay = document.getElementById(`${aspect.partOfSpeech}-definition`)
        let exampleDisplay = document.getElementById(`${aspect.partOfSpeech}-example`)

        /* Work on variable names to make more readable */

        for (let item of aspect.definitions) {
            // console.log(item)
            let newDefinition = document.createElement("li")
            newDefinition.innerHTML = `${item.definition}`
            definitionDisplay.appendChild(newDefinition)
            
        }

        for (let item of aspect.definitions) {
            let newExample = document.createElement("li")
            if (item.example) {
                newExample.innerHTML = `${item.example}`
                exampleDisplay.appendChild(newExample)
            }
        }

        console.log(`completed iteration of ${aspect.partOfSpeech}`)

}})

/* FUNCTIONS */

function randNum(maxNum) {
    /* Returns a random number between 0 and the length of given array */
    /* Used for randomizing responses for website */

    let randIndex = Math.floor(Math.random() * maxNum) 
    return randIndex
}

function appendDefinitionToScreen(item, newDefinition) {
        
    /* Write a function to call each time the loop for adding part of speech and definitions for a word iterates */
}

function appendExampleToScreen(item, newExample) {
            
    /* Write a function to call each time the loop for adding part of speech and definitions for a word iterates */
}

/* AXIOS FUNCTIONS */

async function getWord(drill, word) {
    let response = await axios.get(`${drill}${word}`)
    // console.log(response.data)
    return response.data[0]
    /* Returns a list containing 1 or multiple objects */
}
