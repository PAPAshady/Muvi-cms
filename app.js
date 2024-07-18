const $ = document
const v = validator
const addSeriesBtn = $.getElementById('addSeriesBtn')
const formTitle = $.getElementById('formTitle')
const titleInput = $.getElementById('titleInput')
const descriptionInput = $.getElementById('descriptionInput')
const tagsInput = $.getElementById('tagsInput')
const yearInput = $.getElementById('yearInput')
const monthInput = $.getElementById('monthInput')
const dayInput = $.getElementById('dayInput')
const submitSeriesBtn = $.getElementById('submitSeriesBtn')
const videoPosterInput = $.getElementById('videoPosterInput')
const imageUrlInput = $.getElementById('imageUrlInput')
const portraitImg = $.getElementById('portraitImg')
const landscapeImg = $.getElementById('landscapeImg')
const countryInput = $.getElementById('countryInput')
const producerNameInput = $.getElementById('producerName')
const ratingInput = $.getElementById('ratingInput')
const castsInput = $.getElementById('castsInput')
const checkBox = $.getElementById('checkBox')
const searchInput = $.getElementById('searchInput')
const modalWrapper = $.querySelector('.modal-wrapper')
const modalTitle = $.getElementById('modalTitle')
const closeModalBtn = $.getElementById('closeModalBtn')
const allSeriesContainer = $.querySelector('.media-content-wrapper')
const editSeriesInfosBtn = $.getElementById('editSeriesInfosBtn')
const editSeriesEpisodesBtn = $.getElementById('editSeriesEpisodesBtn')
let genres = []
let casts = []
let seriesInfosEditMode = false // specifies if user wants to add a new series or edit a series. if set to true, it means user wants to edit a series
let seriesID = null
let allSeries = null



async function getAllSeries () {
    try {
        const res = await fetch('https://muvi-86973-default-rtdb.asia-southeast1.firebasedatabase.app/series.json')
        const data = await res.json()
        allSeries = Object.entries(data)
    } catch (error) {
        alert('An error occurred while getting the data from server')
        console.log(error);
    }
}

async function showSeries (seriesArray) {
    
    if(seriesArray){
        allSeriesContainer.querySelectorAll('.media-card').forEach(elem => elem.remove())
        const seriesElems = seriesArray.map(series => {
            return `
                <div class="media-card">
                    <a href="#">
                        <img loading="lazy" src="${series[1].imageURL}" alt="${series[1].title}">
                    </a>
                    <div class="media-info">
                        <a href="#">${series[1].title}</a>
                        <div class="btn-wrapper">
                            <button onclick="deleteSeries(event, '${series[1].title}', '${series[0]}')" class="btn-fill">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                            </button>
                            <button onclick="openModal(event, '${series[0]}')" class="btn-fill">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </button>
                            <button onclick="showEpisodesForm(event, '${series[1].title}', '${series[0]}', 'add-episode')" class="btn-fill">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
        
            `
        }).join('')

        allSeriesContainer.insertAdjacentHTML('beforeend', seriesElems)
    }
}

function searchHandler (e) {
    const value = e.target.value.trim()
    if(value){
        const filteredSeries = allSeries.filter(series => series[1].title.toUpperCase().includes(value.toUpperCase()))
        showSeries(filteredSeries)
    }else{
        showSeries(allSeries)
    }
}

//makes the add-series form visible to the user
function showAddSeriesForm (seriesTitle){
    $.body.className = ''
    $.body.classList.add('add-series')
    $.querySelector('.input-wrapper').scrollIntoView({behavior: 'smooth'})

    // change the text of submit btn and form title dynamically
    submitSeriesBtn.querySelector('.btn-text').textContent = seriesInfosEditMode ? 'Edit series' : 'Add new series'
    formTitle.textContent = seriesInfosEditMode ? `Edit ${seriesTitle} series` : 'Add new series'
}

//makes the episodes form visible to the user
function showEpisodesForm (e, seriesTitle, id){
    e.preventDefault()
    $.body.className = ''
    $.body.classList.add('add-episode')
    formTitle.textContent = `Add ${seriesTitle} episode`
    seriesID = id
    $.querySelector('.series-infos-form').scrollIntoView({behavior: 'smooth'})
}

// adds tags for inputs (casts and genres input)
function addInputTag(inputElem, tagsArray, arrayNameToPush){

    if(tagsArray.length === 5) {
        alert("You can't add anymore items !!!")
        inputElem.value = ''
        return
    }

    const value = inputElem.value.trim()

    if(value){
        if(tagsArray.includes(value.toLowerCase())){
            alert("You've already added this item !!!")
            inputElem.value = ''
            return
        }

        tagsArray.push(value.toLowerCase())
        renderInputTags(inputElem,tagsArray,arrayNameToPush)
    }else{
        alert('Please enter a value')
    } 
}

