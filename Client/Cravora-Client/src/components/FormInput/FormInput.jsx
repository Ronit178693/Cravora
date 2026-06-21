/**
 * FormInput Component
 * Reusable wrapper that standardizes styling, layout, error displays, and icon placement
 * for all input fields across registration, login, and profile editing forms.
 */
import React from 'react';

/**
 * @param {String} label - Display label text above the input element
 * @param {Component} icon - Lucide Icon component to render inline on the left side of the input
 * @param {String} error - Validation error text to render beneath the input (if any exists)
 * @param {ReactNode} children - Target input/select JSX element to mount inside the input container wrapper
 */
export default function FormInput({ label, icon: Icon, error, children }) {
    return (
        <div className="input-group">
            {/* Input label name */}
            <label>{label}</label>
            <div className="input-wrapper">
                {/* Optional side icon rendering */}
                {Icon && <Icon className="input-icon" size={20} />}
                {/* Child input field placeholder */}
                {children}
            </div>
            {/* Conditional error feedback display */}
            {error && <span className="field-error">⚠ {error}</span>}
        </div>
    );
}
