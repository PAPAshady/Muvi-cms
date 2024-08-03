import {db, collection, onSnapshot} from './Firebase.js'
import {
    addSeriesBtn,
    submitSeriesBtn,
    imageUrlInput,
    videoPosterInput,
    editSeriesInfosBtn,
    editSeriesEpisodesBtn,
    addEpisodeBtn,
    editEpisodeBtn,
    addVideoBtn,
    addSubtitleBtn,
    searchInput,
    allForms,
    tagsInput,
    castsInput,
    modalWrapper,
    closeModalBtn,
    portraitImg,
    landscapeImg,
} from './domElements.js'

export function initEventListeners () {
    
    addSeriesBtn.addEventListener('click', showAddSeriesForm)
    submitSeriesBtn.addEventListener('click', addOrEditSeries)
    imageUrlInput.addEventListener('input', e => showImagePreviewHandler(e, portraitImg))
    videoPosterInput.addEventListener('input', e => showImagePreviewHandler(e, landscapeImg))
    editSeriesInfosBtn.addEventListener('click', editSeriesInfos)
    editSeriesEpisodesBtn.addEventListener('click', showEpisodesModal)
    
    addEpisodeBtn.addEventListener('click', addEpisodeOrSeason)
    editEpisodeBtn.addEventListener('click', editEpisode)
    
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
}


