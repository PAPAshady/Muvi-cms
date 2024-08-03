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
    videoUrlInput,
    videoQualityInput,
    portraitImg,
    landscapeImg,
    videoQualitiesContainer,
    subtitlesContainer,

} from './domElements'

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
        if(!videoQualities.length) return showInvalidInput([videoUrlInput, videoQualityInput, videoUrlInput.parentElement])
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
