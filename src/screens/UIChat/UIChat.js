import { Button } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCallback, useEffect, useState } from 'react';
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
  // const users = useSelector(state => state.user.users);
  const conversations = useSelector(state => state.conversation.conversation)
  // const loading = useSelector(state => state.conversation.loading)
  const [loading, setLoading] = useState(true)
  const listConversationSuccess = useSelector(state => state.conversation.listConversationSuccess);
  const token = localStorage.getItem('token');
  const [isActive, setIsActive] = useState(0);
  const [message, setMessage] = useState([]);
  const [text, setText] = useState('');
  const [socket,setSocket ] = useState(null);
  const [conversationId, setConversationId] = useState();
  const [newContact, setNewContact] = useState('')
  const [localConversation, setLocalConversation] = useState([]);
  const setRef = useCallback(node => {
    if (node) node.scrollIntoView({smooth: true})
  },[])
  
  useEffect( () => {
    const newSocket = io(`${process.env.REACT_APP_API_SOCKET}/chat`)
    setSocket(newSocket);
    dispatch(getListUserExceptMe(token))
    dispatch(getConversation(token))

    return () => newSocket.close();
  }, [dispatch])
 
  const updateMessage = () => {
    if(socket === null) return;
    socket.on('receiveMsg', data => {
      const arr = [...localConversation];
      setMessage(prevMessage => [
        ...prevMessage,
        {conversationId: data.conversationId, 
        text: data.text, 
        name: data.name}
      ])
      arr.map(a => {
        if (a.lastMessage.conversationId === data.conversationId) {
          a.lastMessage.text = data.text;
        }
        return a;
      })
      setLocalConversation([...arr]);   
    })
  }
  useEffect(() => {
    updateMessage();
  }, [socket, setMessage, setLocalConversation])
  
  useEffect(async() => {
    if(listConversationSuccess) {
      await showConversation(conversations[0]._id)
    } 
   else return;
  }, [listConversationSuccess])
  
  useEffect(() => {
    if (listConversationSuccess) {
      setLocalConversation([...conversations])
      setLoading(false);
    }
  }, [listConversationSuccess,setLocalConversation])
 
  const handleClick = () => {
    dispatch(Logout(history));
  }
  const handleHover = (index) => {
    setIsActive(index);
    // console.log(localConversation)
  }
  const sendMessage = (text) => {
    if (socket === null || text === '') return;
    const arr = [...localConversation];
    setMessage([
      ...message,
      {conversationId: conversationId, text, name }
    ])
    arr.map(a => {
      if (a.lastMessage.conversationId === conversationId) {
        a.lastMessage.text = text;
      }
      return a;
    })
    setLocalConversation([...arr]);
    socket.emit('send-message',{conversationId: conversationId, text, token, name })
    setText('');
    // setLastMessages(text);
  }
  const showConversation = async (id) => {
    if (socket === null) return;
    setMessage([]);
    const headers = {
      'Content-Type': 'application/json',
      'conversationId': id,
    }
    const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/conversation/message`, {headers});
    setMessage(res.data.arrayMes);
    socket.emit('join-room', {conversationId: id})
    setConversationId(id);
    //console.log(res)
  }
  const addContact = async () => {
    console.log(newContact);
    const dataPost = {
      recipientName: newContact,
      text: 'Hello there'
    }
    const headers = {
        'Content-Type': 'application/json',
        token: token,
    };
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/conversation`, dataPost, {headers});
     // console.log(res);
      dispatch(getConversation(token))
    } catch (err) {
      console.error(err);
    } 
    
    }
  
  return !loading ?  (
     <div className="container">
<h3 className=" text-center">Messaging</h3>
<div className="messaging">
      <div className="inbox_msg">
        <div className="inbox_people">
          <div className="headind_srch">
            <div className="recent_heading" onClick={() => addContact()}>
              <h4>Add Contact</h4>
            </div>
            <div className="srch_bar">
              <div className="stylish-input-group">
                <input type="text" className="search-bar"  placeholder="Input name " onChange = {(e) => setNewContact(e.target.value)}/>
                <span className="input-group-addon">
                <button type="button"> <i className="fa fa-search" aria-hidden="true"></i> </button>
                </span> </div>
            </div>
          </div>
          <div className="inbox_chat">
             { localConversation.map((conversation,index) => 
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
            {message.map((mes,index) => {
              const lastMessage = message.length - 1 === index;
              if(mes.name === name) return (
                <div className="outgoing_msg" ref={lastMessage ? setRef : null} key = {index}>
              <div className="sent_msg">
              <p>{mes.text}</p>
              <span className="time_date"> {mes.name}</span></div>
            </div>
              )
              else return (
                <div className="incoming_msg"ref={lastMessage ? setRef : null}>
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
              <button onClick = {(e)=> sendMessage(text)} className="msg_send_btn" type="button"><i className="fas fa-paper-plane" aria-hidden="true"></i></button>
              <button onClick={() => history.push({pathname: '/video', state: {conversationId}})}  className="msg_send_btn1" type="button"><i className="fas fa-video" aria-hidden="true"></i></button>
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
