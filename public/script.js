const socket = io('/')
const vgrid=document.getElementById('vgrid')
const p=new Peer(undefined,{
    host:'/',
    port:'3001'
})
const peers={}
const myvideo=document.createElement('video')
myvideo.muted=true

navigator.mediaDevices.getUserMedia({
    audio:true,
    video:true
}).then(stream=>{
    addVideoStream(myvideo,stream)
    p.on('call',call=>{
        call.answer(stream)
        const video=document.createElement('video')
        call.on('stream',uservideostream=>{
            addVideoStream(video,uservideostream)
        })
    })
    socket.on('user-connected',uid=>{
        connectNewUser(uid,stream)
    })
})
.catch(er=>{
    console.log(er)
})

socket.on('user-disconnected',uid=>{
    if(peers[uid])
        peers[uid].close()
})

p.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id)
})

function connectNewUser(uid,stream)
{
    const call=p.call(uid,stream)
    const video=document.createElement('video')
    call.on('stream',(uservideostream)=>{
        addVideoStream(video,uservideostream)
    })
    call.on('close',()=>{
        video.remove()
    })
    peers[uid]=call
}

function addVideoStream(video, stream)
{
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    vgrid.append(video)
}