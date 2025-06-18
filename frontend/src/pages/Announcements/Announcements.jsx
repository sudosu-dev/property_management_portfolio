import { useAnnouncements } from "../../Context/AnnouncementsContext";
import { useAuth } from "../../auth/AuthContext";

export default function AnnouncementsPage() {
  const { announcements, loading, error } = useAnnouncements();
  const today = new Date();

  if (loading) return <p>Loading announcements...</p>;
  if (error) return <p>Error GETTING announcements: {error.message}</p>;

  return (
    <>
      <h1>Announcements</h1>
      <h2>{today}</h2>
      <p>{announcements}</p>
    </>
  );
}
