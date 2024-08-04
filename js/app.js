import { initEventListeners } from "./modules/eventListeners.js"
window.v = validator
window.genres = []
window.casts = []
window.videoQualities = []
window.subtitles = []
window.seriesID = null
window.allSeries = []
window.seriesInfosEditMode = false // specifies if user wants to add a new series or edit a series. if set to true, it means user wants to edit a series
window.isNewSeason = false // specifies if user wants to add a new season or a new episode
window.folderRef = null // refrence to the folder in firebase cloud storage where user wants to upload the file
window.uploadedVideosCounter = 0 // number of uploaded videos successfully
window.uploadedSubtitlesCounter = 0 // number of uploaded subtitles successfully 
window.currentEpisodeNumber = 1
window.currentSeasonNumber = null

// ---------- CODES FOR ADDING OR EDITING A SERIES ---------- //

initEventListeners()

