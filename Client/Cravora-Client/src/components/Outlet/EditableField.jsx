import React, { useState, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

/**
 * EditableField Component
 * Renders a value that can be edited in place. Toggles between raw text/textarea input 
 * views and formatted text display labels, exposing edit, save, and cancel actions.
 *
 * @param {String} value - Current text/value displayed inside the component
 * @param {Function} onSave - Async callback dispatching the edited value to the server (e.g. updating location, phone)
 * @param {String} label - Section label name displayed above the value
 * @param {String} type - Input element type ('text' | 'textarea' | 'time' etc.)
 * @param {Number} rows - Row count (applicable only when type is 'textarea')
 * @param {String} placeholder - Form input placeholder string
 */
const EditableField = ({
    value,
    onSave,
    label,
    type = 'text',
    rows = 3,
    placeholder = ''
}) => {
    // Controls edit mode toggle
    const [isEditing, setIsEditing] = useState(false);
    // Temporary value buffer to hold keyboard input before save
    const [currentValue, setCurrentValue] = useState(value);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleSave = async () => {
        if (currentValue === value) {
            setIsEditing(false);
            return;
        }

        setLoading(true);
        try {
            await onSave(currentValue);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save:", error);
            // Optionally reset value or show error toast here, 
            // but usually the parent handles the toast
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setCurrentValue(value);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="editable-field-edit-mode" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', width: '100%' }}>
                <div style={{ flex: 1 }}>
                    {type === 'textarea' ? (
                        <textarea
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            className="add-outlet-input"
                            rows={rows}
                            placeholder={placeholder}
                            disabled={loading}
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                        />
                    ) : (
                        <input
                            type={type}
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            className="add-outlet-input"
                            placeholder={placeholder}
                            disabled={loading}
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                        />
                    )}
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="btn-icon-only"
                        style={{ padding: '8px', borderRadius: '8px', background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer' }}
                        title="Save"
                    >
                        <Check size={16} />
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="btn-icon-only"
                        style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}
                        title="Cancel"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="editable-field-view-mode" style={{ display: 'flex', alignItems: 'center', gap: '8px', group: 'editable' }}>
            <div style={{ flex: 1 }}>
                {label && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>{label}</span>}
                <div style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{value || <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Not set</span>}</div>
            </div>
            <button
                onClick={() => setIsEditing(true)}
                className="edit-btn"
                style={{
                    padding: '6px',
                    borderRadius: '6px',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: 0.6,
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                title="Edit"
            >
                <Pencil size={14} />
            </button>
        </div>
    );
};

export default EditableField;