// since it's not possible to pass an variable name in onclick attribute of an element, i used arrayNameToPush to specify which array should be modified in removeInputTag function
function renderInputTags(inputElem, tagsArray, arrayNameToPush){
    inputElem.parentElement.querySelectorAll('span').forEach(span => span.remove())
    tagsArray.forEach(tag => {
        inputElem.parentElement.insertAdjacentHTML('afterbegin' ,
            `<span>
                ${tag}
                <svg onclick="removeInputTag(event,'${tag}', '${arrayNameToPush}')" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
            </span>`
        )

    })
    inputElem.value = ''
}

// removes tags from inputs (casts and genres input)
function removeInputTag (e, value, arrayName){
    if(e.target.tagName === 'path'){
        e.target.parentElement.parentElement.remove()
    }
    e.target.parentElement.remove()
    if(arrayName === 'genres'){
        genres = genres.filter(genre => genre !== value)
    }else{
        casts = casts.filter(cast => cast !== value)
    }
}

function showImagePreviewHandler (e, imageElem) {
    const value = e.target.value.trim()
    const errorMsg = e.target.nextElementSibling

    if(!value){
        imageElem.src = '/images/no-image.jpg'
        imageElem.parentElement.classList.remove('loading')
        e.target.classList.remove('invalid')
        errorMsg.textContent = 'Invalid URL'
        return
    }

    imageElem.classList.remove('invalid')
    const image = new Image()
    image.src = value
    imageElem.parentElement.classList.add('loading')
    
    image.addEventListener('load', ()=>{
        imageElem.src = value
        imageElem.parentElement.classList.remove('loading')
        errorMsg.textContent = 'Invalid URL'
    })

    image.addEventListener('error', ()=> {
        e.target.classList.add('invalid')
        errorMsg.textContent = 'Failed to load the image'
    })
}

// validate inputs before fetching the data
function validateInputs () {
    const title = titleInput.value.trim()
    const description = v.isLength(descriptionInput.value.trim(), {min: 50, max: 250})
    const dateRelease = v.isDate(`${yearInput.value}/${monthInput.value}/${dayInput.value}`)
    const videoPosterURL = v.isURL(videoPosterInput.value.trim())
    const imageURL = v.isURL(imageUrlInput.value.trim())
    const country = v.isAlpha(countryInput.value.trim(), ['en-US'], {ignore : '\s'})
    const producer = producerNameInput.value.trim()
    const rating = v.isDecimal(ratingInput.value.trim())

    const showInvalidInput = (elemsArray) => {
        elemsArray.forEach(elem => elem.classList.add('invalid'))
        elemsArray[0].scrollIntoView({behavior: 'smooth', block: 'center'})

        setTimeout(() => {
            elemsArray.forEach(elem => elem.classList.remove('invalid'))
        },2000)

        return false
    }

    if(!title) return showInvalidInput([titleInput.parentElement.parentElement])

    if(!description) return showInvalidInput([descriptionInput.parentElement.parentElement]) 

    if(!genres.length) return showInvalidInput([tagsInput.parentElement.parentElement])

    if(!dateRelease) return showInvalidInput([yearInput, monthInput, dayInput])

    if(!videoPosterURL) return showInvalidInput([videoPosterInput]) 

    if(!imageURL) return showInvalidInput([imageUrlInput]) 

    if(!country) return showInvalidInput([countryInput]) 

    if(!producer) return showInvalidInput([producerNameInput]) 

    if(!rating) return showInvalidInput([ratingInput]) 

    if(!casts.length) return showInvalidInput([castsInput.parentElement])

    return true
}

function addOrEditSeries (e){
    e.preventDefault()
                
    if(validateInputs()){

        const isAlreadyAdded = allSeries.some(series => series[1].title.toUpperCase() === titleInput.value.trim().toUpperCase())

        if(isAlreadyAdded && !seriesInfosEditMode){
            alert("You've added this series before !!!")
            return
        }

        submitSeriesBtn.classList.add('loading')
        submitSeriesBtn.setAttribute('disabled', true)

        const series = {
            seriesID : titleInput.value.trim().split(' ').join('-') + '-series', // add a dash between words
            title : titleInput.value.trim(),
            description : descriptionInput.value.trim(),
            imageURL : imageUrlInput.value.trim(),
            dateRelease : `${yearInput.value}/${monthInput.value}/${dayInput.value}`,
            rating : ratingInput.value,
            country : countryInput.value.trim(),
            producer : producerNameInput.value.trim(),
            videoPoster : videoPosterInput.value.trim(),
            isVisible : checkBox.checked,
            genres,
            casts,
            seasons : []
        }

        // change the url dynamically. it specifies if user wants to add a new series or edit a series
        fetch(`https://muvi-86973-default-rtdb.asia-southeast1.firebasedatabase.app/${seriesInfosEditMode ? `series/${seriesID}` : 'series'}.json`, {
            method : `${seriesInfosEditMode ? 'PUT' : 'POST'}`,
            headers : {
                "Content-type" : 'Application/json'
            },
            body : JSON.stringify(series)
        })
            .then(res => res.json())
            .then(getAllSeries)
            .then(()=>{
                alert(`Series ${seriesInfosEditMode ? 'edited' : 'added'} successfully :)`)
                clearInputs()
                showSeries(allSeries)
                window.scrollTo({top : 0, behavior : 'smooth'})
                seriesInfosEditMode = false
                $.body.classList.remove('add-series')
            })
            .catch(err => {
                alert('Error, something went wrong. Please turn on your VPN and try again :)')
                console.log(err)
            })
            .finally(()=> {
                submitSeriesBtn.classList.remove('loading')
                submitSeriesBtn.removeAttribute('disabled')
            })
    }
}

