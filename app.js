const $ = document
const v = validator
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
const checkBox = $.getElementById('checkBox')
let genres = []
let casts = []

//makes the add-series form visible to the user
addSeriesBtn.addEventListener('click', ()=>{
    $.body.classList.add('add-series')
    $.querySelector('.input-wrapper').scrollIntoView({behavior: 'smooth'})
})

// adds tags for inputs (casts and genres input)
// since it's not possible to pass an varable name in onclick attribute of an element, i used arrayNameToPush to specify whitch array should be modified in removeinputTag
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

        inputElem.parentElement.insertAdjacentHTML('afterbegin' ,
            `<span>
                ${value}
                <svg onclick="removeinputTag(event,'${value}', '${arrayNameToPush}')" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
            </span>`
        )

        tagsArray.push(value.toLowerCase())
        inputElem.value = ''
    }else{
        alert('Please enter a value')
    } 
}

// removes tags from inputs (casts and genres input)
function removeinputTag (e, value, arrayName){
    e.target.parentElement.remove()
    if(arrayName === 'genres'){
        genres = genres.filter(genre => genre !== value)
    }else{
        casts = casts.filter(cast => cast !== value)
    }
}

// validate inputs before fetching the data
function validateInputs () {
    const title = titleInput.value.trim()
    const description = v.isLength(descriptionInput.value.trim(), {min: 50, max: 250})
    const dateRelease = v.isDate(`${yearInput.value}/${monthInput.value}/${dayInput.value}`)
    const videoPosterURL = v.isURL(videoPosterInput.value.trim())
    const imageURL = v.isURL(imageUrlInput.value.trim())
    const country = v.isAlpha(countryInput.value.trim(), ['en-US'], {ignore : '\s'})
    const producer = producerNameInput.value.trim()
    const rating = v.isDecimal(ratingInput.value.trim())

    const showInvalidInput = (elemsArray) => {
        elemsArray.forEach(elem => elem.classList.add('invalid'))
        elemsArray[0].scrollIntoView({behavior: 'smooth', block: 'center'})

        setTimeout(() => {
            elemsArray.forEach(elem => elem.classList.remove('invalid'))
        },2000)

        return false
    }

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

    return true
}

function showImagePreviewHandler (e) {
    const value = e.target.value.trim()
    const errorMsg = e.target.nextElementSibling

    if(!value){
        portraitImg.src = '/images/no-image.jpg'
        landscapeImg.src = '/images/no-image.jpg'
        portraitImg.parentElement.classList.remove('loading')
        landscapeImg.parentElement.classList.remove('loading')
        imageUrlInput.classList.remove('invalid')
        errorMsg.textContent = 'Invalid URL'
        return
    }

    imageUrlInput.classList.remove('invalid')
    const image = new Image()
    image.src = value
    portraitImg.parentElement.classList.add('loading')
    landscapeImg.parentElement.classList.add('loading')
    
    image.addEventListener('load', ()=>{
        portraitImg.src = value
        landscapeImg.src = value
        portraitImg.parentElement.classList.remove('loading')
        landscapeImg.parentElement.classList.remove('loading')
        errorMsg.textContent = 'Invalid URL'
    })

    image.addEventListener('error', ()=> {
        imageUrlInput.classList.add('invalid')
        errorMsg.textContent = 'Failed to load the image'
    })
}


function addNewSeries (e){
    e.preventDefault()

    if(validateInputs()){

        submitSeriesBtn.classList.add('loading')
        submitSeriesBtn.setAttribute('disabled', true)

        const newSeries = {
            title : titleInput.value.trim(),
            description : descriptionInput.value.trim(),
            imageUR : imageUrlInput.value.trim(),
            dateRelease : `${yearInput.value}/${monthInput.value}/${dayInput.value}`,
            rating : ratingInput.value,
            country : countryInput.value.trim(),
            producer : producerNameInput.value.trim(),
            videoPoster : videoPosterInput.value.trim(),
            isVisible : checkBox.checked,
            genres,
            casts,
            seasons : []
        }

        fetch(`https://muvi-86973-default-rtdb.asia-southeast1.firebasedatabase.app/series.json`, {
            method : 'POST',
            headers : {
                "Content-type" : 'Application/json'
            },
            body : JSON.stringify(newSeries)
        })
            .then(res => res.json())
            .then(message => {
                alert('Series added successfully :)')
                clearInputs()
                window.scrollTo({behavior : "smooth"})
                console.log(message);
            })
            .catch(err => {
                alert('Error, something went wrong. Please turn on your VPN and try again :)')
                console.log(err)
            })
            .finally(()=> {
                submitSeriesBtn.classList.remove('loading')
                submitSeriesBtn.removeAttribute('disabled')
            })
    }
}

function clearInputs () {
    $.querySelectorAll('input').forEach(input => input.value = '')
    $.querySelectorAll('.input span').forEach(span => span.remove())
    $.querySelectorAll('.form-input').forEach(elem => elem.classList.remove('invalid'))
    portraitImg.parentElement.classList.remove('loading')
    landscapeImg.parentElement.classList.remove('loading')
    genres = []
    casts = []
}

submitSeriesBtn.addEventListener('click', addNewSeries)
imageUrlInput.addEventListener('input', showImagePreviewHandler)

tagsInput.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        addInputTag(tagsInput, genres, 'genres')
    }
})

castsInput.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        e.preventDefault()
        addInputTag(castsInput, casts, 'casts')
    }
})
