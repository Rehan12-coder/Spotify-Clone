let currentSong = new Audio();
let songs;


async function getSongs() {


    let a = await fetch("http://127.0.0.1:3000/assets/songs/", {
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
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }


    }
    return (songs);
}
const playmusic = (track, pause = false) => {
    // let audio = new Audio("/assets/songs/" + track);
    currentSong.src = "/assets/songs/" + track;
    if (!pause) {
        currentSong.play()
        play.src = "assets/images/pause.svg";

    }
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ");
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
    // get the list of songs from the server
    songs = await getSongs()
    playmusic(songs[0], true); // Play the first song by default
    // Show all the songs in the song list


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
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
        let index = songs.indexOf(currentSong.src.split("/songs/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1]);

        }

    });
    // Add an event listener to the volume slider to change the volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        console.log("setting volume to " + e.target.value + " / 100");
    });

}

main();