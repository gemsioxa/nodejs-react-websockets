import React, { FormEvent, useEffect, useState } from 'react';
import { IMessageData } from '../../pages/mainPage';
import './style.css';
import { wsSendChat, wsSendCommand } from '../../utils/websocket-connection';

interface IProps {
    user: IMessageData,
    messages: Array<{ author: string, message: string }>
}

const UserContainer = ({ user, messages }: IProps) => {
    const [command, setCommand] = useState('');

    useEffect(() => {
        console.log(messages);
    }, [messages]);

    const handleSubmit = (e: FormEvent) => {
        if (!command) {
            return;
        }

        const data = {
            author: user.name,
            message: command
        }
    
        wsSendChat(data);
        wsSendCommand(command)
        setCommand('');
        e.preventDefault();
    }

    return (
        <div className={'user-container'}>
            <h3>Logged In</h3>
            <p>Username: {user.name.toUpperCase()}</p>
            <p>Hash username: {user.hashName}</p>
            <p>Hash password: {user.password}</p>

            <form className={'input-container__form'} onSubmit={handleSubmit}>
                <input 
                    onChange={(e) => setCommand(e.currentTarget.value)}
                    value={command}
                    type={'text'} 
                    className={'user-container__form-input'}
                />
                <button type={'submit'} className={'input-container__form-button'}>Send</button>
            </form>

            <div className={'user-container__chat'}>
                {messages.length ? 
                    messages.map((message, index) => (
                        <div key={index} className={'user-container__chat__message'}>
                            <p>Author: {message.author}</p>
                            <p>Message: {message.message}</p>
                        </div>
                    ))
                : (
                    <div className={'user-container__chat__message'}>
                        <p>No messages</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserContainer;