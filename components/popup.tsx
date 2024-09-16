import { useState } from "react";
import { FaLink, FaExpand, FaCompress } from "react-icons/fa";
import { Popup } from "react-leaflet";


import { Record, Location, LandslideRecord } from "../types/records";

const PopUp = ({ record, location, locIndex }: { record: Record, location: Location, locIndex: number }) => {

  const [isMaximized, setIsMaximized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle the expanded/collapsed state
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Limiting the content to two lines (or about 150 characters for simplicity)
  const truncateContent = (content: string) => {
    const maxChars = 150;
    if (content.length > maxChars) {
      return content.slice(0, maxChars) + "...";
    }
    return content;
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <Popup >
      <div className={`popup-container ${isMaximized ? "maximized" : ""}`}>
        <div className="popup-header">
          <div className="popup-title">
            {record.title && <strong className="text-lg text-gray-800">{record.title}</strong>}
          </div>
          <button className="popup-toggle" onClick={toggleMaximize}>
            {isMaximized ? <FaCompress /> : <FaExpand />}
          </button>
        </div>

        <div className="popup-content">
          <p>Location #{locIndex + 1}</p> {/* Display the location index */}
          {location.village_name_town_name && <p>Village/Town: {location.village_name_town_name}</p>}
          {location.area_name && <p>Area: {location.area_name}</p>}

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
            <p className="text-gray-600 mt-2">
              {isExpanded ? record.contents : truncateContent(record.contents)}
              <br />
              <button
                onClick={toggleExpansion}
                className="text-blue-500 hover:underline mt-2"
              >
                {isExpanded ? "See Less" : "See More"}
              </button>
            </p>
          )}
        </div>
      </div>
    </Popup>
  );
};

export default PopUp;
