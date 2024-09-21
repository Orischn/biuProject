import MyMessage from "../myMessage/MyMessage";


function SendResult({ messages }) {

  if (!messages) {
    return null; // or you can return a loading state or an empty message list
  }

  const messageList = messages.map((message, key) => {
    return <MyMessage content={message} key={key} />;
  });

    return (
        <ul className="list-group">
            {messageList}
        </ul> //Maybe without ul
    );
}

export default SendResult;