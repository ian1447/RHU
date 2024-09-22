// import React, { useState } from "react";
// import { useHistory } from 'react-router-dom';
// import "./message.styles.css";
// import { FaArrowLeft } from "react-icons/fa";

// function MessageContent() {

//     const history = useHistory();

// 	const messages = [
// 		{ id: 1, text: "Hi there! How are you?", sender: "user" },
// 		{ id: 2, text: "I'm doing well, thanks! How about you?", sender: "other" },
// 		{
// 			id: 3,
// 			text: "I'm great, just working on a new project.",
// 			sender: "user",
// 		},
// 		{ id: 4, text: "Sounds exciting! Tell me more about it.", sender: "other" },
// 		{
// 			id: 5,
// 			text: "It's a React application that mimics a chat interface.",
// 			sender: "user",
// 		},
// 		{
// 			id: 6,
// 			text: "That's really cool! I can't wait to see it.",
// 			sender: "other",
// 		},
// 	];

// 	const [inputText, setInputText] = useState("");

// 	const sendMessage = () => {
// 		if (inputText.trim() === "") return;

// 		const newMessage = {
// 			id: messages.length + 1, // Assign a unique id to each new message
// 			text: inputText,
// 			sender: "user", // You can toggle this based on the current user
// 		};

// 		setMessages([...messages, newMessage]);
// 		setInputText(""); // Clear the input field
// 	};

// 	// Function to handle input change
// 	const handleInputChange = (event) => {
// 		setInputText(event.target.value);
// 	};

// 	// Function to handle pressing enter to send a message
// 	const handleKeyPress = (event) => {
// 		if (event.key === "Enter") {
// 			sendMessage();
// 		}
//     };
    
//     const hadleClick = () => {
//         history.push('/inbox');
//         };

// 	return (
//         <div className="container mt-4 mx-4 p-4">
//             <FaArrowLeft onClick={ hadleClick } className="back-button" />
// 			<div className="chat-container">
// 				{messages.map((message) => (
// 					<div
// 						key={message.id}
// 						className={`message-bubble ${
// 							message.sender === "user" ? "user-message" : "other-message"
// 						}`}
// 					>
// 						{message.text}
// 					</div>
// 				))}
// 			</div>
// 			<div className="input-container">
// 				<input
// 					type="text"
// 					className="message-input"
// 					placeholder="Type a message..."
// 					value={inputText}
// 					onChange={handleInputChange}
// 					onKeyPress={handleKeyPress}
// 				/>
// 				<button className="send-button" onClick={sendMessage}>
// 					Send
// 				</button>
// 			</div>
// 		</div>
// 	);
// }

// export default MessageContent;
