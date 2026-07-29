"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Play, FileText, Volume2 } from "lucide-react";
import styles from "./MediaAccordion.module.css";

const TYPE_ICON = { video: Play, pdf: FileText, audio: Volume2 };
const TYPE_LABEL = { video: "Video", pdf: "PDF", audio: "Audio" };

function MediaPlayer({ item }) {
  if (item.type === "video") {
    return (
      <div className={styles.videoPlayer}>
        {item.src ? (
          <video src={item.src} controls className={styles.videoEl} />
        ) : (
          <>
            <div className={styles.playCircle}>
              <Play size={20} fill="#fff" color="#fff" />
            </div>
            <span className={styles.duration}>{item.meta}</span>
          </>
        )}
      </div>
    );
  }

  if (item.type === "pdf") {
    return (
      <div className={styles.pdfPlayer}>
        <div className={styles.pdfThumb}>
          <FileText size={20} />
        </div>
        <div>
          <div className={styles.pdfName}>{item.name}.pdf</div>
          <div className={styles.pdfMeta}>{item.meta}</div>
          {item.src ? (
            <a
              className={styles.pdfLink}
              href={item.src}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open document
            </a>
          ) : (
            <span className={styles.pdfLink}>Open document</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.audioPlayer}>
      {item.src ? (
        <audio src={item.src} controls className={styles.audioEl} />
      ) : (
        <>
          <div className={styles.playCircleSmall}>
            <Play size={14} fill="#fff" color="#fff" />
          </div>
          <div className={styles.waveform}>
            {Array.from({ length: 34 }).map((_, i) => {
              const height = 6 + Math.abs(Math.sin(i * 0.7)) * 16;
              return (
                <span key={i} className={styles.waveBar} style={{ height: `${height}px` }} />
              );
            })}
          </div>
          <span
            className={styles.duration}
            style={{ position: "static", background: "none", padding: 0 }}
          >
            {item.meta}
          </span>
        </>
      )}
    </div>
  );
}

export default function MediaAccordion({ items, onItemOpened }) {
  const [openId, setOpenId] = useState(null);

  function handleOpen(item, open) {
    setOpenId(open ? null : item.id);
    if (!open) onItemOpened?.(item.id);
  }

  return (
    <div className={styles.tiles}>
      {items.map((item) => {
        const open = openId === item.id;
        const TypeIcon = TYPE_ICON[item.type];
        return (
          <div key={item.id} className={styles.tile}>
            <button
              type="button"
              className={styles.tileHeader}
              onClick={() => handleOpen(item, open)}
            >
              <span className={styles.iconBox}>
                <TypeIcon size={17} />
              </span>
              <span className={styles.tileMeta}>
                <span className={styles.tileName}>{item.name}</span>
                <span className={styles.tileSub}>
                  {TYPE_LABEL[item.type]} &middot; {item.meta}
                </span>
              </span>
              {open ? (
                <ChevronUp size={18} className={styles.chevron} />
              ) : (
                <ChevronDown size={18} className={styles.chevron} />
              )}
            </button>
            {open && (
              <div className={styles.tileBody}>
                <MediaPlayer item={item} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
