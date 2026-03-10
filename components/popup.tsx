import { useRef, memo } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Popup } from "react-leaflet";
import styles from '../styles/popup.module.css';
import { Record, Location } from "../types/records";

const PopUp = memo(({ record, location }: { record: Record, location: Location, locIndex: number }) => {
  const popupRef = useRef<any>(null);

  const rows: { label: string; value: string | number }[] = [];

  if (location.village_name_town_name) rows.push({ label: "Location", value: location.village_name_town_name });
  if (location.area_name) rows.push({ label: "Area", value: location.area_name });
  if (location.district_name) rows.push({ label: "District", value: location.district_name });
  if (location.state_name) rows.push({ label: "State", value: location.state_name });
  if (location.date) rows.push({ label: "Date", value: location.date });
  else if (record.published) rows.push({ label: "Date", value: record.published });
  if (location.landslide_type) rows.push({ label: "Type", value: location.landslide_type });
  if (location.landslide_size) rows.push({ label: "Size", value: location.landslide_size });
  if (location.triggering_factor) rows.push({ label: "Trigger", value: location.triggering_factor });

  return (
    <Popup
      ref={popupRef}
      maxWidth={320}
      minWidth={240}
      autoPan={true}
      keepInView={true}
      autoPanPadding={[20, 20]}
    >
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerTitle}>{record.title}</span>
        </div>

        {/* Rows */}
        <div className={styles.body}>
          {rows.map((row, i) => (
            <div key={i} className={`${styles.row} ${i % 2 === 0 ? styles.rowEven : styles.rowOdd}`}>
              <span className={styles.label}>{row.label}</span>
              <span className={styles.value}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.footerLabel}>Lat / Lon</span>
          <span className={styles.footerValue}>{location.lat} / {location.lon}</span>
        </div>

        {/* Source link */}
        {record.link && (
          <div className={styles.linkRow}>
            <a href={record.link} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
              <span>View Source</span>
              <FaExternalLinkAlt size={9} />
            </a>
          </div>
        )}
      </div>
    </Popup>
  );
});

PopUp.displayName = 'PopUp';
export default PopUp;
