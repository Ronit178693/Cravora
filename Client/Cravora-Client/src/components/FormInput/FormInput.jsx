import React from 'react';

export default function FormInput({ label, icon: Icon, error, children }) {
    return (
        <div className="input-group">
            <label>{label}</label>
            <div className="input-wrapper">
                {Icon && <Icon className="input-icon" size={20} />}
                {children}
            </div>
            {error && <span className="field-error">⚠ {error}</span>}
        </div>
    );
}
