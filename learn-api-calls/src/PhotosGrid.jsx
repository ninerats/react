// PhotosGrid.jsx
import PhotoCard from "./PhotoCard";

export default function PhotosGrid({ photos }) {
  if (!photos?.length) return <p>No photos found.</p>;

  return (
    <div className="container px-0">
      <div className="row g-3">
        {photos.map((photo) => (
          <div key={photo.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
            <PhotoCard photo={photo} />
          </div>
        ))}
      </div>
    </div>
  );
}
