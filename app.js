const $ = document
const v = validator

// form elements
const allForms = $.querySelectorAll('form')
const formTitle = $.getElementById('formTitle')

// series container elements
const searchInput = $.getElementById('searchInput')
const allSeriesContainer = $.querySelector('.media-content-wrapper')

// add-series form elements
const addSeriesBtn = $.getElementById('addSeriesBtn')
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
const seriesCheckbox = $.getElementById('seriesCheckbox')

// add-episode form elements
const episodeSeasonNumberInput = $.getElementById('episodeSeasonNumberInput')
const episodeNameInput = $.getElementById('episodeNameInput')
const videoUrlInput = $.getElementById('videoUrlInput')
const videoQualityInput = $.getElementById('episodeInput')
const addVideoBtn = $.getElementById('addVideoUrlBtn')
const videoUrlsContainer = $.getElementById('videoUrlsContainer')
const subtitleInput = $.getElementById('subtitleInput')
const subtitleLangInput = $.getElementById('subtitleLangInput')
const addSubtitleBtn = $.getElementById('addSubtitleUrlBtn')
const subtitleUrlsContainer = $.getElementById('subtitleUrlsContainer')
const episodeCheckbox = $.getElementById('episodeCheckbox')
const submitEpisodeFormBtn = $.getElementById('addEpisodeBtn')

// modal elements
const modalWrapper = $.querySelector('.modal-wrapper')
const modalTitle = $.getElementById('modalTitle')
const closeModalBtn = $.getElementById('closeModalBtn')
const editSeriesInfosBtn = $.getElementById('editSeriesInfosBtn')
const editSeriesEpisodesBtn = $.getElementById('editSeriesEpisodesBtn')

let [genres, casts, videoQualities, subtitles] = [[], [], [], []]
let [seriesID, allSeries] = [null, null]
let seriesInfosEditMode = false // specifies if user wants to add a new series or edit a series. if set to true, it means user wants to edit a series
let isNewSeason = false // sepcifies if user wants to add a new season or a new episode

// ---------- CODES FOR ADDING OR EDITING A SERIES ---------- //

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
                            <button onclick="deleteSeries('${series[1].title}', '${series[0]}')" class="btn-fill">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                            </button>
                            <button onclick="openModal('${series[0]}')" class="btn-fill">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </button>
                            <button onclick="showEpisodesForm('${series[1].title}', '${series[0]}', 'add-episode')" class="btn-fill">
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
        e.target.classList.remove('invalid')
        errorMsg.textContent = 'Invalid URL'
    })

    image.addEventListener('error', ()=> {
        e.target.classList.add('invalid')
        errorMsg.textContent = 'Failed to load the image'
    })
}

