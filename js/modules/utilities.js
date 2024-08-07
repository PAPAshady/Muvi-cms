import { listAll, deleteObject } from './Firebase.js'
import Parser from '../../packages/srt-parser.js'
import {
    titleInput,
    descriptionInput,
    yearInput,
    monthInput,
    dayInput,
    videoPosterInput,
    imageUrlInput,
    countryInput,
    producerNameInput,
    ratingInput,
    tagsInput,
    castsInput,
    episodeNameInput,
    videoFileInput,
    videoQualityInput,
    portraitImg,
    landscapeImg,
    videoQualitiesContainer,
    subtitlesContainer,
    allSeriesContainer
} from './domElements.js'

const $ = document

// validate inputs before fetching the data
export function validateInputs (formNameToValidate) {

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
        if(!videoQualities.length) return showInvalidInput([videoFileInput.parentElement, videoQualityInput])
    }
    
    return true
}

export function clearInputs () {
    document.querySelectorAll('input').forEach(input => input.value = '')
    document.querySelector('textarea').value = ''
    document.querySelectorAll('.input span').forEach(span => span.remove())
    document.querySelectorAll('.form-input').forEach(elem => elem.classList.remove('invalid'))
    document.querySelectorAll('input[type="file"]').forEach(input => input.value = null)
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

export async function deleteFilesAndFolders(ref) {
    const folderList = await listAll(ref)

    // Recursively delete all files
    const filesPromises = folderList.items.map(itemRef => deleteObject(itemRef))

    // Recursively delete all subfolders
    const subfolderPromises = folderList.prefixes.map(subfolderRef => deleteFilesAndFolders(subfolderRef))

    await Promise.all(filesPromises)
    await Promise.all(subfolderPromises)
}

export function searchHandler (e) {
    const value = e.target.value.trim()
    if(value){
        const filteredSeries = allSeries.filter(series => series.title.toUpperCase().includes(value.toUpperCase()))
        showSeries(filteredSeries)
    }else{
        showSeries(allSeries)
    }
}

export function showSeries (seriesArray) {
    
    if(seriesArray){
        allSeriesContainer.querySelectorAll('.media-card').forEach(elem => elem.remove())
        const seriesElems = seriesArray.map(series => {
            return `
                <div class="media-card" data-title="${series.title}" data-id="${series.seriesID}">
                    <a href="#">
                        <img loading="lazy" src="${series.imageURL}" alt="${series.title}">
                    </a>
                    <div class="media-info">
                        <a href="#">${series.title}</a>
                        <div class="btn-wrapper">
                            <button id="deleteSeriesBtn" class="btn-fill">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                            </button>
                            <button id="editSeriesBtn" class="btn-fill">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </button>
                            <button id="addEpisodeBtn" class="btn-fill">
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


export function scrollToTop(){
    window.scrollTo({top : 0, behavior: 'smooth'})

    $.querySelectorAll('.btn').forEach(btn => {
        btn.disabled = false
        btn.classList.remove('loading')
    })

    $.querySelectorAll('checkbox').forEach(checkbox => checkbox.disabled = false)
    document.body.className = ''
}


// this function convertes subtitles with .srt format to standard .vtt format for browsers
export async function srtParser(subtitleArr) {
    const parser = new Parser();

    // Function to read and process a file
    const processFile = (subtitle) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsText(subtitle.file);

            reader.onload = function(e) {
                const srt = e.target.result;
                const srtArray = parser.fromSrt(srt);

                let vttString = 'WEBVTT\n\n'; // WebVTT header
                srtArray.forEach((cue, index) => {
                    // WebVTT requires time in '00:00:00.000' format
                    const startTime = cue.startTime.replace(',', '.');
                    const endTime = cue.endTime.replace(',', '.');

                    // Add cue index (starting from 1) to the WebVTT format
                    vttString += (index + 1) + '\n';
                    vttString += startTime + ' --> ' + endTime + '\n';
                    vttString += cue.text + '\n\n';
                });

                const vtt = vttString.trim();
                const blob = new Blob([vtt], { type: 'text/vtt' });
                const modifiedFile = new File([blob], subtitle.name.replace('.srt', '.vtt'), { type: 'text/vtt' });

                // Resolve the promise with the modified file
                resolve({
                    id: subtitle.id,
                    language: subtitle.language,
                    file: modifiedFile,
                    name: modifiedFile.name,
                    type: 'vtt'
                });
            };
        });
    };

    // Map each subtitle file to a Promise
    const modifiedSubtitlesPromises = subtitleArr.map(processFile);

    // Wait for all files to be processed
    const modifiedSubtitles = await Promise.all(modifiedSubtitlesPromises);

    return modifiedSubtitles
}
