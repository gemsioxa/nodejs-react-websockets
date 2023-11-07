import React, { FormEvent, useState } from 'react';
import { IMessageData } from '../../pages/mainPage';
import './style.css';
import { wsSendCommand } from '../../utils/websocket-connection';

interface IProps {
    user: IMessageData
}

const UserContainer = ({ user }: IProps) => {
    const [command, setCommand] = useState('');

    const handleSubmit = (e: FormEvent) => {
        if (!command) {
            return;
        }

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
        </div>
    );
};

export default UserContainer;