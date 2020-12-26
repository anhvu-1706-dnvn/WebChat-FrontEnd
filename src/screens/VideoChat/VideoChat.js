import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import io from 'socket.io-client'
import './VideoChat.css'
export default function VideoChat() {
  // const pc_config = null
  const history = useHistory();
  const location = useLocation();
  const pc_config = {
    "ice_servers": [
      {
        urls: 'stun:stun.l.google.com:19302'
      }
    ]
  }
  const localVideoRef = useRef();
  const remoteVideoRef = useRef()
  const [pc, setPc] = useState(new RTCPeerConnection(pc_config))
  const [socket, setSocket] = useState(() => io(`${process.env.REACT_APP_API_SOCKET}/webrtcPeer`));
  const id = location.state.conversationId
  // const [candidates, setCandidates] = useState([]);
  const sendToPeer = (messageType, payload) => {
    console.log(id);
    if (socket === null ) return;
    socket.emit(messageType, {
      conversationId: id,
      socketId: socket.id,
      payload,
    })
  }
  const createOffer = () => {
    console.log('Offer');
    pc.createOffer({offerToReceiveVideo: 1})
    .then(sdp => {
      pc.setLocalDescription(sdp)
      sendToPeer('offerOrAnswer', sdp);
    }, err => {})
  }
  const createAnswer = () => {
    console.log('Answer');
    pc.createAnswer({offerToReceiveVideo: 1})
    .then(sdp => {
      pc.setLocalDescription(sdp)
      sendToPeer('offerOrAnswer',sdp);
    }, err => {})
  }
  function goBack(localVideoRef) {
    const stream = localVideoRef.current.srcObject;
    const tracks = stream.getTracks();
  
    tracks.forEach(function(track) {
      track.stop();
    });
  
    localVideoRef.current.srcObject = null;
    history.goBack()
  }
  useEffect( () => {
    const id = location.state.conversationId;
    if (socket === null) return;
    socket.emit('join-room', {conversationId: id}) 
    const constraints = {
      video: true,
      audio: true,
      // audio: {'echoCancellation': true},
    }
    const success = (stream) => {
      window.localStream = stream
      localVideoRef.current.srcObject = stream
      pc.addStream(stream)
    }
    const failure = (e) => {
      console.log('getUserMediaError: ', e)
    }
    navigator.mediaDevices.getUserMedia(constraints) 
      .then(success)
      .catch(failure )
    // navigator.mediaDevices.getUserMedia(constraints) 
    //   .then({video:false, audio:false})
      
    return () => {
      socket.close();  
    }
  }, [])
  useEffect(() => {
    pc.onicecandidate = (e) => {
      if (e.candidate) { 
        console.log(123)
        // console.log(JSON.stringify(e.candidate))
      sendToPeer('candidate', e.candidate)
      }
    } 
    pc.oniceconnectionstatechange = (e) => {
      console.log(e)
      // remoteVideoRef.current.srcObject = '';
    }
    pc.ontrack = (e) => {
     remoteVideoRef.current.srcObject = e.streams[0]
    }
  
  }, [pc])
  useEffect(() => {
    if(socket === null) return;
    socket.on('connection-success', success => {
      console.log(success)
    })    
    socket.on('offerOrAnswer', (sdp) => {
      // textRef.current.value = JSON.stringify(sdp);
      pc.setRemoteDescription(new RTCSessionDescription(sdp))
    })
    socket.on('candidate', (candidate) => {
      //  console.log(candidate)
      // setCandidates(prev => [...prev, candidate]);
       pc.addIceCandidate(new RTCIceCandidate(candidate));
    })
  }, [socket])
  const RemoteVideo = () => (
    <video
    id = {"myVideo"}
    ref = {remoteVideoRef} 
    autoPlay controls="false"></video>
  )
  return (
   
    <div>
      <RemoteVideo />
  <div class="content">
        <video
        style={{
          width: 300, 
          height: 300,
        }}
        muted
        ref = {localVideoRef} 
        autoPlay  controls={false}>
        </video>
    <div id = {"buttonWrapper"}>
     <button id="myBtn"  onClick = {() => createOffer()}> Offer </button>
     <button id="myBtn" onClick = {() => createAnswer()}> Answer </button>
     <button id="myBtn" onClick = {() => goBack(localVideoRef)}> Back </button>
     </div>
  </div>
   </div>  
   )

}
