import { ref, storage, uploadBytesResumable} from './Firebase.js'
import { videoUploadsWrapper, subtitleUploadsWrapper } from './domElements.js'

const $ = document

// upload the files using firebase 
export function uploadData (fileArray, isVideoFile, fileIndex = 0){

    return new Promise((resolve, reject) => {

        let progressElem
        let fileProperty
        let uploadCounter
        let errorMessage
        let successMessage

        // check if the fileArray is an array of videos or subtitles
        if(isVideoFile){
            progressElem = $.getElementById(`videoFile${fileIndex}`)
            fileProperty = 'quality'
            uploadCounter = uploadedVideosCounter
            errorMessage = 'In order to add a new episode, you need to upload at least 1 video. \n Please try again.'
            successMessage = `${uploadedVideosCounter} videos uploaded out of ${fileArray.length}`
        }else{
            progressElem = $.getElementById(`subtitleFile${fileIndex}`)
            fileProperty = 'label'
            uploadCounter = uploadedSubtitlesCounter
            errorMessage = `${uploadedVideosCounter} videos have uploaded successfully but failed to upload your subtitles. the operation will continue. you can upload your subtitles later from 'Edit episode' section :)`
            successMessage = `${uploadedSubtitlesCounter} subtitles uploaded out of ${fileArray.length}`
        }


        // checks if any files left to upload
        if(fileIndex > fileArray.length - 1){
            // resolve true if at least one file is uploaded
            uploadCounter ? resolve(successMessage) : reject(errorMessage)
            uploadedVideosCounter = 0
            uploadedSubtitlesCounter = 0
            return
        }

        const file = fileArray[fileIndex].file
        const fileName = fileArray[fileIndex].name
        const fileType = fileArray[fileIndex].type
        const fileProp = fileArray[fileIndex][fileProperty]
    
        // changing the file name to a correct format for storage
        const fileRef = `episode${currentEpisodeNumber} - ${fileProp}.${fileType}`
        const mainRef = ref(storage, `${folderRef}/${fileRef}`)
    
        // using firebase uploadBytesResumable method to upload the file 
        const uploadTask = uploadBytesResumable(mainRef, file)
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
                const tryAgain = confirm(`Failed to upload ${fileName}. Do you want to to try again ? \n if you click 'Cancel',this file will remove from the list and next file will upload`)

                if(tryAgain){
                    uploadData(fileArray, isVideoFile, fileIndex).then(resolve).catch(reject)
                }else{
                    uploadTask.cancel()
                    removeUploadElems(progressElem)
                    uploadData(fileArray, isVideoFile, fileIndex + 1).then(resolve).catch(reject)
                }
            }
        },
        () => { // on successful upload
            progressElem.className = 'progress done'
            isVideoFile ? uploadedVideosCounter++ : uploadedSubtitlesCounter++ 
            uploadData(fileArray, isVideoFile, fileIndex + 1).then(resolve).catch(reject)
            console.log(`${fileName} uploaded successfully`);
        })
    
    
        progressElem.querySelector('#cancelBtn').onclick = event => {
            const shouldRemove = confirm('Are you sure you want to cancel this upload ?')
            if(shouldRemove){
                uploadTask.cancel()
                removeUploadElems(event.target)
        
                // if upload canceled, upload the next file
                uploadData(fileArray, isVideoFile, fileIndex + 1).then(resolve).catch(reject)
            }
        }
    
        //change play or pause state
        progressElem.querySelector('#playOrPauseBtn').onclick =  () => {
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
        }

    })

}

export function showUploadElems (arr, isVideoElem) {
    document.body.classList.add('uploading')
    videoUploadsWrapper.scrollIntoView({behavior : 'smooth'})
    const containerElem = isVideoElem ? videoUploadsWrapper : subtitleUploadsWrapper

    containerElem.innerHTML = ''
    const uploadingElements = arr.map((item, index) => {
        return `
            <div class="progress ${index || !isVideoElem ? 'queued' : 'uploading'}" id="${isVideoElem ? 'video' : 'subtitle'}File${index}">
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
export function removeUploadElems(elemToRemove) {

    // loops trough all parent elements until it reaches the main element with 'progress' class
    while(!elemToRemove.classList.contains('progress')){
        elemToRemove = elemToRemove.parentElement
    }

    elemToRemove.remove()
}