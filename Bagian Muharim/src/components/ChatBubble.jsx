import React from "react";

const ChatBubble = ({ message, role }) => {
  return (
    <div
      className={`w-full flex ${
        role == "AI" ? "justify-start" : "justify-end"
      }`}
    >
      <div className="p-4 rounded-lg bg-white w-fit max-w-[80%]">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ChatBubble;
