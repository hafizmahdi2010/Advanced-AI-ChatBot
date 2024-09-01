import React, { useState } from 'react'
import "./App.css"
import { IoCodeSlash, IoSend } from 'react-icons/io5'
import { BiPlanet } from 'react-icons/bi'
import { FaPython } from 'react-icons/fa'
import { TbMessageChatbot } from 'react-icons/tb'
import { GoogleGenerativeAI } from "@google/generative-ai";
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const App = () => {
  const [message, setMessage] = useState("");
  const [isResponseScreen, setisResponseScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  let allMessages = [];

  const hitRequest = () => {
    if (message) {
      generateResponse(message);
    }
    else {
      alert("You must write somthing... !")
    }
  };


  const generateResponse = async (msg) => {
    if (!msg) return;

    const genAI = new GoogleGenerativeAI("AIzaSyC8eLYUkIxQUT6_ghrwOi7whE0t1eLvvIU");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(msg);

    const newMessages = [
      ...messages,
      { type: "userMsg", text: msg },
      { type: "responseMsg", text: result.response.text() },
    ];

    setMessages(newMessages); // Append new messages to the existing ones
    setisResponseScreen(true);
    setMessage(""); // Clear the input field after sending the message
    console.log(result.response.text());
  };

  const newChat = () => {
    setisResponseScreen(false);
    setMessages([]); // Clear the messages array
  };

  const checkEnterPress = (e) => {
    if (e.key === "Enter") {
      hitRequest()
    };
  };

  const formatText = (text) => {
    // Regular expressions for formatting
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const boldTextRegex = /\*\*(.*?)\*\*/g;
    const badgeRegex = /`([^`]*)`/g;
    const listItemRegex = /(?:^|\n)\d+\. (.+?)(?=\n\d+\.|\n|$)/g;
    const subListItemRegex = /(?:^|\n)\- (.+?)(?=\n\d+\.|\n|$)/g;
    const lineBreakRegex = /\n/g;
    const dotRegex = /(?:^|\n)- ``:(.+?)(?=\n\d+\.|\n|$)/g; // Updated regex for dot transformation
  
    // Replace code blocks with placeholders
    const codeBlocks = [];
    let formattedText = text.replace(codeBlockRegex, (match, lang, code) => {
      codeBlocks.push({ lang, code });
      return `[code block ${codeBlocks.length - 1}]`;
    });
  
    // Replace badges, bold text, and line breaks
    formattedText = formattedText
      .replace(badgeRegex, '<span class="badge">`$1`</span>') // Replace badges
      .replace(boldTextRegex, '<strong>$1</strong>') // Replace bold text
      .replace(lineBreakRegex, '<br />') // Replace new lines with <br />
      .replace(dotRegex, '&#x2022; $1'); // Replace dot pattern
  
    // Replace numbered and bulleted list items
    formattedText = formattedText
      .replace(listItemRegex, (match, p1) => `<ol><li>${p1}</li></ol>`)
      .replace(subListItemRegex, (match, p1) => `<ul><li>${p1}</li></ul>`);
  
    // Handle nested lists by ensuring proper list wrapping
    formattedText = formattedText
      .replace(/<\/ol>\s*<\/ul>/g, '</ul></ol>') // Close nested lists properly
      .replace(/<\/ul>\s*<\/ol>/g, '</ol></ul>'); // Handle list closing order
  
    // Wrap list items in <ul> tags for proper formatting
    formattedText = formattedText.replace(/(<ol><li>.*?<\/li><\/ol>)/g, '<div>$1</div>');
    formattedText = formattedText.replace(/(<ul><li>.*?<\/li><\/ul>)/g, '<div>$1</div>');
  
    return { formattedText, codeBlocks };
  };
  
  


  return (
    <>
      <div className="container w-screen min-h-screen overflow-x-hidden bg-[#0E0E0E] text-white">
        {
          isResponseScreen ?
            <div className='h-[80vh] pb-4 overflow-y-auto overflow-x-hidden'>
              <div className="header pt-[25px] flex items-center justify-between w-[100vw] px-[300px]">
                <h2 className='text-2xl'>AssistMe</h2>
                <button id='newChatBtn' className='bg-[#181818] p-[10px] rounded-[30px] cursor-pointer text-[14px] px-[20px]' onClick={newChat}>New Chat</button>
              </div>
              <div className="messages">
      {messages?.map((msg, index) => {
        // Format the text and extract code blocks
        const { formattedText, codeBlocks } = formatText(msg.text);

        // Split the message by code block placeholders to handle text and code blocks separately
        const textParts = formattedText.split(/\[code block \d+\]/g);

        return (
          <div key={index} className={msg.type}>
            {/* Iterate through text parts to render text and code blocks */}
            {textParts.map((part, partIndex) => (
              <React.Fragment key={partIndex}>
                {/* Render the formatted text with HTML tags */}
                <div dangerouslySetInnerHTML={{ __html: part }} />

                {/* Display the corresponding code block if one exists */}
                {codeBlocks[partIndex] && (
                  <SyntaxHighlighter className="mt-3 h-auto" language={codeBlocks[partIndex].lang || 'plaintext'} style={vs2015}>
                    {codeBlocks[partIndex].code}
                  </SyntaxHighlighter>
                )}
              </React.Fragment>
            ))}
          </div>
        );
      })}
    </div>


            </div> :
            <div className="middle h-[80vh] flex items-center flex-col justify-center">
              <h1 className='text-4xl'>AssistMe</h1>
              <div className="boxes mt-[30px] flex items-center gap-2">
                <div className="card rounded-lg cursor-pointer transition-all hover:bg-[#201f1f] px-[20px] relative min-h-[20vh] bg-[#181818] p-[10px]">
                  <p className='text-[18px]'>What is coding ? <br />
                    How we can learn it.</p>

                  <i className=' absolute right-3 bottom-3 text-[18px]'><IoCodeSlash /></i>
                </div>
                <div className="card rounded-lg cursor-pointer transition-all hover:bg-[#201f1f] px-[20px] relative min-h-[20vh] bg-[#181818] p-[10px]">
                  <p className='text-[18px]'>Which is the red <br />
                    planet of solar <br />
                    system </p>

                  <i className=' absolute right-3 bottom-3 text-[18px]'><BiPlanet /></i>
                </div>

                <div className="card rounded-lg cursor-pointer transition-all hover:bg-[#201f1f] px-[20px] relative min-h-[20vh] bg-[#181818] p-[10px]">
                  <p className='text-[18px]'>In which year python <br />
                    was invented ?</p>

                  <i className=' absolute right-3 bottom-3 text-[18px]'><FaPython /></i>
                </div>

                <div className="card rounded-lg cursor-pointer transition-all hover:bg-[#201f1f] px-[20px] relative min-h-[20vh] bg-[#181818] p-[10px]">
                  <p className='text-[18px]'>How we can use <br />
                    the AI for adopt ?</p>

                  <i className=' absolute right-3 bottom-3 text-[18px]'><TbMessageChatbot /></i>
                </div>
              </div>
            </div>
        }

        {/* <SyntaxHighlighter language="javascript" style={vs2015}>
          {`const app = () => {
        return (
          <h1>Hello World 👋</h1>
        )
      };`}
        </SyntaxHighlighter> */}

        <div className="bottom w-[100%] flex flex-col items-center">
          <div className="inputBox w-[60%] text-[15px] py-[7px] flex items-center bg-[#181818] rounded-[30px]">
            <input onKeyUp={checkEnterPress} value={message} onChange={(e) => { setMessage(e.target.value) }} type="text" className='p-[10px] pl-[15px] bg-transparent flex-1 outline-none border-none' placeholder='Write your message here...' id='messageBox' />
            {
              message == "" ? "" : <i className='text-green-500 text-[20px] mr-5 cursor-pointer' onClick={hitRequest}><IoSend /></i>
            }
          </div>
          <p className='text-[gray] text-[14px] my-4'>AssistMe is developed by Mo. Mahdi Farooqui. this AI use the gemini API for giving the response  </p>
        </div>
      </div>
    </>
  )
}

export default App