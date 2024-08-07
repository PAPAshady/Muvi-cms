import { videoQualitiesContainer, subtitlesContainer } from './domElements.js'
import { initRemoveFileEventListeners } from './eventListeners.js'

export function addNewFile (e, filesArray) {
    const fileInputWrapper = e.target.parentElement.querySelector('.file-input')
    const fileInput = e.target.parentElement.querySelector('input[type="file"]')
    const selectBox = e.target.parentElement.querySelector('select')
    const errorMsg = e.target.previousElementSibling

    const hideError = () => {
        setTimeout(() => {
            fileInputWrapper.classList.remove('invalid')
            errorMsg.classList.remove('show')
            selectBox.classList.remove('invalid')
        },3000)
    }

    // check if user selected any file
    if(fileInput.files.length){
        fileInputWrapper.classList.remove('invalid')
        errorMsg.classList.remove('show')
    }else{
        fileInputWrapper.classList.add('invalid')
        errorMsg.textContent = 'Please select a file'
        errorMsg.classList.add("show")
        hideError()
        return
    }

    // check if selected file has a valid format
    if(!fileInput.accept.includes(fileInput.files[0].type)){
        errorMsg.textContent = 'Invalid file format'
        errorMsg.classList.add('show')
        fileInputWrapper.classList.add('invalid')
        hideError()
        return
    }else{
        errorMsg.classList.remove('show')
    }
    
    // check if user selected any value from select-box
    if(selectBox.value === 'false'){
        selectBox.classList.add('invalid')
        errorMsg.textContent = 'Please chose a value from select-box'
        errorMsg.classList.add('show')
        hideError()
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
        id : filesArray.length + 1,
        type : fileInput.files[0].name.split('.').slice(-1)[0]
    }

    // if the file is a subtitle, add the label to it from its dataset
    if(propertyName === 'language'){
        newFile.label = selectBox.children[selectBox.selectedIndex].dataset.lang
    }

    // set true if user already added this subtitle-language/quality-quality
    let isAlreadyAdded = filesArray.some(item => item[propertyName] === newFile[propertyName])

    // set true if user already added this file (same file name)
    let isRepetitive = filesArray.some(file => file.name === newFile.name)

    if(isAlreadyAdded){
        alert("You've already added this quality/language")
        return
    }else if(isRepetitive){
        alert("You've already added this file, please select another file")
        return
    }
    
    // reset select box and file input
    fileInput.value = null
    selectBox.value = 'false'
    
    fileInputWrapper.nextElementSibling.textContent = ''
    filesArray.push(newFile)
    showFiles(filesArray)
}

export function showFiles (filesArray){

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
                <svg id="removeFileBtn" data-array="${arrayName}" data-info="${item.quality ? item.quality : item.language}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
            </div>
        `
    }).join('')

    containerElement.insertAdjacentHTML('beforeend', fileElements)
    initRemoveFileEventListeners()
}

export function removeFile(array, fileInfo) {
    if(array === 'videoQualities'){
        videoQualities = videoQualities.filter(video => video.quality != fileInfo)
        showFiles(videoQualities)
    }else{
        subtitles = subtitles.filter(subtitle => subtitle.language != fileInfo)
        showFiles(subtitles)
    }
}
