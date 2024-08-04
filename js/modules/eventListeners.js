import {db, collection, onSnapshot} from './Firebase.js'
import { addEpisodeOrSeason, editEpisode, showEpisodesForm, removeSeason, renderEpisodes, removeEpisode } from './addEpisodeForm.js'
import { showEpisodesModal, closeModal, openModal } from './modal.js'
import { addNewFile } from './fileHandler.js'
import { searchHandler, showSeries } from './utilities.js'
import {
    showAddSeriesForm,
    addOrEditSeries,
    showImagePreviewHandler,
    editSeriesInfos,
    deleteSeries,
    addInputTag,
    removeInputTag
} from './addSeriesForm.js'
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

const $ = document

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

    function initSeriesEventListeners () {
        $.querySelectorAll('.media-card').forEach(series => {
            const {id, title} = series.dataset
            series.querySelector('#deleteSeriesBtn').onclick = () => deleteSeries(title, id)
            series.querySelector('#editSeriesBtn').onclick = () => openModal(id)
            series.querySelector('#addEpisodeBtn').onclick = () => showEpisodesForm(title, id, false)
        })
    }
    
    window.addEventListener('load', ()=>{
    
        // listens for any changes in database and gets the fresh data from database and shows them to user
        const seriesRef = collection(db, 'series')
        onSnapshot(seriesRef, snapshot => {
            allSeries = snapshot.docs.map(doc => doc.data())
            showSeries(allSeries)
            
            //attach event listener to all series Elements after fetched them from database
            initSeriesEventListeners()
        },
        err => {
            alert('Failed to get data from server, please check you connection and turn on your VPN')
            console.log(err);
        })
    })
}

export function initRemoveTagEventListener () {
    $.querySelectorAll('#removeTagBtn').forEach(btn => btn.onclick = e => {
        removeInputTag(e, btn.dataset.text, btn.dataset.array)
    })
}

export function initSeasonsEventListeners () {
    $.querySelectorAll('#removeSeasonBtn').forEach(btn => btn.onclick = e => removeSeason(e, btn.dataset.seasonNumber))
    $.querySelectorAll('#editSeasonBtn').forEach(btn => btn.onclick = () => renderEpisodes(btn.dataset.seasonNumber))
}

export function initEpisodesEventListeners () {
    $.querySelectorAll('#removeEpisodeBtn').forEach(btn => btn.onclick = () => {
        removeEpisode(btn.dataset.episodeNumber, btn.dataset.seasonNumber)
    })

    $.querySelectorAll('#editEpisodeBtn').forEach(btn => btn.onclick = () => {
        const {title, id, editMode, episodeNumber, seasonNumber} = btn.dataset
        showEpisodesForm(title, id, editMode, episodeNumber, seasonNumber)
    })
}