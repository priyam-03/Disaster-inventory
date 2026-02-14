import { useState, useRef, useEffect } from "react";
import { FaLink, FaExpand, FaCompress, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Popup } from "react-leaflet";
import styles from '../styles/popup.module.css';

import { Record, Location } from "../types/records";

const PopUp = ({ record, location, locIndex }: { record: Record, location: Location, locIndex: number }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const popupRef = useRef<any>(null);

  const toggleMaximize = () => {
    setIsMaximized(prev => !prev);
  };

  // Force Leaflet to recalculate popup dimensions after state changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (popupRef.current) {
        const leafletPopup = popupRef.current;
        if (leafletPopup._map) {
          leafletPopup.update();
        }
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [isMaximized, isExpanded]);

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
    <Popup
      ref={popupRef}
      maxWidth={isMaximized ? 560 : 320}
      minWidth={isMaximized ? 360 : 280}
      autoPan={true}
      className={isMaximized ? 'popup-maximized' : ''}
    >
      <div className={`${styles.popupContainer} ${isMaximized ? styles.maximized : ''}`}>
        {/* Header with gradient */}
        <div className={styles.popupHeader}>
          <span className={styles.popupTitle}>{record.title}</span>
          <button className={styles.popupToggle} onClick={toggleMaximize} title={isMaximized ? "Minimize" : "Expand"}>
            {isMaximized ? <FaCompress size={12} /> : <FaExpand size={12} />}
          </button>
        </div>

        <div className={styles.popupContent}>
          {/* Location details with icons */}
          {(location.village_name_town_name || location.area_name || location.address) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
              {location.village_name_town_name && (
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                  <FaMapMarkerAlt style={{ color: '#6366f1', fontSize: '11px', flexShrink: 0 }} />
                  <span>{location.village_name_town_name}</span>
                </p>
              )}
              {location.area_name && (
                <p style={{ margin: 0, paddingLeft: '17px' }}>
                  {location.area_name}
                </p>
              )}
              {location.address && (
                <p style={{ margin: 0, paddingLeft: '17px', fontSize: '12px', color: '#94a3b8' }}>
                  {location.address}
                </p>
              )}
            </div>
          )}

          {/* Published date */}
          {record.published && (
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', margin: '0 0 10px 0' }}>
              <FaCalendarAlt style={{ fontSize: '10px', flexShrink: 0 }} />
              {record.published}
            </p>
          )}

          {/* Link button */}
          {record.link && (
            <a
              href={record.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                color: 'white',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                marginBottom: '8px',
                transition: 'opacity 0.2s',
              }}
            >
              <FaLink style={{ fontSize: '10px' }} />
              View Source
            </a>
          )}

          {/* Content text */}
          {record.contents && (
            <div className={styles.popupContentsText}>
              <p style={{ margin: 0 }}>
                {isExpanded ? record.contents : truncateContent(record.contents)}
              </p>
              {record.contents.length > 150 && (
                <button
                  onClick={toggleExpansion}
                  className={styles.seeMoreButton}
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
};

export default PopUp;
