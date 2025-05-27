import { apiLink } from "./link.js"

// import * as functions from "./js"

const userInput = document.getElementById("user-input")
const submitButton = document.getElementById("submit-button")

const fetchedWordContainer = document.getElementById("fetched-word-container")

const inputDisplay = document.getElementById("input-display")

const sourceTitle = document.getElementById("source-title")
const sourceList = document.getElementById("source-list")

/* EVENT LISTENERS */

submitButton.addEventListener("click", async () => {

    /* Cleans the screen up */
    clearScreen(fetchedWordContainer, sourceList, inputDisplay, userInput)

    let fetchedWord = userInput.value.trim()

    let wordData = await getWord(apiLink, fetchedWord) /* Returns first index in response */

    renderSearchResultTitle(wordData)

    renderResponse(wordData)


    renderSourceList(wordData)

})

/* LARGE FUNCTIONS */

/* Function to create */
function renderResponse(wordData) {

    /* wordData.meanings the drill that contains everything */

    for (let aspect of wordData.meanings) {

        let responseBlock = document.createElement("article")
        responseBlock.classList.add("response-block")


        /* Create article element for data population, renders it */
        let newContainer = renderContainerBase(aspect.partOfSpeech)
        responseBlock.innerHTML = newContainer
        fetchedWordContainer.appendChild(responseBlock)

        /* Redefine each element, with the part of speech attached, so the loop properly targets each part of speech */
        let definitionList = document.getElementById(`${aspect.partOfSpeech}-definition`)
        let exampleList = document.getElementById(`${aspect.partOfSpeech}-example`)
        let synonymList = document.getElementById(`${aspect.partOfSpeech}-synonym`)
        let antonymList = document.getElementById(`${aspect.partOfSpeech}-antonym`)

        /* Work on variable names to make more readable */

        renderFullWordData(aspect, definitionList, exampleList, synonymList, antonymList)
        /* Render all definitions, examples, synonyms, and antonyms to the screen */

    }
}

/* Maps all word information to the page in proper HTML elements */
function renderFullWordData(aspect, definitionList, exampleList, synonymList, antonymList) {
        // Render all defintions on screen

        for (let item of aspect.definitions) {  
            appendMeanings(item.definition, definitionList)
        }

        // Render all examples on screen
        for (let item of aspect.definitions) {
            appendMeanings(item.example, exampleList)
        }

        // Render all synonyms and antonyms on screen
        appendAltWordsToScreen(aspect.synonyms, synonymList)
        appendAltWordsToScreen(aspect.antonyms, antonymList)

        // Here to let me know the loop was successful
        console.log(`completed iteration of ${aspect.partOfSpeech}`)

}

/* HELPER FUNCTIONS */

function randNum(maxNum) {
    /* Returns a random number between 0 and the length of given array */
    /* Used for randomizing responses for website */

    let randIndex = Math.floor(Math.random() * maxNum) 
    return randIndex
}

/* Renders the user input above the API data pull */
function renderSearchResultTitle(apiData) {

    /* If no phonetic, display the word only. */
    if (!apiData.phonetic) {
        inputDisplay.innerHTML = `${wordData.word}`
    } else {
    /* If word has a phonetic, proceed as normal */
        inputDisplay.innerHTML = `${apiData.word} (${apiData.phonetic})`
    }

    fetchedWordContainer.appendChild(inputDisplay)
}

/* Maps synonyms and antonyms to the site */
function appendAltWordsToScreen(altWordsArray, altWordListEl) {

    if (altWordsArray.length > 0) {
        for (let altWord of altWordsArray) {
            let newAltWordEl = document.createElement("li")
            newAltWordEl.innerHTML = `${altWord}`
            altWordListEl.appendChild(newAltWordEl)
        }
    }
    
}

/* Maps definitions/examples to the site */
function appendMeanings(meaning, meaningList) {

        if (meaning) {
            let NewMeaning = document.createElement("li")
            NewMeaning.innerHTML = `${meaning}`
            meaningList.appendChild(NewMeaning)
        }
}


/* Creates the base article element used to auto populate API pull */
function renderContainerBase(partOfSpeech) {

        let containerBase = `
            <h3>As a ${partOfSpeech}</h3>
            <h4>Definitions</h4>
            <ul class="definition-list" id="${partOfSpeech}-definition"></ul>
            <h4>Examples</h4>
            <ul class="example-list" id="${partOfSpeech}-example"></ul>


            <section id="synonyms-antonyms-block">

                <article class="synonyms-display">
                    <h5>Synonyms</h5>
                    <ul class="synonyms-list" id="${partOfSpeech}-synonym"></ul>
                </article>

                <article class="antonyms-display">
                    <h5>Antonyms</h5>
                    <ul class="antonyms-list" id="${partOfSpeech}-antonym"></ul>
                </article>

            </section>
        `

        return containerBase
}

function renderSourceList(wordData) {
    for (let source of wordData.sourceUrls) {
        let newSource = document.createElement("li")
        newSource.innerHTML = `<a href="${source}">${source}</a>`
        sourceList.appendChild(newSource)
    }
}

/* Accepts any number of arguements, clears the API data of all DOM elements passed into it */
function clearScreen(...elements) {
    for (let element of elements) {
        element.innerHTML = ""
    }
}

/* AXIOS API FUNCTIONS */

/* Literally just grabs the word from the API */
async function getWord(drill, word) {

    let response = await axios.get(`${drill}${word}`)
    // console.log(response.data)
    return response.data[0]
    /* Returns a list containing 1 or multiple objects */
    /* Literally all we need is the first item. IDK why the API is set up like this */

}