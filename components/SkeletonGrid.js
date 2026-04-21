export default function SkeletonGrid({ count = 6 }) {
  return (
    <div className="loading-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" style={{ width: "100%" }} />
          <div className="skeleton skeleton-line" style={{ width: "90%" }} />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-date" />
        </div>
      ))}
    </div>
  );
}
