import { apiLink } from "./link.js"

const userInput = document.getElementById("user-input")
const submitButton = document.getElementById("submit-button")

const fetchedWordContainer = document.getElementById("fetched-word-container")

const inputDisplay = document.getElementById("input-display")

const partOfSpeechDisplay = document.getElementById("part-of-speech-display")
const definitionList = document.getElementById("definition-list")

const exampleList = document.getElementById("example-list")
const synonymsDisplay = document.getElementById("synonyms-display")
const antonymsDisplay = document.getElementById("antonyms-display")

const sourceTitle = document.getElementById("source-title")
const sourceList = document.getElementById("source-list")

/* EVENT LISTENERS */

submitButton.addEventListener("click", async () => {

    /* Cleans the screen up */
    // clearScreen()
    clearScreenButBetter(fetchedWordContainer, sourceList, inputDisplay, userInput)

    let fetchedWord = userInput.value.trim()

    let wordData = await getWord(apiLink, fetchedWord) /* Returns first index in response */

    /* This will place the word to the screen */
    /* If no phonetic, print just the word only. */
    if (!wordData.phonetic) {
        inputDisplay.innerHTML = `${wordData.word}`
    } else {
    /* If there is a word and it has a phonetic, proceed as normal */
        inputDisplay.innerHTML = `${wordData.word} (${wordData.phonetic})`
    }

    /* No error handling as of now */

    /* wordData.meanings the drill that contains everything */

    fetchedWordContainer.appendChild(inputDisplay)

    
    for (let aspect of wordData.meanings) {


        let responseBlock = document.createElement("article")
        responseBlock.classList.add("response-block")

        responseBlock.innerHTML = `
            <h3>As a ${aspect.partOfSpeech}</h3>
            <h4>Definitions</h4>
            <ul class="definition-list" id="${aspect.partOfSpeech}-definition"></ul>
            <h4>Examples</h4>
            <ul class="example-list" id="${aspect.partOfSpeech}-example"></ul>


            <section id="synonyms-antonyms-block">

                <article class="synonyms-display">
                    <h5>Synonyms</h5>
                    <ul class="synonyms-list" id="${aspect.partOfSpeech}-synonym"></ul>
                </article>

                <article class="antonyms-display">
                    <h5>Antonyms</h5>
                    <ul class="antonyms-list" id="${aspect.partOfSpeech}-antonym"></ul>
                </article>

            </section>
        `
        
        fetchedWordContainer.appendChild(responseBlock)

        /* Redefines each element, with the part of speech attached, so the loop properly targets each part of speech */
        let definitionList = document.getElementById(`${aspect.partOfSpeech}-definition`)
        let exampleList = document.getElementById(`${aspect.partOfSpeech}-example`)

        /* Work on variable names to make more readable */


        /* Appends each definition to the list of definitions, cannot crunch into function for some reason. */
        for (let item of aspect.definitions) {
            // console.log(item)
            let newDefinition = document.createElement("li")
            newDefinition.innerHTML = `${item.definition}`
            definitionList.appendChild(newDefinition)
            
        }

        /* Appends each example to the list of examples, cannot crunch into function for some reason. */

        for (let item of aspect.definitions) {
            let newExample = document.createElement("li")
            if (item.example) {
                newExample.innerHTML = `${item.example}`
                exampleList.appendChild(newExample)
            }
        }

        /* Appends each synonym to the list of synonyms, cannot crunch into function for some reason. */
        if (aspect.synonyms.length > 0) {
            let synonymList = document.getElementById(`${aspect.partOfSpeech}-synonym`)
            for (let item of aspect.synonyms) {
                let newSynonym = document.createElement("li")
                newSynonym.innerHTML = `${item}`
                synonymList.appendChild(newSynonym)
            }
        }

        /* Appends each antonym to the list of antonyms, cannot crunch into function for some reason. */
        if (aspect.antonyms.length > 0) {
            let antonymList = document.getElementById(`${aspect.partOfSpeech}-antonym`)
            for (let item of aspect.antonyms) {
                let newAntonym = document.createElement("li")
                newAntonym.innerHTML = `${item}`
                antonymList.appendChild(newAntonym)
            }
        }

        console.log(`completed iteration of ${aspect.partOfSpeech}`)

    }

    for (let source of wordData.sourceUrls) {
        let newSource = document.createElement("li")
        newSource.innerHTML = `<a href="${source}">${source}</a>`
        sourceList.appendChild(newSource)
    }

})

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

function clearScreen() {
    /* Cleans up previous API pull */
    fetchedWordContainer.innerHTML = ""
    sourceList.innerHTML = ""
    inputDisplay.innerHTML = ""
}

function clearScreenButBetter(...elements) {
    for (let element of elements) {
        element.innerHTML = ""
    }
}

/* AXIOS FUNCTIONS */

async function getWord(drill, word) {
    let response = await axios.get(`${drill}${word}`)
    // console.log(response.data)
    return response.data[0]
    /* Returns a list containing 1 or multiple objects */
    /* Literally all we need is the first item. IDK why the API is set up like this */
}
