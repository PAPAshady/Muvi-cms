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
const videoQualitiesContainer = $.getElementById('videoUrlsContainer')
const subtitleInput = $.getElementById('subtitleInput')
const subtitleLangInput = $.getElementById('subtitleLangInput')
const addSubtitleBtn = $.getElementById('addSubtitleUrlBtn')
const subtitlesContainer = $.getElementById('subtitleUrlsContainer')
const episodeCheckbox = $.getElementById('episodeCheckbox')
const submitEpisodeFormBtn = $.getElementById('addEpisodeBtn')
const videoUploadsWrapper = $.querySelector('.uploads .videos')
const subtitleUploadsWrapper = $.querySelector('.uploads .subtitles')

// modal elements
const modalWrapper = $.querySelector('.modal-wrapper')
const modalTitle = $.getElementById('modalTitle')
const closeModalBtn = $.getElementById('closeModalBtn')
const editSeriesInfosBtn = $.getElementById('editSeriesInfosBtn')
const editSeriesEpisodesBtn = $.getElementById('editSeriesEpisodesBtn')

let [genres, casts, videoQualities, subtitles] = [[], [], [], []]
let seriesID = null
let allSeries = []
let seriesInfosEditMode = false // specifies if user wants to add a new series or edit a series. if set to true, it means user wants to edit a series
let isNewSeason = false // specifies if user wants to add a new season or a new episode
let folderRef = null // refrence to the folder in firebase cloud storage where user wants to upload the file
let uploadedVideosCounter = 0 // number of uploaded videos successfully
let uploadedSubtitlesCounter = 0 // number of uploaded subtitles successfully 

// ---------- CODES FOR ADDING OR EDITING A SERIES ---------- //


