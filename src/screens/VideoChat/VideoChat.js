import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import io from 'socket.io-client'
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
  const textRef = useRef()
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
  // const addCandidate = () => {
  //   candidates.forEach(candidate => {
  //     console.log(JSON.stringify(candidate));
  //     pc.addIceCandidate(new RTCIceCandidate(candidate));
  //   })
  // }
  // const setRemoteDescription = () => {
  //   const desc = JSON.parse(textRef.current.value);
  //   pc.setRemoteDescription(new RTCSessionDescription(desc))
  // }
  useEffect( () => {
    const id = location.state.conversationId;
    if (socket === null) return;
    socket.emit('join-room', {conversationId: id}) 
    const constraints = {
      video: true,
      audio: true,
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
    // console.log(pc)
    
    return () => socket.close();
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
      textRef.current.value = JSON.stringify(sdp);
      pc.setRemoteDescription(new RTCSessionDescription(sdp))
    })
    socket.on('candidate', (candidate) => {
       console.log(candidate)
      // setCandidates(prev => [...prev, candidate]);
      pc.addIceCandidate(new RTCIceCandidate(candidate));
    })
  }, [socket])
  return (
    <div>
      <video
      style = {{
        width: 240,
        height: 240,
        margin: 5,
        backgroundColor: 'black'
      }} 
      ref = {localVideoRef} 
      autoPlay></video>
      <video
      style = {{
        width: 240,
        height: 240,
        margin: 5,
        backgroundColor: 'black'
      }} 
      ref = {remoteVideoRef} 
      autoPlay></video>
      <br />
    <button onClick = {() => createOffer()}> Offer </button>
    <button onClick = {() => createAnswer()}> Answer </button>
    <br />
    <textarea ref = {ref => textRef.current = ref} />
    <br />
   
    </div>
  )
}
