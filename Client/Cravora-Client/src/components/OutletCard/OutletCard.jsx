import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { baseURL } from '../../utils/API_paths';

const OutletCard = ({ outlet, index = 0 }) => {
    const getImageUrl = (images) => {
        if (!images || images.length === 0) return null;
        const img = images[0];
        if (img.startsWith('http')) return img;
        return `${baseURL}/${img.replace(/\\/g, '/')}`;
    };

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
