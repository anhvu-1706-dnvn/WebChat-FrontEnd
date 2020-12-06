import { Button } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from "axios"
import { Logout } from 'redux/auth/actions';
import { getConversation } from 'redux/conversation/actions';
import { getListUserExceptMe } from 'redux/user/actions';
import io from 'socket.io-client';
import './UIChat.css'
function UIChat() {
  const name = localStorage.getItem('name')
  const dispatch = useDispatch();
  const history = useHistory();
  const users = useSelector(state => state.user.users);
  const conversations = useSelector(state => state.conversation.conversation)
  const loading = useSelector(state => state.conversation.loading)
  const listConversationSuccess = useSelector(state => state.conversation.listConversationSuccess);
  const token = localStorage.getItem('token');
  const [isActive, setIsActive] = useState(0);
  const [message, setMessage] = useState([]);
  const [text, setText] = useState('');
  const [socket,setSocket ] = useState(null);
  const [conversationId, setConversationId] = useState();
  useEffect( () => {
    const newSocket = io(process.env.REACT_APP_API_SOCKET)
    setSocket(newSocket);
    dispatch(getListUserExceptMe(token))
    dispatch(getConversation(token))
    return () => newSocket.close();
  }, [])
  const updateMessage = () => {
    if(socket === null) return;
    console.log('mess: ',message);
    socket.on('receiveMsg', data => {
      console.log('data',data)
      setMessage(prevMessage => [
        ...prevMessage,
        {conversationId: data.conversationId, 
        text: data.text, 
        name: data.name}
      ])
    })
  }
  useEffect(() => {
    updateMessage();
  }, [socket, setMessage])
  useEffect(async() => {
    if(listConversationSuccess) {
      await showConversation(conversations[0]._id)
    } 
   else return;
  }, [listConversationSuccess])
  const handleClick = () => {
    dispatch(Logout(history));
  }
  const handleHover = (index) => {
    setIsActive(index);
  }
  const sendMessage = (text) => {
    setMessage([
      ...message,
      {conversationId: conversationId, text, name }
    ])
    socket.emit('send-message',{conversationId: conversationId, text, token })
    setText('');
  }
  const showConversation = async (id) => {
    setMessage([]);
    const headers = {
      'Content-Type': 'application/json',
      'conversationId': id,
    }
    const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/conversation/message`, {headers});
    console.log(res.data);
    setMessage(res.data.arrayMes);
    socket.emit('join-room', {conversationId: id})
    setConversationId(id);
    //console.log(res)
  }
  return !loading ?  (
     <div className="container">
<h3 className=" text-center">Messaging</h3>
<div className="messaging">
      <div className="inbox_msg">
        <div className="inbox_people">
          <div className="headind_srch">
            <div className="recent_heading">
              <h4>Add Contact</h4>
            </div>
            <div className="srch_bar">
              <div className="stylish-input-group">
                <input type="text" className="search-bar"  placeholder="Search" />
                <span className="input-group-addon">
                <button type="button"> <i className="fa fa-search" aria-hidden="true"></i> </button>
                </span> </div>
            </div>
          </div>
          <div className="inbox_chat">
             { conversations.map((conversation,index) => 
                 {
                   return (
                <div 
                  key={index} 
                  className={isActive === index ? "chat_list active_chat": "chat_list"} 
                   onClick={()=> showConversation(conversation._id)} 
                  onMouseOver={() => handleHover(index)}
                >
                  <div className="chat_people">
                    <div className="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> </div>
                    <div className="chat_ib">
                      <h5>{conversation.participants.find(p => p.name !== name).name} <span className="chat_date">Dec 25</span></h5>
                   <p>{conversation.lastMessage.text}</p>
                    </div>
                  </div>
                </div>
              )})}
            {/* })} */}
          </div>
        </div>
        <div className="mesgs">
          <div className="msg_history">
            {message.map(mes => {
              if(mes.name === name) return (
                <div className="outgoing_msg">
              <div className="sent_msg">
              <p>{mes.text}</p>
              <span className="time_date"> {mes.name}</span></div>
            </div>
              )
              else return (
                <div className="incoming_msg">
                <div className="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> </div>
                <div className="received_msg">
                  <div className="received_withd_msg">
              <p>{mes.text}</p>
                    <span className="time_date"> {mes.name}</span></div>
                </div>
              </div>
              )
            })}
           
          </div>
          <div className="type_msg">
            <div className="input_msg_write">
              <input type="text" className="write_msg" placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)}/>
              <button onClick = {(e)=> sendMessage(text)} className="msg_send_btn" type="button"><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="button">

      <button type="button" className="btn btn-secondary btn-lg" onClick={() => handleClick()}>Logout</button>
      </div>
      
    </div></div>
   
  ) : null
  }

export default UIChat;
