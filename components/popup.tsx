import { useState } from "react";
import { FaLink, FaExpand, FaCompress } from "react-icons/fa";
import { Popup } from "react-leaflet";
import styles from '../styles/popup.module.css';  // Importing CSS module

import { Record, Location } from "../types/records";

const PopUp = ({ record, location, locIndex }: { record: Record, location: Location, locIndex: number }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle between maximized and minimized state
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const truncateContent = (content: string) => {
    const maxChars = 150;
    if (content.length > maxChars) {
      return content.slice(0, maxChars) + "...";
    }
    return content;
  };

  return (
    <Popup>
      <div className={`${styles.popupContainer} ${isMaximized ? styles.maximized : ''}`}>
      <div className={styles.popupHeader}>
        <span className={styles.popupTitle}>{record.title }</span>
        {/* Button to toggle between maximized and minimized */}
        <button className={styles.popupToggle} onClick={toggleMaximize}>
          {isMaximized ? '−' : '+'} {/* Change icon based on state */}
        </button>
        </div>

        <div className={styles.popupContent}>
         
          {location.village_name_town_name && <p>Village/Town: {location.village_name_town_name}</p>}
          {location.area_name && <p>Area: {location.area_name}</p>}
          {location.address && <p>Address: {location.address}</p>}

          {record.link && (
            <a
              href={record.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center justify-center mt-2"
            >
              <FaLink className="mr-2" />
              <span>Visit Link</span>
            </a>
          )}

          {record.published && <p className="text-gray-600 mt-2">Published on: {record.published}</p>}

          {record.contents && (
  <div className={styles.popupContentsText}>
    <p className={styles.textGray600 + ' ' + styles.mt2}>
      {isExpanded ? record.contents : truncateContent(record.contents)}
    </p>
    <button
      onClick={toggleExpansion}
      className={styles.seeMoreButton} /* Use new class here */
    >
      {isExpanded ? "See Less" : "See More"}
    </button>
  </div>
)}

        </div>
      </div>
    </Popup>
  );
};

export default PopUp;
