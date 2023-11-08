import React, { useEffect, useState } from 'react';
import './style.css';
import InputContainer from '../../components/inputContainer';
import Status from '../../components/status';
import { ws, wsSendPing } from '../../utils/websocket-connection';
import UserContainer from '../../components/userContainer';

export interface IMessageData {
    name: string,
    hashName: string,
    password: string
}

const MainPage = () => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [data, setData] = useState<IMessageData | null>(null);
    const [messages, setMessages] = useState<Array<{ author: string, message: string }>>([]);

    useEffect(() => {
        ws.addEventListener('message', (e) => {
            const data = JSON.parse(e.data);
            switch (data.action) {
                case 'AUTH':
                    setData(data.message);
                    setMessages(data.messages);
                    setIsAuth(true);
                    setIsActive(true);
                    break;
                case 'INFO':
                    console.log(data.message.description);
                    setIsActive(true);
                    break;
                case 'PING': 
                    console.log(data.message.description);
                    break;
                case 'COMMAND':
                    console.log(data.message.command);
                    break;
                case 'CHAT':
                    setMessages(data.messages);
                    break;
                default:
                    console.log(e.data);
                    break;
            }
        });

        ws.addEventListener('close', () => {
            console.log('Connection closed');
            setIsAuth(false);
            setData(null);
            setIsActive(false);
            setMessages([]);
        });
    }, []);

    return (
        <div className={'main-page'}>
            <div className={'main-page__header'}>
                <div className={'main-page__header-title'}>
                    WebSockets
                </div>
                <div className={'main-page__header-status'}>
                    <Status isActive={isActive} />
                </div>
            </div>
            <div className={'main-page__content'}>
                {isAuth && data ? (
                    <UserContainer user={data} messages={messages} />
                ) : (
                    <>
                        <InputContainer />
                        <button className={'main-page__content-button'} onClick={() => wsSendPing()}>
                            Ping
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MainPage;