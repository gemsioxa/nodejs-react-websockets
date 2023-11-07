import React from 'react';
import './style.css';

interface IProps {
    isActive: boolean;
}

const Status = (props: IProps) => {
    const { isActive } = props;

    return (
        <div>
            <div className={'status'}>
                <div className={'status__title'}>
                    Status:
                </div>
                <div className={`status__info ${isActive ? 'status__info-active' : 'status__info-inactive'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                </div>
            </div>
        </div>
    );
};

export default Status;