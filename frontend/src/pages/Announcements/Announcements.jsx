import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useAnnouncements } from "../../Context/AnnouncementsContext";
import { useApi } from "../../api/ApiContext";
import "./announcements.css";

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
  // const [user, setUser] = useState();
  const { user } = useAuth();
  const [newAnnouncement, setNewAnnouncement] = useState(false);
  const [today, setToday] = useState();

  useEffect(() => {
    getAnnouncements();
    // setUser(JSON.parse(sessionStorage.getItem("user")));
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
  if (user?.is_manager)
    return (
      <>
        <h1 className="announcements-header">Announcements</h1>
        <ul className="todays-announcements-card-container">
          {todaysAnnouncements.length === 0 && (
            <li className="no-announcements">No announcements today</li>
          )}
          {todaysAnnouncements.map((obj, i) => (
            <AnnouncementsCard
              key={i}
              classname="todays-announcements"
              announcement={obj}
            />
          ))}
        </ul>
        {newAnnouncement === false && (
          <button
            className="new-announcement-button"
            onClick={() => setNewAnnouncement(true)}
          >
            New Announcement
          </button>
        )}
        {newAnnouncement === true && (
          <form className="announcements-post-form" onSubmit={handlePost}>
            <label className="announcement-form-title">
              Announcement title:{" "}
              <input
                className="announcement-input-title"
                name="title"
                type="text"
              />
            </label>
            <label className="announcement-form-content">
              Announcement:<span> </span>
              <textarea
                className="announcement-input-content"
                name="content"
                type="text"
              />
            </label>
            <button className="announcement-form-button" type="submit">
              post
            </button>
          </form>
        )}
        <h3 className="past-announcements-header">Past Announcements</h3>
        <ul className="past-announcements-card-container">
          {oldAnnouncements.map((obj, i) => (
            <AnnouncementsCard key={i} announcement={obj} />
          ))}
        </ul>
      </>
    );

  return (
    <>
      <h1 className="announcements-header">Announcements</h1>
      <ul className="todays-announcements-card-container">
        {todaysAnnouncements.length === 0 && (
          <li className="no-announcements">No announcements today</li>
        )}
        {todaysAnnouncements.map((obj, i) => (
          <AnnouncementsCard
            key={i}
            classname="todays-announcements"
            announcement={obj}
          />
        ))}
      </ul>
      <h3 className="past-announcements-header">Past Announcements</h3>
      <ul className="past-announcements-card-container">
        {oldAnnouncements.map((obj, i) => (
          <AnnouncementsCard key={i} announcement={obj} />
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
    <li className="announcements-card">
      <h3 className="announcements-card-header">
        {announcement.announcement_type}
      </h3>
      <p className="announcements-card-content">{announcement.announcement}</p>
      <p className="announcements-card-info">
        Created by {author.first_name} {author.last_name}
        <span>
          {" "}
          on{" "}
          {(() => {
            const [year, month, day] = announcement.date
              .slice(0, 10)
              .split("-");
            return `${day}-${month}-${year}`;
          })()}
        </span>
      </p>
    </li>
  );
}
