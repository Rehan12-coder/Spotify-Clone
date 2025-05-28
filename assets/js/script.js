let currentSong = new Audio();
let songs;
let currFolder;



async function getSongs(folder) {
    currFolder = folder;

    let a = await fetch(`http://127.0.0.1:3000/assets/${folder}/`, {
        mode: 'no-cors',
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
    })
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    console.log(as)
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }


    }


    // Show all the songs in the song list


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""; // Clear the existing list
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="assets/images/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Rehan Malik</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="assets/images/play.svg" alt="">
                            </div></li>`;

    }

    // Attach an event listener to each song
    const songListElement = document.querySelector(".songList");
    Array.from(songListElement.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });
    return songs;
}
const playmusic = (track, pause = false) => {
    currentSong.src = `/assets/${currFolder}/` + track;
    if (!pause) {
        currentSong.play()
        play.src = "assets/images/pause.svg";

    }
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ");
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
async function displayalbums() {
    let a = await fetch(`http://127.0.0.1:3000/assets/songs/`, {
        mode: 'no-cors',
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
    })
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    let folders = [];
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = (e.href.split("/").slice(-2)[0]);
            //Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/assets/songs/${folder}/info.json`, {
                mode: 'no-cors',
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
                        <div  class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42" width="42" height="42">
                                <circle cx="21" cy="21" r="21" fill="#1ed760" />
                                <g transform="translate(9 9)">
                                    <path
                                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                        fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
                                </g>
                            </svg>
                        </div>
                        <img src="assets/songs/${folder}/cover.jpg" alt="Happy Hits">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>

                    </div>`
        }
    }



    // load a playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playmusic (songs[0]) // Play the first song by default

        });
    });
}
    async function main() {
        // get the list of songs from the server
        await getSongs("songs/cs");
        playmusic(songs[0], true); // Play the first song by default
        //Display all the albums on the page
        displayalbums();
    
    
    
        // Attach an event listener to the play next and previous buttons
        play.addEventListener("click", () => {
            if (currentSong.paused) {
                currentSong.play();
                play.src = "assets/images/pause.svg";
            } else {
                currentSong.pause();
                play.src = "assets/images/play.svg";
            }
        });
        // listen for time update event to update the song time
        currentSong.addEventListener("timeupdate", () => {
            let currentTime = Math.floor(currentSong.currentTime);
            let duration = Math.floor(currentSong.duration);
    
            if (isNaN(currentTime) || isNaN(duration)) {
                document.querySelector(".songtime").innerHTML = "invalid input";
                return;
            }
    
            let currentMin = Math.floor(currentTime / 60);
            let currentSec = currentTime % 60;
            let durationMin = Math.floor(duration / 60);
            let durationSec = duration % 60;
    
            document.querySelector(".songtime").innerHTML = `${currentMin.toString().padStart(2, '0')}:${currentSec.toString().padStart(2, '0')} / ${durationMin.toString().padStart(2, '0')}:${durationSec.toString().padStart(2, '0')}`;
            document.querySelector(".circle").style.left = `${(currentTime / duration) * 100}%`;
        });
        // Add  an event listener to the seek bar to seek the song
        document.querySelector(".seekbar").addEventListener("click", (e) => {
            let seekBar = document.querySelector(".seekbar");
            let rect = seekBar.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let width = rect.width;
            let percentage = x / width;
            currentSong.currentTime = percentage * currentSong.duration;
        });
        // Add an event listener to the hamburger menu to toggle the song list
        document.querySelector(".hamburger").addEventListener("click", () => {
            document.querySelector(".left").style.left = "0px";
        });
        // Add an event listener to the close button to close the song list
        document.querySelector(".close").addEventListener("click", () => {
            document.querySelector(".left").style.left = "-110%";
        });
        //Add an event listener to the previous button
        previous.addEventListener("click", () => {
            console.log("Previous button clicked");
            let index = songs.indexOf(currentSong.src.split("/songs/").slice(-1)[0]);
            if ((index - 1) >= 0) {
                playmusic(songs[index - 1]);
            }
    
        });
        //Add an event listener to the next button
        next.addEventListener("click", () => {
            console.log("Next button clicked");
            let index = songs.indexOf(currentSong.src.split(`/songs/`).slice(-1)[0]);
            if ((index + 1) < songs.length) {
                playmusic(songs[index + 1]);
    
            }
    
        });
        // Add an event listener to the volume slider to change the volume
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
            currentSong.volume = parseInt(e.target.value) / 100;
            console.log("setting volume to " + e.target.value + " / 100");
        });
        // Add an event listener to the mute button to toggle the mute state
        document.querySelector(".volume>img").addEventListener("click", (e) => {
            if(e.target.src.includes("volume.svg")) {
                e.target.src = e.target.src.replace("volume.svg" , ("mute.svg"));
                currentSong.volume = 0;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            }
            else{
               e.target.src = e.target.src.replace(("mute.svg") , "volume.svg" );
                currentSong.volume = .10;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
            }
    
        });
    
    }
    
    main();