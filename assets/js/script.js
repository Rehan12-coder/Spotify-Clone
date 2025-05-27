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
            songs.push(element.href);
        }
    
        
    }
    return(songs);
}

async function main(){
    // get the list of songs from the server
    let songs =await getSongs()
    console.log(songs)

    //Play the first song
    if (songs.length > 0) {
        var audio = new Audio(songs[0]);
        audio.play();
    } else {
        console.log("No songs found to play.");
    }
}
main();