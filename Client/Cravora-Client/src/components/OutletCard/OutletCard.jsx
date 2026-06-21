import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { baseURL } from '../../utils/API_paths';

/**
 * OutletCard Component
 * Displays a summary preview card of a merchant outlet (including thumbnail image, open status, 
 * location, and operating hours). Wraps the contents inside a React Router link pointing to 
 * the corresponding detailed outlet page.
 *
 * @param {Object} outlet - Outlet database model object containing images, description, working hours, etc.
 * @param {Number} index - Loop iteration index used to stagger CSS scale/fade-in animations.
 */
const OutletCard = ({ outlet, index = 0 }) => {
    
    /**
     * getImageUrl
     * Normalizes image path from the backend storage to serve as an absolute source URL.
     * @param {String[]} images - Array of image path strings
     * @returns {String|null} Absolute URL string or null if empty
     */
    const getImageUrl = (images) => {
        if (!images || images.length === 0) return null;
        const img = images[0];
        if (img.startsWith('http')) return img;
        return `${baseURL}/${img.replace(/\\/g, '/')}`;
    };

    // Pre-calculate verified image URL or fallback placeholder
    const imageUrl = getImageUrl(outlet.images);

    return (
        <Link
            to={`/outlet/${outlet._id}`}
            className="sd-outlet-card"
            style={{ animationDelay: `${index * 0.08}s` }}
        >
            <div className="sd-outlet-card-img">
                {imageUrl ? (
                    <img src={imageUrl} alt={outlet.name} />
                ) : (
                    <div className="sd-outlet-card-placeholder">
                        <span>{outlet.name?.charAt(0)}</span>
                    </div>
                )}
                {outlet.isOpen !== false && (
                    <span className="sd-open-badge">Open</span>
                )}
            </div>

            <div className="sd-outlet-card-body">
                <h3 className="sd-outlet-card-name">{outlet.name}</h3>
                <p className="sd-outlet-card-desc">
                    {outlet.description || 'Delicious food awaits you!'}
                </p>

                <div className="sd-outlet-card-meta">
                    {outlet.location && (
                        <span className="sd-meta-item">
                            <MapPin size={14} /> {outlet.location}
                        </span>
                    )}
                    {outlet.WorkingHours && (
                        <span className="sd-meta-item">
                            <Clock size={14} />
                            {outlet.WorkingHours.open} – {outlet.WorkingHours.close}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default OutletCard;
