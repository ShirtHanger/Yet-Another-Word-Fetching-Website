import { apiLink } from "./link.js"



console.log(apiLink)

const userInput = document.getElementById("user-input")
const submitButton = document.getElementById("submit-button")

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

    let fetchedWord = userInput.value.trim()

    let wordData = await getWord(apiLink, fetchedWord) /* Returns a list containing 1 or multiple objects */

    inputDisplay.innerHTML = `${wordData[0].word} (${wordData[0].phonetic})`


    console.log(wordData[0])

    /* No error handling as of now */

    for (let aspect of wordData[0].meanings) {
        console.log(aspect)
        let partOfSpeech = aspect.partOfSpeech
        let definitions = aspect.definitions // Array
        let example = definitions[0].example
/*         let synonyms = aspect.meanings.synonyms // Array
        let antonyms = aspect.meanings.antonyms // Array */

        console.log(partOfSpeech)
        console.log(definitions)
        console.log(example)
 /*        console.log(synonyms)
        console.log(antonyms) */

        partOfSpeechDisplay.innerHTML = partOfSpeech
        definitionDisplay.innerHTML = definitions[0].definition

        exampleDisplay.innerHTML = example
/*         if (synonyms) {
            synonymsDisplay.innerHTML = synonyms[0]
        } else {
            synonymsDisplay.innerHTML = "No synonyms found"
        }
        if (antonyms) {
            antonymsDisplay.innerHTML = antonyms[0]
        } else {   
            antonymsDisplay.innerHTML = "No antonyms found"
        } */

    }

})

/* FUNCTIONS */

function randNum(maxNum) {
    /* Returns a random number between 0 and the length of given array */
    /* Used for randomizing responses for website */

    let randIndex = Math.floor(Math.random() * maxNum) 
    return randIndex
}

/* AXIOS FUNCTIONS */

async function getWord(drill, word) {
    let response = await axios.get(`${drill}${word}`)
    console.log(response.data)
    return response.data
    /* Returns a list containing 1 or multiple objects */
}