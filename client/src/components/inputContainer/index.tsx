import React, { FormEvent, useState } from 'react';
import './style.css';
import { wsSendForm } from '../../utils/websocket-connection';

const InputContainer = () => {
    const [inputTitle, setInputTitle] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        if (!inputTitle || !password) {
            return;
        }

        const formData = {
            name: inputTitle,
            password: password
        };

        e.preventDefault();
        wsSendForm(formData);
        setInputTitle('');
        setPassword('');
    }
    return (
        <div className={'input-container'}>
            <h3>Auth form</h3>
            <form className={'input-container__form'} onSubmit={handleSubmit}>
                <label className={'input-container__form-label'}>
                    Type data correctly <br /> ({'<ФИО>-<номер группы>'})
                </label>
                <input 
                    onChange={(e) => setInputTitle(e.currentTarget.value)}
                    className={'input-container__form-input'} 
                    type={'text'} 
                    placeholder={'<ФИО>-<номер группы>'} 
                />
                <input 
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    className={'input-container__form-input'} 
                    type={'password'} 
                    placeholder={'Password'} 
                />
                <button className={'input-container__form-button'} type={'submit'}>
                    Auth
                </button>
            </form>
        </div>
    );
};

export default InputContainer;