function deleteSeries(e,seriesTitle, seriesID){
    e.preventDefault()

    const isSure = confirm(`Are you sure you want to delete ${seriesTitle} completely ? this action is permanent and it will delete all this series seasons and episodes`)

    if(isSure){
        const shouldDelete = prompt(`If you are sure about deleting ${seriesTitle} permanently, please write  ${seriesTitle}  in the input below`)

        if(shouldDelete.toUpperCase().trim() === seriesTitle.toUpperCase()){
            fetch(`https://muvi-86973-default-rtdb.asia-southeast1.firebasedatabase.app/series/${seriesID}.json`, {
                method : 'DELETE'
            })
                .then(res => res.json())
                .then(getAllSeries)
                .then(()=>{
                    alert(`${seriesTitle} deleted successfully !`)
                    showSeries(allSeries)
                })
                .catch(err => {
                    alert(`An error occured while deleting ${seriesTitle} series`)
                    console.log(err);
                })
        }else{
            alert("You've entered the wrong name. Series will not be deleted haha !!!")
        }
    }
}

function openModal (e, id) {
    e.preventDefault()
    seriesID = id
    $.body.classList.add('show-modal')
}

function closeModal(){
    $.body.classList.remove('show-modal')
    modalWrapper.querySelector('.ask-modal').classList.remove('hide')
    modalWrapper.querySelector('.episodes-modal').classList.remove('show')
}

// fills the input with the infos of the series that user wants to edit
function editSeriesInfos () {
    closeModal()
    const seriesInfos = allSeries.find(series => series[0] === seriesID)[1]

    titleInput.value = seriesInfos.title
    descriptionInput.value = seriesInfos.description
    genres = seriesInfos.genres
    const date = seriesInfos.dateRelease.split('/')
    yearInput.value = date[0]
    monthInput.value = date[1]
    dayInput.value = date[2]
    videoPosterInput.value = seriesInfos.videoPoster
    imageUrlInput.value = seriesInfos.imageURL
    countryInput.value = seriesInfos.country
    producerNameInput.value = seriesInfos.producer
    ratingInput.value = seriesInfos.rating
    casts = seriesInfos.casts
    checkBox.checked = seriesInfos.isVisible

    seriesInfosEditMode = true
    renderInputTags(tagsInput, genres,'genres')
    renderInputTags(castsInput, casts,'casts')
    showAddSeriesForm(seriesInfos.title)
}

function clearInputs () {
    $.querySelectorAll('input').forEach(input => input.value = '')
    $.querySelectorAll('.input span').forEach(span => span.remove())
    $.querySelectorAll('.form-input').forEach(elem => elem.classList.remove('invalid'))
    portraitImg.parentElement.classList.remove('loading')
    landscapeImg.parentElement.classList.remove('loading')
    genres = []
    casts = []
}


addSeriesBtn.addEventListener('click', showAddSeriesForm)
submitSeriesBtn.addEventListener('click', addOrEditSeries)
imageUrlInput.addEventListener('input', e => showImagePreviewHandler(e, portraitImg))
videoPosterInput.addEventListener('input', e => showImagePreviewHandler(e, landscapeImg))
searchInput.addEventListener('input', searchHandler)
editSeriesInfosBtn.addEventListener('click', editSeriesInfos)

tagsInput.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        addInputTag(tagsInput, genres, 'genres')
    }
})

castsInput.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        e.preventDefault()
        addInputTag(castsInput, casts, 'casts')
    }
})

modalWrapper.addEventListener('click', e => {
    if(e.target.className === 'modal-wrapper' || closeModalBtn.contains(e.target)){
        closeModal()
    }
})

window.addEventListener('load', async ()=>{
    await getAllSeries()
    showSeries(allSeries)
})

