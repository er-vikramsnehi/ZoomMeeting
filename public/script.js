
const socket = io('/');
const VideoGrid = document.getElementById('video-grid');


const myvideo = document.createElement('video');
myvideo.muted = true;

var peer =new Peer(undefined,{
    path: '/peerjs',
    host: '/',
    port: '3030'
});

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => {
   myVideoStream=stream;
   addVideoStream(myvideo, stream);

//     Answer user call

    peer.on('call',call => {
        call.answer(stream)
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected',(userId) => {
    connectToNewUser(userId, stream);
     })
})

peer.on('open', id=> {
    socket.emit('join-room', ROOM_ID, id);
})




const connectToNewUser = (userId,stream) =>{
    //Peer Connection
    const call = peer.call(userId,stream);
    const video = document.createElement('video');
    call.on('stream',userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
    console.log(userId);

}


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () =>{
        video.play();
    })
     VideoGrid.append(video);
}

let text = $('input');
console.log(text);

$('html').keydown((e) => {
    if(e.which == 13 && text.val().length !==0)
    {
        console.log(text.val());
        socket.emit('message',text.val());
        text.val('');
    }
});

socket.on('createMessage', message => {
    $('ul').append(`<li class="messages"><b>user: </b>${message}</li>`)
    console.log('this is comming from server', message);
})


const scrollToBottom = () =>{
    let d = $('.main_chat_window');
    d.scrollTop(d.prop("ScrollHeight"));
}


// Mute and Unmute

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;

    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}


const setMuteButton = () => {
    const html =`
    <i class="fa fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}

const setUnmuteButton =() => {
    const html =`
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}




const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;

    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }
    else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
} 






const setPlayVideo = () => {
    const html =`
    <i class="fa fa-play"></i>
    <span>Play</span>
    `
    document.querySelector('.main_video_button').innerHTML=html;
}

const setStopVideo =() => {
    const html =`
    <i class="unmute fas fa-stup"></i>
    <span>Stop</span>
    `
    document.querySelector('.main_video_button').innerHTML=html;
}

