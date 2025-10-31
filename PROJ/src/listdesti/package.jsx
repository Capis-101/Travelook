function PackageCard({ image, title, subtitle, location, onClick }) {
  return (
    <div className="package-card" onClick={onClick}>
      <div className="card-image-container">
        <img src={image} alt={title} className="card-image" />
      </div>

      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <h5 className="card-subtitle">{subtitle}</h5>
        <p className="card-location">{location}</p>
      </div>
    </div>
  );
}

export default PackageCard;
