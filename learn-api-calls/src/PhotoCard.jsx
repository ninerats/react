// PhotoCard.jsx
export default function PhotoCard({ photo }) {
  const { id, title, url, thumbnailUrl, albumId } = photo;

  return (
    <div className="card h-100 shadow-sm border-0">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        title="View full size"
        className="text-decoration-none"
      >
        <img
          src={thumbnailUrl}
          className="card-img-top rounded"
          alt={title}
          loading="lazy"
        />
      </a>

      <div className="card-body p-2">
        <div className="small text-truncate" title={title}>
          {title}
        </div>
      </div>

      <div className="card-footer bg-transparent border-0 py-1">
        <span className="badge text-bg-light">Album {albumId}</span>
        <span className="badge text-bg-secondary ms-1">ID {id}</span>
      </div>
    </div>
  );
}
