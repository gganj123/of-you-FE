import './SkeletonCard.style.css';

const SkeletonCard = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
                <div className="skeleton-brand"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-price">
                    <div className="skeleton-original-price"></div>
                    <div className="skeleton-discount"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;