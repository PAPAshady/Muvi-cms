import { doc, db, setDoc, deleteDoc } from './Firebase.js'
import { clearInputs, deleteFilesAndFolders } from './utilities.js'
import { closeModal } from './modal.js'
import {
    submitSeriesBtn,
    formTitle,
    titleInput,
    descriptionInput,
    imageUrlInput,
    yearInput,
    monthInput,
    dayInput,
    ratingInput,
    countryInput,
    producerNameInput,
    videoPosterInput,
    seriesCheckbox,
    landscapeImg,
    portraitImg,
    tagsInput,
    castsInput,
} from './domElements.js'

const $ = document


//makes the add-series form visible to the user
export function showAddSeriesForm (seriesTitle){
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

export function showImagePreviewHandler (e, imageElem) {
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

export function addOrEditSeries (){               
    if(validateInputs('series')){

        const isAlreadyAdded = allSeries.some(series => series.title.toUpperCase() === titleInput.value.trim().toUpperCase())

        if(isAlreadyAdded && !seriesInfosEditMode){
            alert("You've added this series before !!!")
            return
        }

        submitSeriesBtn.classList.add('loading')
        submitSeriesBtn.setAttribute('disabled', true)

        const series = {
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

        if(!seriesInfosEditMode){
            series.seriesID = titleInput.value.trim().split(' ').join('-') + '-series' // add a dash between words
        }

        // fetch data to server using firebase methods
        const seriesRef = doc(db, 'series', seriesInfosEditMode ? seriesID : series.seriesID)

        setDoc(seriesRef, series, {merge : true})
            .then(() => {
                alert(`Series ${seriesInfosEditMode ? 'edited' : 'added'} successfully :)`)
                clearInputs()
                window.scrollTo({top : 0, behavior : 'smooth'})
                seriesInfosEditMode = false
                $.body.classList.remove('add-series')
            })
            .catch(err => {
                alert('Error, something went wrong. Please turn on your VPN and try again :)')
                console.log(err)
            })
            .finally(() => {
                submitSeriesBtn.classList.remove('loading')
                submitSeriesBtn.removeAttribute('disabled')
            })
    }
}

async function deleteSeries(seriesTitle, seriesID){
    const isSure = confirm(`Are you sure you want to delete ${seriesTitle} completely ? this action is permanent and it will delete all this series seasons and episodes`)

    if(isSure){
        const shouldDelete = prompt(`If you are sure about deleting ${seriesTitle} permanently, please write  ${seriesTitle}  in the input below`)

        if(shouldDelete.toUpperCase().trim() === seriesTitle.toUpperCase()){

            const seriesRef  = ref(storage, `series/${seriesID}`)
            try{
                await deleteFilesAndFolders(seriesRef)
                await deleteDoc(doc(db, 'series', seriesID))
                alert(`${seriesTitle} deleted successfully !`)
            } catch(err){
                alert(`An error occurred while deleting ${seriesTitle} series`)
                console.log(err);
            }
        }else{
            alert("You've entered the wrong name. Series will not be deleted haha !!!")
        }
    }
}

// fills the input with the infos of the series that user wants to edit
export function editSeriesInfos () {
    closeModal()
    const seriesInfos = allSeries.find(series => series.seriesID === seriesID)

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
