import { apiLink } from "./link.js"

// import * from "./functions.js"

const userInput = document.getElementById("user-input")
const submitButton = document.getElementById("submit-button")

const fetchedWordContainer = document.getElementById("fetched-word-container")

const inputDisplay = document.getElementById("input-display")

const sourceTitle = document.getElementById("source-title")
const sourceList = document.getElementById("source-list")

/* EVENT LISTENERS */

// The user can click on the submit button...
submitButton.addEventListener("click", async () => {
    LoadScreen()
})

// ... Or they can click enter
userInput.addEventListener("keydown", async () => {
    /* NOTE TO SELF: Modernize this later */
    if (event.key === "Enter") {
        LoadScreen()
    }
})

/* LARGE FUNCTIONS */

/* Loads up the entire API pull */
async function LoadScreen() {

    /* Clears previous response */
    clearScreen(fetchedWordContainer, sourceList, inputDisplay, userInput)

    let fetchedWord = userInput.value.trim()

    // Grab the word from API
    let wordData = await getWord(apiLink, fetchedWord) /* Returns first index in response */

    // Paste the word and phonetic on the screen
    renderSearchResultTitle(wordData)

    // Creates all response blocks, populates them with API data
    renderResponse(wordData)

    loadSourceList(wordData)
}

/* Loads, then fills, a block of content for each part of speech */
function renderResponse(wordData) {

    /* wordData.meanings the drill that contains everything */

    for (let aspect of wordData.meanings) {
        
        /* Create an empty response block */
        let responseBlock = document.createElement("article")
        responseBlock.classList.add("response-block")

        // Create article element for data population, renders it
        let newContainer = renderContainerBase(aspect.partOfSpeech)
        responseBlock.innerHTML = newContainer
        fetchedWordContainer.appendChild(responseBlock)

        /* Redefine each element, with the part of speech attached, so the loop properly targets each part of speech */
        let definitionTitle = document.getElementById(`${aspect.partOfSpeech}-definition-title`)
        let exampleTitle = document.getElementById(`${aspect.partOfSpeech}-example-title`)
        let synonymTitle = document.getElementById(`${aspect.partOfSpeech}-synonym-title`)
        let antonymTitle = document.getElementById(`${aspect.partOfSpeech}-antonym-title`)

        let definitionList = document.getElementById(`${aspect.partOfSpeech}-definition`)
        let exampleList = document.getElementById(`${aspect.partOfSpeech}-example`)
        let synonymList = document.getElementById(`${aspect.partOfSpeech}-synonym`)
        let antonymList = document.getElementById(`${aspect.partOfSpeech}-antonym`)

        renderPartOfSpeechDetails(
            aspect, definitionList, exampleList, synonymList, 
            antonymList, synonymTitle, antonymTitle
            , definitionTitle, exampleTitle)
        /* Render all definitions, examples, synonyms, and antonyms for this specific part of speech */

        // Here to let me know the loop was successful
        console.log(`completed iteration of ${aspect.partOfSpeech}`)

        // If no (Actual) data was loaded up, remove the container
        removeEmptyContainer(aspect.partOfSpeech)

    }
}

/* Maps all word information to the page in proper HTML elements */
function renderPartOfSpeechDetails(
    aspect, definitionList, exampleList, synonymList, 
    antonymList, synonymTitle, antonymTitle, 
    definitionTitle, exampleTitle) {
        // Render all defintions on screen

        for (let item of aspect.definitions) {  
            appendMeanings(item.definition, definitionList)
        }

        // Render all examples on screen
        for (let item of aspect.definitions) {
            appendMeanings(item.example, exampleList)
        }

        // Render titles for definitions and examples IF it's not empty
        loadListTitle(definitionList, definitionTitle, "Definitions")
        loadListTitle(exampleList, exampleTitle, "Examples")    

        

        // Render all synonyms and antonyms on screen
        appendAltWords(aspect.synonyms, synonymList, synonymTitle)
        appendAltWords(aspect.antonyms, antonymList, antonymTitle)

        

}

/* HELPER FUNCTIONS */

/* Returns a random number between 0 and the length of given array */
/* Used for randomizing flavot text for website */
function randNum(maxNum) {

    let randIndex = Math.floor(Math.random() * maxNum) 
    return randIndex
}

