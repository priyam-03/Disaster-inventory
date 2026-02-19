import { useState, useRef, useEffect, useCallback, memo } from "react";
import { FaLink, FaExpand, FaCompress, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Popup } from "react-leaflet";
import styles from '../styles/popup.module.css';

import { Record, Location } from "../types/records";

// Defined outside component — no closure dependencies, never recreated
const truncateContent = (content: string) => {
  const maxChars = 150;
  return content.length > maxChars ? content.slice(0, maxChars) + "..." : content;
};

const PopUp = memo(({ record, location, locIndex: _locIndex }: { record: Record, location: Location, locIndex: number }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const popupRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleMaximize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMaximized(prev => !prev);
  }, []);

  const toggleExpansion = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Reposition popup after CSS transition ends — avoids the fragile hardcoded 310ms timeout
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTransitionEnd = () => {
      if (popupRef.current?._map) {
        const originalAutoPan = popupRef.current.options.autoPan;
        popupRef.current.options.autoPan = false;
        popupRef.current.update();
        popupRef.current.options.autoPan = originalAutoPan;
      }
    };

    // { once: true } auto-removes the listener after first fire
    container.addEventListener('transitionend', handleTransitionEnd, { once: true });
    return () => container.removeEventListener('transitionend', handleTransitionEnd);
  }, [isMaximized, isExpanded]);

  return (
    <Popup
      ref={popupRef}
      maxWidth={600}
      minWidth={280}
      autoPan={true}
      keepInView={true}
      autoPanPadding={[20, 20]}
      className={isMaximized ? 'popup-maximized' : ''}
    >
      <div ref={containerRef} className={`${styles.popupContainer} ${isMaximized ? styles.maximized : ''}`}>
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
            <div className={styles.locationSection}>
              {location.village_name_town_name && (
                <p className={styles.locationRow}>
                  <FaMapMarkerAlt className={styles.locationIcon} />
                  <span>{location.village_name_town_name}</span>
                </p>
              )}
              {location.area_name && (
                <p className={styles.areaName}>{location.area_name}</p>
              )}
              {location.address && (
                <p className={styles.address}>{location.address}</p>
              )}
            </div>
          )}

          {/* Published date */}
          {record.published && (
            <p className={styles.publishedDate}>
              <FaCalendarAlt className={styles.dateIcon} />
              {record.published}
            </p>
          )}

          {/* Link button */}
          {record.link && (
            <a
              href={record.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceLink}
            >
              <FaLink className={styles.linkIcon} />
              View Source
            </a>
          )}

          {/* Content text */}
          {record.contents && (
            <div className={styles.popupContentsText}>
              <p>
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
});

PopUp.displayName = 'PopUp';

export default PopUp;
