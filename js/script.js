console.log("Let's write Javascript!")
let currentSong = new Audio();
let songs;
let currFolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".m4a")) {
            let decoded = decodeURIComponent(element.getAttribute("href"))
            songs.push(decoded.split("\\").pop())
        }
    }


    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        
        <li>
                                <img class="invert" src="imgs/music.svg" alt="">
                                <div class="info">
                                    <div>${song.replace(/%5C|%20-%20/g, "")}</div>
                                    <div>Hemantsinh</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="imgs/play.svg" alt="">
                                </div> </li> `;
    }

    // Attach an eventlister to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return songs
}

const playMusic = (track, pause = false) => {

    currentSong.src = `${currFolder}/${track}`

    if (!pause) {
        currentSong.play()
        play.src = "imgs/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

async function main() {


    // Get the list of all the songs
    await getSongs("songs/cs")
    playMusic(songs[0], true)


    // Display all the albums on the page
    async function displayAlbums() {
        let a = await fetch(`http://127.0.0.1:3000/songs/`)
        let response = await a.text()
        let div = document.createElement("div")
        div.innerHTML = response;
        let anchors = div.getElementsByTagName("a")
        let cardContainer = document.querySelector(".cardContainer")
        let array = Array.from(anchors)
            for (let index = 0; index < array.length; index++) {
                const e = array[index];
            if(e.href.includes("\songs")){
                 let folder = (e.href.split("/").slice(-2)[0])
                // Get the metadata of the folder
                let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
                let response = await a.json();
                console.log(response)
                cardContainer.innerHTML = cardContainer.innerHTML + `  <div data-folder="${folder}" class="card">
                        <div class="playbtn">
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                           xmlns="https://www.w3.org/2000/svg">
                           <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-line-join="round"/>

                           </svg>
                        </div>
                        <img aria-hidden="false" draggable="false" loading="lazy"
                            src="/${folder}/cover.jpg"
                            data-testid="card-image" alt=""
                            class="LBM25IAoFtd0wh7k3EGM Z3N2sU3PRuY4NgvdEz55 PgTMmU2Gn7AESFMYhw4i">
                        <h2>${response.title}</h2>
                        <p>${response.Description}</p>
                    </div>`
            }
          }

        
    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset.folder)
            songs = await getSongs(`/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
    }
    displayAlbums()
    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "imgs/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "imgs/play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime) / (currentSong.duration) * 100 + "%"
    })


    // Add an eventlistner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })


    // Add an eventlister for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })


    // Add an eventlistener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an eventlistener to privous
    previous.addEventListener("click", () => {
        console.log('previous clicked')
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })
    // Add an eventlistener to next
    next.addEventListener("click", () => {
        console.log('next clicked')
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })


    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{
        console.log(e.target)
        if(e.target.src.includes("volume.svg")){
          e.target.src =  e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
           e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })


}

main()