/* Creates the base article element used to auto populate API pull */
function renderContainerBase(partOfSpeech) {

        let containerBase = `
            <h3>As a ${partOfSpeech}</h3>
            <h4 class="meaning-title" id="${partOfSpeech}-definition-title"></h4>
            <ul class="meaning-list" id="${partOfSpeech}-definition"></ul>
            <h4 class="meaning-title" id="${partOfSpeech}-example-title"></h4>
            <ul class="meaning-list" id="${partOfSpeech}-example"></ul>


            <section id="synonyms-antonyms-block">

                <article class="synonyms-display">
                    <h5 id="${partOfSpeech}-synonym-title"></h5>
                    <ul class="alt-word-list" id="${partOfSpeech}-synonym"></ul>
                </article>

                <article class="antonyms-display">
                    <h5 id="${partOfSpeech}-antonym-title"></h5>
                    <ul class="alt-word-list" id="${partOfSpeech}-antonym"></ul>
                </article>

            </section>
        `

        return containerBase
}

/* Loads the word the user searched for, and its phonetic */
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

/* Maps definitions/examples to the site */
function appendMeanings(meaning, meaningList) {

        if (meaning) {
            let NewMeaning = document.createElement("li")
            NewMeaning.innerHTML = `${meaning}`
            meaningList.appendChild(NewMeaning)
        }
}

/* Maps synonyms/antonyms to the site */
function appendAltWords(altWordsArray, altWordListEl, altWordTitleEl) {

    if (altWordsArray.length > 0 && arrayIsNotEmpty(altWordsArray)) {

        if (altWordTitleEl.id.includes("antonym")) {
            altWordTitleEl.innerHTML = `Antonyms`
        } else {
            altWordTitleEl.innerHTML = `Synonyms`
        }

        for (let altWord of altWordsArray) {
            let newAltWordEl = document.createElement("li")
            newAltWordEl.classList.add("alt-word")
            newAltWordEl.innerHTML = `${altWord}`
            altWordListEl.appendChild(newAltWordEl)
        }
    }

    /* Must create an event listener INSIDE this function for alt word click to work */

    let altWordElements = document.querySelectorAll(".alt-word")

    /* If a user clicks on a synonym or antonym, it'll load that word! */
    for (let altWordEl of altWordElements) {
        
        altWordEl.addEventListener("click", async () => {
            
            let newWord = altWordEl.innerText
            userInput.value = newWord
            await LoadScreen()
        })
    }
    
}

/* Loads title for each list (Definition, synonyms, etc.) if it's NOT empty */
function loadListTitle(unorderedListEl, listTitleEl, titleText) {

    /* Got this off of StackOverflow IDK how it works */
    /* https://stackoverflow.com/questions/59541448/how-to-check-if-the-ul-tag-is-empty-using-javascript */

  if (unorderedListEl.innerHTML === "") {
    listTitleEl.innerHTML = ""
  } else {
    listTitleEl.innerHTML = titleText
  }
}

/* Removes ALL empty Part-Of-Speech containers from the screen  */
function removeEmptyContainer(partOfSpeech) {
    
    let containers = document.querySelectorAll(".response-block")

    // Loads the empty container base for comparison
    let emptyContainerBase = renderContainerBase(partOfSpeech)

    // If the innnerHTML of a container is the same as the initial container, that means it has no data. Remoe it!
    for (let container of containers) {
        
        if (container.innerHTML === emptyContainerBase) {
            container.remove()
        }
    }
}

/* Load up all source links */
function loadSourceList(wordData) {

    let wordSources = wordData.sourceUrls

    /* Maps all source links to the bottom of page */
    for (let source of wordSources) {
        let newSource = document.createElement("li")
        newSource.classList.add("source-link")
        newSource.innerHTML = `<a href="${source}">${source}</a>`
        sourceList.appendChild(newSource)
    }
    
    /* Title is plural if multiple sources */
    if (wordSources.length > 1 ) {
        sourceTitle.innerHTML = `Sources`
    } else {
        sourceTitle.innerHTML = `Source`
    }
}

/* Accepts any number of arguements, clears the API data of all DOM elements passed into it */
function clearScreen(...elements) {
    for (let element of elements) {
        element.innerHTML = ""
    }
}

/* Ensures the API array is not empty before populating data and creating title text for it's relevant part of speech and aspect */
function arrayIsNotEmpty(array) {

    if (array.length > 0) {
        return true
    } else {
        return false

    }
}

/* AXIOS API FUNCTIONS */

/* Literally just grabs the word from the API */
async function getWord(drill, word) {

    let response = await axios.get(`${drill}${word}`)
    
    return response.data[0]
    /* Returns a list containing 1 or multiple objects */
    /* Literally all we need is the first item. IDK why the API is set up like this */

}