function showSeries (seriesArray) {
    
    if(seriesArray){
        allSeriesContainer.querySelectorAll('.media-card').forEach(elem => elem.remove())
        const seriesElems = seriesArray.map(series => {
            return `
                <div class="media-card">
                    <a href="#">
                        <img loading="lazy" src="${series.imageURL}" alt="${series.title}">
                    </a>
                    <div class="media-info">
                        <a href="#">${series.title}</a>
                        <div class="btn-wrapper">
                            <button onclick="deleteSeries('${series.title}', '${series.seriesID}')" class="btn-fill">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                            </button>
                            <button onclick="openModal('${series.seriesID}')" class="btn-fill">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </button>
                            <button onclick="showEpisodesForm('${series.title}', '${series.seriesID}', 'add-episode')" class="btn-fill">
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

function deleteSeries(seriesTitle, seriesID){
    const isSure = confirm(`Are you sure you want to delete ${seriesTitle} completely ? this action is permanent and it will delete all this series seasons and episodes`)

    if(isSure){
        const shouldDelete = prompt(`If you are sure about deleting ${seriesTitle} permanently, please write  ${seriesTitle}  in the input below`)

        if(shouldDelete.toUpperCase().trim() === seriesTitle.toUpperCase()){

            deleteDoc(doc(db, 'series', seriesID))
                .then(()=>{
                    alert(`${seriesTitle} deleted successfully !`)
                })
                .catch(err => {
                    alert(`An error occurred while deleting ${seriesTitle} series`)
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



// ---------- CODES FOR ADDING OR EDITING AN EPISODE ---------- //

//makes the episodes form visible to the user
function showEpisodesForm (seriesTitle, id){
    $.body.className = ''
    $.body.classList.add('add-episode')
    formTitle.textContent = `Add ${seriesTitle} episode`
    seriesID = id
    $.querySelector('.series-infos-form').scrollIntoView({behavior: 'smooth'})

    const selectedSeries = allSeries.find(series => series.seriesID === id)

    episodeSeasonNumberInput.innerHTML = ''

    // render seasons of this series in the select box
    if(selectedSeries.seasons){
        const seasons = selectedSeries.seasons.map((season, index) => {;
            return `<option value="${index + 1}">Season ${index + 1}</option>`
        }).join('')

        episodeSeasonNumberInput.insertAdjacentHTML('afterbegin' ,seasons)

        // after rendering all the seasons in the select box, add a new option element in select box so user be able to add a new season
        episodeSeasonNumberInput.insertAdjacentHTML('beforeend', 
        `<option value="${selectedSeries.seasons.length + 1}">Season ${selectedSeries.seasons.length + 1} (New Season)</option>`
        )
    }else {
        episodeSeasonNumberInput.insertAdjacentHTML('beforeend', '<option value="1">Season 1 (New Season)</option>')
    }


}

function addNewFile (e, filesArray) {
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
    fileInputWrapper.classList.remove('invalid')
    
    const propertyName = filesArray === videoQualities ? 'quality' : 'language'
    const newFile = {
        file : fileInput.files[0],
        name : fileInput.files[0].name,
        [propertyName] : selectBox.value,
        id : filesArray.length + 1
    }

    // const isAlreadyAdded = filesArray.some(item => item[propertyName] === newFile[propertyName] || item.name === newFile.name)
    const isAlreadyAdded = filesArray.some(item => item[propertyName] === newFile[propertyName])


    if(isAlreadyAdded){
        alert("You've already added this item")
        return
    }
    
    // reset select box and file input
    fileInput.value = null
    selectBox.value = 'false'
    
    fileInputWrapper.nextElementSibling.textContent = ''
    filesArray.push(newFile)
    showFiles(filesArray)
}

function showFiles (filesArray){

    let containerElement
    let arrayName

    if(filesArray === videoQualities){
        containerElement = videoQualitiesContainer
        arrayName = 'videoQualities'
    }else{
        containerElement = subtitlesContainer
        arrayName = 'subtitles'
    }

    containerElement.innerHTML = ''
    const fileElements = filesArray.map(item => {
        return `
            <div class="url">
                <p>${item.name}</p>
                <span>${item.quality ? item.quality + 'p' : item.language.toUpperCase()}</span>
                <svg onclick="removeFile(${arrayName}, ${item.id})" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
            </div>
        `
    }).join('')

    containerElement.insertAdjacentHTML('beforeend', fileElements)
}

function removeFile(array, fileId) {
    if(array === videoQualities){
        videoQualities = videoQualities.filter(quality => quality.id !== fileId)
        showFiles(videoQualities)
    }else{
        subtitles = subtitles.filter(subtitle => subtitle.id !== fileId)
        showFiles(subtitles)
    }
}


async function addEpisodeOrSeason () {

    if(validateInputs('episode')){
        submitEpisodeFormBtn.classList.add('loading')
        submitEpisodeFormBtn.setAttribute('disabled', true)
    
        if(episodeSeasonNumberInput.value === episodeSeasonNumberInput.lastElementChild.value){
            isNewSeason = true
        }
        const currentSeries = JSON.parse(JSON.stringify(allSeries.find(series => series.seriesID === seriesID))) 
        const seasonNumber = episodeSeasonNumberInput.value
        const newEpisode = {
            episodeID : `${currentSeries.seriesID}-S${seasonNumber}E1`,
            episodeName : episodeNameInput.value.trim(),
            videoQualities : videoQualities.map(video => ({name : video.name, quality : video.quality})),
            subtitles : subtitles.map(subtitle => ({name : subtitle.name, language : subtitle.language})),
            isVisible : episodeCheckbox.checked,
            comments : []
        }

        if(isNewSeason){

            const seasons = []

            // if series has prev seasons, include them
            if(currentSeries.seasons.length){
                seasons.push(...currentSeries.seasons)
            }

            // add new season with its new episode
            seasons.push({
                seasonNumber,
                episodes : [newEpisode]
            })

            currentSeries.seasons = seasons

        }else{
            const uploadedEpisodes = currentSeries.seasons[seasonNumber - 1].episodes.length
            newEpisode.episodeID = `${currentSeries.seriesID}-S${seasonNumber}E${uploadedEpisodes + 1}`
            currentSeries.seasons[seasonNumber - 1].episodes.push(newEpisode)
        }


        $.body.classList.add('uploading')
        const uploadedEpisodes = currentSeries.seasons[seasonNumber - 1].episodes.length
        folderRef = `series/${currentSeries.seriesID}/season${seasonNumber}/episode${uploadedEpisodes}`
        
        showUploadElems(videoQualities)
        showUploadElems(subtitles)

        try{
            const msg = await uploadData(videoQualities)
            console.log(uploadedVideosCounter);
            console.log(videoQualities.length);
            alert(msg)

            if(subtitles.length){
                let msg
                try{
                    msg = await uploadData(subtitles)
                }catch(errorMsg){
                    msg = errorMsg
                }
                alert(msg)
            }

            try{
                const episodeRef = doc(db, 'series', currentSeries.seriesID)
                await setDoc(episodeRef, {seasons : currentSeries.seasons}, {merge : true})
                alert(`Episode added successfully :)`)
                isNewSeason = false
                showSeries(allSeries)
                window.scrollTo({top : 0, behavior : 'smooth'})
                clearInputs()
                $.body.className = ''
            }catch (err) {
                alert('An error occurred while adding the new episode')
                console.log(err);
            }
        }catch(errorMsg){
            alert(errorMsg)
        }

        submitEpisodeFormBtn.classList.remove('loading')
        submitEpisodeFormBtn.removeAttribute('disabled')
    }
}

// upload the files using firebase 
function uploadData (fileArray, fileIndex = 0){

    return new Promise((resolve, reject) => {

        // checks if any files left to upload
        if(fileIndex > fileArray.length - 1){
            let uploadCounter
            let errorMessage
            let successMessage

            if(fileArray === subtitles){
                uploadCounter = uploadedSubtitlesCounter
                errorMessage = `${uploadedVideosCounter} videos have uploaded successfully but failed to upload your subtitles. the operation will continue. you can upload your subtitles later from 'Edit episode' section :)`
                successMessage = `${uploadedSubtitlesCounter} subtitles uploaded out of ${subtitles.length}`
            }else{
                uploadCounter = uploadedVideosCounter
                errorMessage = 'In order to add a new episode, you need to upload at least 1 video. \n Please try again.'
                successMessage = `${uploadedVideosCounter} videos uploaded out of ${videoQualities.length}`
            }

            // resolve true if at least one file is uploaded
            uploadCounter ? resolve(successMessage) : reject(errorMessage)
            return
        }
    
        const progressElem = $.getElementById(`${fileArray === subtitles ? 'subtitle' : 'video'}File${fileIndex}`)
        const cancelBtn = progressElem.querySelector('#cancelBtn')
        const playOrPauseBtn = progressElem.querySelector('#playOrPauseBtn')
    
        const fileRef = ref(storage, `${folderRef}/${fileArray[fileIndex].name}`)
    
        // using firebase uploadBytesResumable method to upload the file 
        const uploadTask = uploadBytesResumable(fileRef, fileArray[fileIndex].file)
        progressElem.classList.replace('queued', 'uploading')
    
        let uploadState
    
        uploadTask.on('state_changed', snapshot => {
            uploadState = snapshot.state
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            progressElem.querySelector('.progress-bar').style.width = progress + '%'
            progressElem.querySelector('.percentage').textContent = Math.floor(progress) + '%'
        },
        error => {
            // do not show any error if user canceled the upload
            if(error.code !== 'storage/canceled'){
                const tryAgain = confirm(`Failed to upload ${fileArray[fileIndex].name}. Do you want to to try again ? \n if you click 'Cancel',this file will remove from the list and next file will upload`)

                if(tryAgain){
                    uploadData(fileArray, fileIndex).then(resolve).catch(reject)
                }else{
                    uploadTask.cancel()
                    removeUploadElems(progressElem)
                    uploadData(fileArray, fileIndex + 1).then(resolve).catch(reject)
                }
            }
        },
        () => { // on successful upload
            progressElem.className = 'progress done'

            if(fileArray === subtitles){
                uploadedSubtitlesCounter++
            }else{
                uploadedVideosCounter++
            }
            uploadData(fileArray, fileIndex + 1).then(resolve).catch(reject)
            console.log(`${fileArray[fileIndex].name} uploaded successfully`);
            
        })
    
    
        cancelBtn.addEventListener('click', e => {
            const shouldRemove = confirm('Are you sure you want to cancel this upload ?')
            if(shouldRemove){
                uploadTask.cancel()
                removeUploadElems(e.target)
        
                // if upload canceled, upload the next file
                uploadData(fileArray, fileIndex + 1).then(resolve).catch(reject)
            }
        })
    
        //change play or pause state
        playOrPauseBtn.addEventListener('click', () => {
            switch (uploadState) {
                case 'paused':
                    uploadTask.resume()
                    progressElem.className = 'progress uploading'
                    playOrPauseBtn.classList.replace('paused', 'running')
                    break;
                    
                case 'running':
                    uploadTask.pause()
                    progressElem.className = 'progress paused'
                    playOrPauseBtn.classList.replace('running', 'paused')
                break;
            }
        })

    })

}

function showUploadElems (arr) {

    const containerElem = arr === videoQualities ? videoUploadsWrapper : subtitleUploadsWrapper

    containerElem.innerHTML = ''
    const uploadingElements = arr.map((item, index) => {
        return `
            <div class="progress ${index || arr === subtitles ? 'queued' : 'uploading'}" id="${arr === subtitles ? 'subtitle' : 'video'}File${index}">
                <p>${item.name}</p>
                <div class="bar-wrapper">
                    <div class="bar">
                        <span class="percentage">0%</span>
                        <div class="progress-bar"></div>
                    </div>
                </div>
                <div class="btn-wrapper">
                    <button id="cancelBtn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                    </button>
                    <button id="playOrPauseBtn" class="running">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
                        </svg>
                    </button>
                </div>
            </div>`
    }).join('')

    containerElem.insertAdjacentHTML('beforeend', uploadingElements)
}
// this function only removes the ui elements... canceling the download is done by uploadData function
function removeUploadElems(elemToRemove) {

    // loops trough all parent elements until it reaches the main element with 'progress' class
    while(!elemToRemove.classList.contains('progress')){
        elemToRemove = elemToRemove.parentElement
    }

    elemToRemove.remove()
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
    videoQualitiesContainer.innerHTML = ''
    subtitlesContainer.innerHTML = ''
    landscapeImg.src = 'images/no-image.jpg'
    portraitImg.src = 'images/no-image.jpg'
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

addVideoBtn.addEventListener('click', e => addNewFile(e, videoQualities))
addSubtitleBtn.addEventListener('click', e => addNewFile(e, subtitles))

searchInput.addEventListener('input', searchHandler)

// preventDefault all forms
allForms.forEach(form => form.addEventListener('submit', e => e.preventDefault()))
$.querySelectorAll('input').forEach(input => input.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        e.preventDefault()
    }
}))

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

window.addEventListener('load', ()=>{

    // listens for any changes in database and gets the fresh data from database and shows them to user
    const seriesRef = collection(db, 'series')
    onSnapshot(seriesRef, snapshot => {
        allSeries = snapshot.docs.map(doc => doc.data())
        showSeries(allSeries)
    },
    err => {
        alert('Failed to get data from server, please check you connection and turn on your VPN')
        console.log(err);
    })
})

