import React from 'react';
import './SuccessModal.css';
import { FaCheckCircle } from 'react-icons/fa';

function SuccessModal({ isOpen, message = 'Login Successful!' }) {
    if (!isOpen) return null;

    return (
        <div className="success-modal-overlay">
            <div className="success-modal">
                <div className="success-icon">
                    <FaCheckCircle />
                </div>
                <h2>{message}</h2>
            </div>
        </div>
    );
}

export default SuccessModal;