function addOrEditSeries (){                
    if(validateInputs('series')){

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
            isVisible : seriesCheckbox.checked,
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

function deleteSeries(seriesTitle, seriesID){
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
    landscapeImg.src = seriesInfos.videoPoster
    imageUrlInput.value = seriesInfos.imageURL
    portraitImg.src = seriesInfos.imageURL
    countryInput.value = seriesInfos.country
    producerNameInput.value = seriesInfos.producer
    ratingInput.value = seriesInfos.rating
    casts = seriesInfos.casts
    seriesCheckbox.checked = seriesInfos.isVisible

    seriesInfosEditMode = true
    renderInputTags(tagsInput, genres,'genres')
    renderInputTags(castsInput, casts,'casts')
    showAddSeriesForm(seriesInfos.title)
}



// ---------- CODES FOR ADDING OR EDITING AN EPISODE ---------- //


function addNewFile (e) {
    const fileInputWrapper = e.target.parentElement.querySelector('.file-input')
    const fileInput = e.target.parentElement.querySelector('input[type="file"]')
    const selectBox = e.target.parentElement.querySelector('select')
    const errorMsg = e.target.previousElementSibling

    // check if user selected any file
    if(fileInput.files.length){
        fileInput.classList.remove('invalid')
        errorMsg.classList.remove('show')
    }else{
        fileInputWrapper.classList.add('invalid')
        errorMsg.textContent = 'Please select a file'
        errorMsg.classList.add("show")
        return
    }

    // check if selected file has a valid format
    if(!fileInput.accept.includes(fileInput.files[0].type)){
        errorMsg.textContent = 'Invalid file format'
        errorMsg.classList.add('show')
        fileInputWrapper.classList.add('invalid')
        return
    }else{
        errorMsg.classList.remove('show')
    }
    
    // check if user selected any value from select-box
    if(selectBox.value === 'false'){
        selectBox.classList.add('invalid')
        errorMsg.textContent = 'Please chose a value from select-box'
        errorMsg.classList.add('show')
        return
    }

    selectBox.classList.remove('invalid')
    errorMsg.classList.remove('show')
    fileInputWrapper.nextElementSibling.textContent = ''

}

//makes the episodes form visible to the user
function showEpisodesForm (seriesTitle, id){
    $.body.className = ''
    $.body.classList.add('add-episode')
    formTitle.textContent = `Add ${seriesTitle} episode`
    seriesID = id
    $.querySelector('.series-infos-form').scrollIntoView({behavior: 'smooth'})

    const selectedSeries = allSeries.find(series => series[0] === id)[1]

    episodeSeasonNumberInput.innerHTML = ''

    // render seasons of this series in the select box
    if(selectedSeries.seasons){
        const seasons = Object.entries(selectedSeries.seasons).map((season, index) => {;
            return `<option value="${index + 1}">Season ${index + 1}</option>`
        }).join('')

        episodeSeasonNumberInput.insertAdjacentHTML('afterbegin' ,seasons)

        // after rendering all the seasons in the select box, add a new option element in select box so user be able to add a new season
        episodeSeasonNumberInput.insertAdjacentHTML('beforeend', 
        `<option value="${Object.entries(selectedSeries.seasons).length + 1}">Season ${Object.entries(selectedSeries.seasons).length + 1} (New Season)</option>`
        )
    }else {
        episodeSeasonNumberInput.insertAdjacentHTML('beforeend', '<option value="1">Season 1 (New Season)</option>')
    }


}

// function addURLHandler (e,inputElem){
//     const isSelectBoxValid = inputElem.nextElementSibling.value === 'false' ? false : true
//     const isUrlValid = v.isURL(inputElem.value.trim()) 
//     const errorMsg = e.target.previousElementSibling

//     //show error if url input is not valid
//     if(!isUrlValid){
//         inputElem.classList.add('invalid')
//         errorMsg.textContent = 'Please enter a valid URL'
//         errorMsg.classList.add('show')
//         return
//     }else{
//         inputElem.classList.remove('invalid')
//     }

//     //show error if user didn't select a value from select-box
//     if(!isSelectBoxValid){
//         inputElem.nextElementSibling.classList.add('invalid')
//         errorMsg.textContent = 'Please chose a value from select-box'
//         errorMsg.classList.add('show')
//         return
//     }

//     // if user fixed the error, remove the error message
//     inputElem.nextElementSibling.classList.remove('invalid')
//     errorMsg.classList.remove('show')

//     const newURL = {
//         url : inputElem.value.trim(),

//         // specifies if this object is a subtitle url or video url
//         [e.target.id === 'addVideoUrlBtn' ? 'quality' : 'language'] : inputElem.nextElementSibling.value
//     }

//     let isAlreadyAdded

//     if(e.target.id === 'addVideoUrlBtn'){
//         isAlreadyAdded = videoQualities.some(url => url.quality === newURL.quality)

//         if(isAlreadyAdded){
//             alert(`You've already added ${newURL.quality + 'p'} quality`)
//             return
//         }

//         videoQualities.push(newURL)
//         renderURL(videoQualities)

//     }else{
//         isAlreadyAdded = subtitles.some(subtitle => subtitle.language === newURL.language)

//         if(isAlreadyAdded){
//             alert("You've already added this subtitle language")
//             return
//         }

//         subtitles.push(newURL)
//         renderURL(subtitles)
//     }

//     // reset the inputs
//     inputElem.value = ''
//     inputElem.nextElementSibling.value = 'false'
// }

function renderURL (urlArray){
    const urls = urlArray.map(item => {
        return `
        <div class="url">
            <p>${item.url}</p>
            <span>${item.quality ? item.quality + 'p' : item.language.toUpperCase()}</span>
            <svg onclick="removeURL('${urlArray === videoQualities ? 'videoQualities' : 'subtitles'}', '${item.quality ? item.quality : item.language}')" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
            </svg>
        </div>
        `
    }).join('')

    if(urlArray === videoQualities){
        videoUrlsContainer.innerHTML = ''
        videoUrlsContainer.insertAdjacentHTML("beforeend", urls)
    }else{
        subtitleUrlsContainer.innerHTML = ''
        subtitleUrlsContainer.insertAdjacentHTML('beforeend', urls)
    }
}

function removeURL (urlArrayName, urlArrayProperty){
    if (urlArrayName === 'videoQualities'){
        videoQualities = videoQualities.filter(item => item.quality != urlArrayProperty)
        renderURL(videoQualities)
    }else{
        subtitles = subtitles.filter(subtitle => subtitle.language != urlArrayProperty)
        renderURL(subtitles)
    }
}

function addEpisodeOrSeason () {

    if(validateInputs('episode')){
        submitEpisodeFormBtn.classList.add('loading')
        submitEpisodeFormBtn.setAttribute('disabled', true)
    
        if(episodeSeasonNumberInput.value === episodeSeasonNumberInput.lastElementChild.value){
            isNewSeason = true
        }
        const currentSeries = allSeries.find(series => series[0] === seriesID)[1]
        const seasonNumber = episodeSeasonNumberInput.value
        const newEpisode = {
            episodeID : `${currentSeries.seriesID}-S${seasonNumber}E1`,
            episodeName : episodeNameInput.value.trim(),
            videoQualities,
            subtitles,
            isVisible : episodeCheckbox.checked,
            comments : []
        }

        let fetchUrl
        let dataToFetch

        if(isNewSeason){
            dataToFetch = [
                {
                    seasonNumber,
                    episodes : [newEpisode]
                }
            ]
            
            if(currentSeries.seasons){
                dataToFetch.unshift(...currentSeries.seasons)
            }

            fetchUrl = `https://muvi-86973-default-rtdb.asia-southeast1.firebasedatabase.app/series/${seriesID}/seasons.json`
        }else{
            const uploadedEpisodes = currentSeries.seasons[seasonNumber - 1].episodes.length

            newEpisode.episodeID = `${currentSeries.seriesID}-S${seasonNumber}E${uploadedEpisodes + 1}`
            
            dataToFetch = [
                ...currentSeries.seasons[seasonNumber -1].episodes,
                newEpisode
            ]

            fetchUrl = `https://muvi-86973-default-rtdb.asia-southeast1.firebasedatabase.app/series/${seriesID}/seasons/${seasonNumber -1}/episodes.json`
        }

        fetch(fetchUrl, {
            method : 'PUT',
            'Content-type' : 'Application/json',
            body : JSON.stringify(dataToFetch)
        })
            .then(res => res.json())
            .then(getAllSeries)
            .then(() => {
                alert(`Episode added successfully :)`)
                isNewSeason = false
                showSeries(allSeries)
                window.scrollTo({top : 0, behavior : 'smooth'})
                clearInputs()
                $.body.className = ''
            })
            .catch(err =>{
                alert('An error occurred while adding the new episode')
                console.log(err);
            })
            .finally(()=>{
                submitEpisodeFormBtn.classList.remove('loading')
                submitEpisodeFormBtn.removeAttribute('disabled')
            })    
    }
}



// ---------- CODES FOR INPUT VALIDATION ---------- //

// validate inputs before fetching the data
function validateInputs (formNameToValidate) {

    // show the user which input has invalid value
    const showInvalidInput = (elemsArray) => {
        elemsArray.forEach(elem => elem.classList.add('invalid'))
        elemsArray[0].scrollIntoView({behavior: 'smooth', block: 'center'})

        setTimeout(() => {
            elemsArray.forEach(elem => elem.classList.remove('invalid'))
        },3000)

        return false
    }

    if(formNameToValidate === 'series'){
        const title = titleInput.value.trim()
        const description = v.isLength(descriptionInput.value.trim(), {min: 50, max: 250})
        const dateRelease = v.isDate(`${yearInput.value}/${monthInput.value}/${dayInput.value}`)
        const videoPosterURL = v.isURL(videoPosterInput.value.trim())
        const imageURL = v.isURL(imageUrlInput.value.trim())
        const country = v.isAlpha(countryInput.value.trim(), ['en-US'], {ignore : '\s'})
        const producer = producerNameInput.value.trim()
        const rating = v.isDecimal(ratingInput.value.trim())
        
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
        
    }else{
        if(!episodeNameInput.value.trim()) return showInvalidInput([episodeNameInput])
        if(!videoQualities.length) return showInvalidInput([videoUrlInput, videoQualityInput, videoUrlInput.parentElement])
    }
    
    return true
}



// ---------- CLEAR INPUTS ---------- //

function clearInputs () {
    $.querySelectorAll('input').forEach(input => input.value = '')
    $.querySelectorAll('.input span').forEach(span => span.remove())
    $.querySelectorAll('.form-input').forEach(elem => elem.classList.remove('invalid'))
    portraitImg.parentElement.classList.remove('loading')
    landscapeImg.parentElement.classList.remove('loading')
    genres = []
    casts = []
    videoQualities = []
    subtitles = []
    videoUrlsContainer.innerHTML = ''
    subtitleUrlsContainer.innerHTML = ''
    $.querySelectorAll('select').forEach(elem => elem.value = 'false')
}


// ---------- CODES FOR MODALS ---------- //

function openModal (id) {
    seriesID = id
    $.body.classList.add('show-modal')
}

function closeModal(){
    $.body.classList.remove('show-modal')
    modalWrapper.querySelector('.ask-modal').classList.remove('hide')
    modalWrapper.querySelector('.episodes-modal').classList.remove('show')
}



// ---------- EVENT LISTENERS ---------- //

addSeriesBtn.addEventListener('click', showAddSeriesForm)
submitSeriesBtn.addEventListener('click', addOrEditSeries)
imageUrlInput.addEventListener('input', e => showImagePreviewHandler(e, portraitImg))
videoPosterInput.addEventListener('input', e => showImagePreviewHandler(e, landscapeImg))
editSeriesInfosBtn.addEventListener('click', editSeriesInfos)

submitEpisodeFormBtn.addEventListener('click', addEpisodeOrSeason)
// addVideoUrlBtn.addEventListener('click', e => addURLHandler(e,videoUrlInput))
// addSubtitleUrlBtn.addEventListener('click', e => addURLHandler(e, subtitleUrlInput))
addVideoBtn.addEventListener('click', addNewFile)
addSubtitleBtn.addEventListener('click', addNewFile)

searchInput.addEventListener('input', searchHandler)
// preventDefault all forms
allForms.forEach(form => form.addEventListener('submit', e => e.preventDefault()))

// show the name of selected file by file input
$.querySelectorAll('.file-input').forEach(input => input.addEventListener('change', e => {
    e.target.parentElement.nextElementSibling.textContent = e.target.files[0].name
}))

tagsInput.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        addInputTag(tagsInput, genres, 'genres')
    }
})

castsInput.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        addInputTag(castsInput, casts, 'casts')
    }
})

modalWrapper.addEventListener('click', e => {
    if(e.target.className === 'modal-wrapper' || closeModalBtn.contains(e.target)){
        closeModal()
    }
})

// window.addEventListener('load', async ()=>{
//     await getAllSeries()
//     showSeries(allSeries)
// })

