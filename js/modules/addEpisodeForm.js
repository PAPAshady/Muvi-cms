import { validateInputs, clearInputs, deleteFilesAndFolders } from './utilities.js'
import { uploadData, showUploadElems } from './uploader.js'
import { db, doc, setDoc, listAll, updateDoc, deleteObject } from './Firebase.js'
import { closeModal } from './modal.js'
import {
    formTitle,
    episodeSeasonNumberInput,
    episodeNameInput,
    episodeCheckbox,
    editEpisodeBtn,
    addEpisodeBtn,
    addSubtitleBtn,
    addVideoBtn,
    seasonsContainer,
    episodesContainer,
} from './domElements.js'

const $ = document

//makes the episodes form visible to the user
export function showEpisodesForm (seriesTitle, id, editMode, episodeNumber, seasonNumber){
    closeModal()
    $.body.className = ''
    $.body.classList.add('add-episode')
    formTitle.textContent = `${editMode ? 'Edit' : 'Add'} ${seriesTitle} episode`
    seriesID = id
    $.querySelector('.series-infos-form').scrollIntoView({behavior: 'smooth'})

    const selectedSeries = allSeries.find(series => series.seriesID === id)

    if(editMode){
        const currentEpisode = selectedSeries.seasons[seasonNumber - 1].episodes[episodeNumber - 1]
        episodeSeasonNumberInput.disabled = true
        episodeNameInput.value = currentEpisode.episodeName
        videoQualities = [...currentEpisode.videoQualities]
        subtitles = [...currentEpisode.subtitles]
        showFiles(videoQualities)
        showFiles(subtitles)
        episodeCheckbox.checked = selectedSeries.isVisible
        editEpisodeBtn.classList.replace('hide', 'show')
        addEpisodeBtn.classList.replace('show', 'hide')
        currentEpisodeNumber = episodeNumber
        currentSeasonNumber = seasonNumber
    }else{

        editEpisodeBtn.classList.replace('show', 'hide')
        addEpisodeBtn.classList.replace('hide', 'show')
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
}

export async function addEpisodeOrSeason () {

    if(validateInputs('episode')){
        addEpisodeBtn.classList.add('loading')
        addEpisodeBtn.disabled = true
        addSubtitleBtn.disabled = true
        addVideoBtn.disabled = true
        episodeCheckbox.disabled = true
    
        if(episodeSeasonNumberInput.value === episodeSeasonNumberInput.lastElementChild.value){
            isNewSeason = true
        }
        const currentSeries = JSON.parse(JSON.stringify(allSeries.find(series => series.seriesID === seriesID))) 
        const seasonNumber = episodeSeasonNumberInput.value
        const newEpisode = {
            episodeID : `${currentSeries.seriesID}-S${seasonNumber}E1`,
            episodeName : episodeNameInput.value.trim(),
            videoQualities : videoQualities.map(video => ({name : video.name, quality : video.quality, id: video.id})),
            subtitles : subtitles.map(subtitle => ({name : subtitle.name, language : subtitle.language, id : subtitle.id})),
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
            folderRef = `series/${currentSeries.seriesID}/season${seasonNumber}/episode${currentEpisodeNumber}`
        }else{
            currentEpisodeNumber = currentSeries.seasons[seasonNumber - 1].episodes.length
            newEpisode.episodeID = `${currentSeries.seriesID}-S${seasonNumber}E${currentEpisodeNumber + 1}`
            currentSeries.seasons[seasonNumber - 1].episodes.push(newEpisode)
            folderRef = `series/${currentSeries.seriesID}/season${seasonNumber}/episode${currentEpisodeNumber + 1}`
        }

        showUploadElems(videoQualities, true)
        showUploadElems(subtitles, false)

        try{
            const msg = await uploadData(videoQualities, true)
            alert(msg)

            if(subtitles.length){
                let msg
                try{
                    msg = await uploadData(subtitles, false)
                }catch(errorMsg){
                    msg = errorMsg
                }
                alert(msg)
            }

            try{
                const episodeRef = doc(db, 'series', currentSeries.seriesID)
                await setDoc(episodeRef, {seasons : currentSeries.seasons}, {merge : true})
                alert(`Episode added successfully :)`)
                // showSeries(allSeries)
                clearInputs()
            }catch (err) {
                alert('An error occurred while adding the new episode')
                console.log(err);
            }
        }catch(errorMsg){
            alert(errorMsg)
        }

        window.scrollTo({top : 0, behavior : 'smooth'})
        isNewSeason = false
        $.body.className = ''
        addEpisodeBtn.classList.remove('loading')
        addEpisodeBtn.disabled = false
        addSubtitleBtn.disabled = false
        addVideoBtn.disabled = false
        episodeCheckbox.disabled = false
    }
}

function renderSeasons (seasonArray){
    seasonsContainer.innerHTML = ''
    const seasons = seasonArray.map(season => {
        return `
            <div class="season">
                <span>Season ${season.seasonNumber}</span>
                <div class="btn-wrapper">
                    <button onclick="renderEpisodes(${season.seasonNumber})" class="btn">
                        <span class="btn-text">Edit</span>
                        <div class="btn-loader"></div>
                    </button>
                    <button onclick="removeSeason(event, ${season.seasonNumber})" class="btn">
                        <span class="btn-text">Remove</span>
                        <div class="btn-loader"></div>
                    </button>
                </div>
            </div>`
    }).join('')
    seasonsContainer.insertAdjacentHTML('beforeend', seasons)
}

function renderEpisodes (seasonNumber){
    const currentSeries = allSeries.find(series => series.seriesID === seriesID)
    const episodes = currentSeries.seasons[seasonNumber - 1].episodes
    episodesContainer.previousElementSibling.textContent = `Season ${seasonNumber} episodes :`
    episodesContainer.innerHTML = ''

    const episodeElements = episodes.map((episode, index) => {
        return `
            <div class="episode">
                Episode ${index + 1} : ${episode.episodeName}
                <div class="icons">
                    <svg onclick="showEpisodesForm('${currentSeries.title}', '${seriesID}', true, ${index + 1}, ${seasonNumber})" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                    <svg onclick="removeEpisode(${index + 1}, ${seasonNumber})" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                </div>
            </div>`
    }).join('')

    episodesContainer.insertAdjacentHTML('beforeend', episodeElements)
    episodesContainer.parentElement.classList.add("show")
}

async function removeSeason(e, seasonNumber) {
    let currentSeries = allSeries.find(series => series.seriesID === seriesID)
    const shouldDelete = confirm(`Are you sure you want to delete season ${seasonNumber} of ${currentSeries.title} ?\nThis action is permanent.`)

    if(shouldDelete){
        let btn
        if(e){
            btn = e.target.className === 'btn' ? e.target : e.target.parentElement
            btn.classList.add('loading')
        }
        const seriesRef = doc(db, `series/${seriesID}`)
        const seasons = currentSeries.seasons.filter(season => season.seasonNumber != seasonNumber)
        const seasonRef = ref(storage, `series/${seriesID}/season${seasonNumber}`)

        try {
            await deleteFilesAndFolders(seasonRef)
            await setDoc(seriesRef, {seasons}, {merge : true})
            alert(`Season ${seasonNumber} of ${currentSeries.title} removed successfully`)
            currentSeries = allSeries.find(series => series.seriesID === seriesID)

            // check if any season left for this series
            if(currentSeries.seasons.length){
                renderSeasons(currentSeries.seasons)
                episodesContainer.parentElement.classList.remove("show")
            }else{
                closeModal()
            }

        } catch (error) {
            alert(`Oops, an error occurred while removing this season, please try again`)
            console.log(error);
        }

        if(btn){
            btn.classList.remove('loading')
        }
    }
}

export async function editEpisode(){

    if(validateInputs('episodes')){
        editEpisodeBtn.classList.add('loading')
        editEpisodeBtn.disabled = true

        // using JSON methods to avoid over-writing the main array (allSeries array)
        const currentSeries = JSON.parse(JSON.stringify(allSeries.find(series => series.seriesID === seriesID)))
        const currentEpisode = currentSeries.seasons[currentSeasonNumber - 1].episodes[currentEpisodeNumber - 1]
        const episodeRef = ref(storage, `series/${seriesID}/season${currentSeasonNumber}/episode${currentEpisodeNumber}`)
        const addedQualities = videoQualities.map(video => video.quality)
        const addedLanguages = subtitles.map(subtitle => subtitle.language)
        folderRef = episodeRef
        let res
    
        try{
            res = await listAll(episodeRef)
        }catch(err){
            alert('An error occurred while getting episode data from server, please try again.')
            window.scrollTo({top : 0, behavior : 'smooth'})
            editEpisodeBtn.classList.remove('loading')
            editEpisodeBtn.disabled = false
            $.body.className = ''
            return
        }
    
        const filesRefs = res.items.map(ref => ref._location.path_)
    
        // qualities and subtitles languages that is currently in the cloud-storage
        const qualities = []
        const languages = []
    
        filesRefs.forEach(ref => {
            ref = ref.split('-').slice(-1)[0]
            if(ref.endsWith('.srt') || ref.endsWith('.vvt')){
                languages.push(ref.split('.')[0].trim())
            }else{
                qualities.push(ref.split('.')[0].trim())
            }
        })
    
        const videosToUpload = videoQualities.filter(video => !qualities.includes(video.quality)) 
        const subtitlesToUpload = subtitles.filter(subtitle => !languages.includes(subtitle.language))
    
        const videosToRemove = qualities.filter(file => !addedQualities.includes(file))
        const subtitlesToRemove = languages.filter(file => !addedLanguages.includes(file))
        const fileRefsToDelete = []
    
        res.items.forEach(ref => {
            const shouldDeleteVideo = videosToRemove.some(quality => ref._location.path_.includes(quality))
            const shouldDeleteSubtitle = subtitlesToRemove.some(language => ref._location.path_.includes(language))
            if(shouldDeleteVideo || shouldDeleteSubtitle){
                fileRefsToDelete.push(ref)
            }
        })
    
        // if all of these conditions are false that means user didn't change anything yet
        const userUploadedFiles = videosToUpload.length && subtitlesToUpload.length
        const userRemovedFiles = fileRefsToDelete.length
        const userChangedEpisodeName = episodeNameInput.value.trim() !== currentEpisode.episodeName
        const userChangedVisibility = episodeCheckbox.checked !== currentEpisode.isVisible
    
        if(!userUploadedFiles && !userRemovedFiles && !userChangedEpisodeName && !userChangedVisibility){
            alert("You haven't made any changes yet")
            editEpisodeBtn.classList.remove('loading')
            editEpisodeBtn.disabled = false
            return
        }
        
        if(videosToUpload.length || subtitlesToUpload.length){
            showUploadElems(videosToUpload, true)
            showUploadElems(subtitlesToUpload, false)
    
            try{
                // upload new files
                const msg = await uploadData(videosToUpload, true)
                alert(msg)
        
                if(subtitlesToUpload.length){
                    let msg
                    try{
                        msg = await uploadData(subtitlesToUpload, false)
                    }catch(errorMsg){
                        msg = errorMsg
                    }
                    alert(msg)
                }
    
            }catch(err) {
                alert('Failed to upload Your videos, please try again later')
            }
        }
    
        // delete the files user wants to delete
        if(fileRefsToDelete.length){
            try{
                const deletePromises = fileRefsToDelete.map(ref => deleteObject(ref))
                await Promise.all(deletePromises)
            }catch (err){
                alert('An error occurred while deleting the files from server')
                console.log(err);
            }
        }
    
        currentEpisode.episodeName = episodeNameInput.value.trim()
        currentEpisode.isVisible = episodeCheckbox.checked
        currentEpisode.videoQualities = videoQualities.map(video => ({id : video.id, name : video.name, quality : video.quality}))
        currentEpisode.subtitles = subtitles.map(subtitle => ({id: subtitle.id, name : subtitle.name, language: subtitle.language}))
    
        const seriesRef = doc(db, `series/${seriesID}`)
    
        try{
            await updateDoc(seriesRef, {
                seasons : currentSeries.seasons
            })
        }catch (err){
            alert('An error occurred while updating the changes on database')
            console.log(err);
        }
    
        alert('Episode edited successfully !')
        window.scrollTo({top : 0, behavior : 'smooth'})
        editEpisodeBtn.classList.remove('loading')
        editEpisodeBtn.disabled = false
        $.body.className = ''
    }
}

async function removeEpisode (episodeNumber, seasonNumber) {

    // if this is the last episode of this season, remove the whole season
    if(episodeNumber == 1){
        removeSeason(undefined, seasonNumber)
    }else{
        const shouldDelete = confirm(`Are you sure you want to remove this episode ?`)
    
        if(shouldDelete){
            // used JSON methods to avoid over-writing the main array (allSeries array)
            let currentSeries = JSON.parse(JSON.stringify(allSeries.find(series => series.seriesID === seriesID)))
            
            // this references to the episode files in firebase cloud storage
            const episodeFolderRef = ref(storage, `series/${seriesID}/season${seasonNumber}/episode${episodeNumber}`)
            
            // this references to current series data in fireStore database
            const seriesRef = doc(db, `series/${seriesID}`)
    
            // remove the episode from currentSeries
            currentSeries.seasons[seasonNumber - 1].episodes.splice(episodeNumber - 1, 1)
            
            try{
                const filesList = await listAll(episodeFolderRef)
                const filesPromises = filesList.items.map(item => deleteObject(item))
                    
                await Promise.all(filesPromises)
                await setDoc(seriesRef, {seasons : currentSeries.seasons}, {merge : true})
                alert(`Episode ${episodeNumber} of season${seasonNumber} deleted successfully.`)
            
                renderEpisodes(seasonNumber)
            }catch(err){
                alert('Oops, an error occurred while removing this episode.\nPlease try again.')
                console.log(err);
            }
        }
    }
}
