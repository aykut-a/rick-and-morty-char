// States
let characters = []

// Handling filters
let choosingGender = false
let choosingStatus = false

// Pages
let totalPages = 0
let pageNumber = 1
let currentPageButton = ''

// User Choices
const nameInput = document.querySelector('[name-input]')
let chosenGender = 'all'
let chosenStatus = 'all'

// Gender and Status Handling
const genderSelector = document.getElementById('gender-selector')
const statusSelector = document.getElementById('status-selector')

genderSelector.addEventListener('change', () => { chosenGender = genderSelector.value })
statusSelector.addEventListener('change', () => { chosenStatus = statusSelector.value })

// Get the Characters 
const getButton = document.querySelector('[get-button]')
getButton.addEventListener('click', () => {
  pageNumber = 1
  setUrl()
})

function setUrl() {
  let url = 'https://rickandmortyapi.com/api/character'

  let genderUrl = `&gender=${chosenGender}`
  let statusUrl = `&status=${chosenStatus}`
  let nameUrl = `&name=${nameInput.value.trim('')}`
  let pageUrl = `&page=${pageNumber}`
  // Neutralizers
  if (chosenGender === 'all') { genderUrl = '' }
  if (chosenStatus === 'all') { statusUrl = '' }
  if (nameInput.value.trim('') === '') { nameUrl = '' }
  if (pageNumber === 1) { pageUrl = '' }

  let questionMark = '/?'
  if (genderUrl === '' && statusUrl === '' && nameUrl === '' && pageUrl === '') { questionMark = '' }
  url = url + `${questionMark}` + `${pageUrl}` + `${nameUrl}` + `${genderUrl}` + `${statusUrl}`
  fetchUrl(url)
}

function fetchUrl(url) {
  appendThere.innerHTML = ''
  fetch(`${url}`)
    .then(res => res.json())
    .then(data => {
      totalPages = data.info.pages
      characters = data.results
    })
  setTimeout(() => { sortTheButtonContainer(totalPages) }, 500)
  setTimeout(() => { characters.forEach(character => { conjureCard(character) }) }, 500)
}

// Where Do We Go My Lord?
const appendThere = document.querySelector('[results]')

function conjureCard(character) {
  // Creating the element
  const card = document.createElement('div')
  const namen = document.createElement('p')
  const gender = document.createElement('p')
  const image = document.createElement('img')
  const location = document.createElement('p')
  const species = document.createElement('p')
  const status = document.createElement('p')

  // Classing
  card.classList.add('character-card')
  namen.classList.add('character-name')
  gender.classList.add('character-gender')
  image.classList.add('character-image')
  location.classList.add('character-location')
  species.classList.add('character-species')
  status.classList.add('character-status')

  // Settings elements
  namen.innerHTML = '<span class="bold">Name: </span>' + `${character.name}`
  gender.innerHTML = '<span class="bold">Gender: </span>' + `${character.gender}`
  location.innerHTML = '<span class="bold">Location: </span>' + `${character.location.name}`
  species.innerHTML = '<span class="bold">Species: </span>' + `${character.species}`
  status.innerHTML = '<span class="bold">Status: </span>' + `${character.status}`
  image.setAttribute('src', `${character.image}`)

  // Appending
  card.append(image, namen, gender, location, species, status)
  appendThere.append(card)
}

// Button Container and Thus Pagination
const pageButtonsContainer = document.querySelector('[page-buttons]')

function sortTheButtonContainer(totalPages) {
  pageButtonsContainer.innerHTML = ''
  for (let i = 0; i < totalPages; i++) {
    const button = document.createElement('button')
    button.classList.add('page-button')
    button.innerText = i + 1
    button.setAttribute('button-id', `b${i + 1}`)
    button.addEventListener('click', () => { goToThePage(i + 1, button) })
    pageButtonsContainer.append(button)
  }
  currentPageButton = document.body.querySelector(`[button-id=b${pageNumber}]`)
  currentPageButton.classList.add('shown-page-button')
}

function goToThePage(index, element) {
  if (pageNumber === index) { return }
  currentPageButton.classList.remove('shown-page-button')
  element.classList.add('shown-page-button')
  currentPageButton = element
  pageNumber = index
  setUrl()
}
