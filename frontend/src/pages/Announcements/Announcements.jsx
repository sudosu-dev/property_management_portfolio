import { useEffect, useState } from "react";
import { useAnnouncements } from "../../Context/AnnouncementsContext";
import { useApi } from "../../api/ApiContext";

export default function Announcements() {
  const {
    announcements,
    loading,
    error,
    getAnnouncements,
    postNewAnnouncement,
  } = useAnnouncements();
  const [todaysAnnouncements, setTodaysAnnouncements] = useState([]);
  const [oldAnnouncements, setOldAnnouncements] = useState([]);
  const [user, setUser] = useState();
  const [newAnnouncement, setNewAnnouncement] = useState(false);
  const [today, setToday] = useState();

  useEffect(() => {
    getAnnouncements();
    setUser(JSON.parse(sessionStorage.getItem("user")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const todayRaw = new Date();
    const todayDay = todayRaw.getDate();
    const todayMonth = todayRaw.getMonth();
    const todayYear = todayRaw.getFullYear();
    setToday(`${todayYear}-${todayMonth + 1}-${todayDay}`);

    setTodaysAnnouncements(
      announcements.filter((announcement) => {
        const announcementDate = new Date(announcement.date);
        return (
          announcementDate.getDate() === todayDay &&
          announcementDate.getMonth() === todayMonth &&
          announcementDate.getFullYear() === todayYear
        );
      })
    );

    setOldAnnouncements(
      announcements.filter((announcement) => {
        const announcementDate = new Date(announcement.date);
        return !(
          announcementDate.getDate() === todayDay &&
          announcementDate.getMonth() === todayMonth &&
          announcementDate.getFullYear() === todayYear
        );
      })
    );
  }, [announcements]);

  const handlePost = async (event) => {
    event.preventDefault();
    setNewAnnouncement(false);
    const formData = new FormData(event.target);
    const announcementObj = {
      announcement_type: formData.get("title"),
      announcement: formData.get("content"),
      date: today,
    };

    console.log("posting...");
    const result = await postNewAnnouncement(announcementObj);
    if (result !== 201) return alert("Error creating announcement");
    alert("Announcement created successfully");
    await getAnnouncements();
  };

  if (loading) return <p>Loading announcements...</p>;
  if (error) return <p>Error GETTING announcements: {error.message}</p>;
  if (user.is_manager)
    return (
      <>
        <h1>Announcements</h1>
        {todaysAnnouncements.length === 0 && <p>No announcements today.</p>}
        <ul>
          {todaysAnnouncements.map((obj, i) => (
            <AnnouncementsCard
              key={i}
              classname="todays-announcements"
              announcement={obj}
            />
          ))}
        </ul>
        {newAnnouncement === false && (
          <button onClick={() => setNewAnnouncement(true)}>
            New Announcement
          </button>
        )}
        {newAnnouncement === true && (
          <form onSubmit={handlePost}>
            <label>
              Announcement title: <input name="title" type="text" />
            </label>
            <label>
              Announcement: <input name="content" type="text" />
            </label>
            <button type="submit">post</button>
          </form>
        )}
        <h3>Past Announcements</h3>
        <ul>
          {oldAnnouncements.map((obj, i) => (
            <AnnouncementsCard key={i} announcement={obj} />
          ))}
        </ul>
      </>
    );

  return (
    <>
      <h1>Announcements</h1>
      {todaysAnnouncements.length === 0 && <p>No announcements today.</p>}
      <ul>
        {todaysAnnouncements.map((obj, i) => (
          <AnnouncementsCard
            key={i}
            classname="todays-announcements"
            announcement={obj}
          />
        ))}
      </ul>
      <h3>Past Announcements</h3>
      <ul>
        {oldAnnouncements.map((obj, i) => (
          <AnnouncementsCard
            key={i}
            classname="past-announcements"
            announcement={obj}
          />
        ))}
      </ul>
    </>
  );
}

export function AnnouncementsCard({ announcement }) {
  const { request } = useApi();
  const [author, setAuthor] = useState();

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const res = await request(`/users/${announcement.user_id}`);
        setAuthor(res);
      } catch (err) {
        console.log(`error fetching author: ${err}`);
      }
    };
    getAuthor();
  }, [announcement.user_id, request]);

  if (!author) return null;

  return (
    <li>
      <section>
        <h3>{announcement.announcement_type}</h3>
        <p>{announcement.announcement}</p>
        <p>
          {author.first_name}
          <span>
            {(() => {
              const [year, month, day] = announcement.date
                .slice(0, 10)
                .split("-");
              return `${day}-${month}-${year}`;
            })()}
          </span>
        </p>
      </section>
    </li>
  );
}
