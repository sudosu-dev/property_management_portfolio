import useQuery from "../../api/useQuery";
import "./announcements.css";

function AnnouncementsCard({ announcement }) {
  return (
    <li className="announcements-card">
      <h3 className="announcements-card-header">
        {announcement.announcement_type}
      </h3>
      <p className="announcements-card-content">{announcement.announcement}</p>
      <p className="announcements-card-info">
        Posted by {announcement.first_name} {announcement.last_name}
        <span>
          {" "}
          on {new Date(announcement.publish_at).toLocaleDateString()}
        </span>
      </p>
    </li>
  );
}

export default function Announcements() {
  const {
    data: announcements,
    loading,
    error,
  } = useQuery("/announcements", "publicAnnouncements");

  if (loading) return <p>Loading announcements...</p>;
  if (error) return <p>Error loading announcements: {error}</p>;

  return (
    <div className="announcement-page-container">
      <h1 className="announcements-header">Announcements</h1>
      {announcements && announcements.length > 0 ? (
        <ul className="todays-announcements-card-container">
          {announcements.map((item) => (
            <AnnouncementsCard key={item.id} announcement={item} />
          ))}
        </ul>
      ) : (
        <p className="no-announcements">
          There are no announcements at this time.
        </p>
      )}
    </div>
  );
}
