import { renderSeasons } from './addEpisodeForm.js'  
import {
    askModal,
    episodesModal,
    modalWrapper,
    episodesContainer,
    modalTitle,
} from './domElements.js'

export function openModal (id) {
    seriesID = id
    document.body.classList.add('show-modal')
}

export function closeModal(){
    document.body.classList.remove('show-modal')
    askModal.classList.remove('hide')
    episodesModal.classList.remove('show')
    modalWrapper.querySelectorAll('button').forEach(btn => btn.classList.remove('loading'))
    episodesContainer.parentElement.classList.remove("show")
}

export function showEpisodesModal() {
    const currentSeries = allSeries.find(series => series.seriesID === seriesID)

    if(!currentSeries.seasons.length){
        alert(`${currentSeries.title} has no seasons/episodes. You need to add an episode first`)
        closeModal()
        return
    }

    renderSeasons(currentSeries.seasons)
    modalTitle.textContent = `Editing '${currentSeries.title}'`
    episodesModal.classList.add('show')
    askModal.classList.add('hide')
}
