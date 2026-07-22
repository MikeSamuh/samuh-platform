"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Play, FileText, Volume2 } from "lucide-react";
import { practices } from "@/lib/practicesData";
import styles from "./PracticeTiles.module.css";

const TYPE_ICON = { video: Play, pdf: FileText, audio: Volume2 };
const TYPE_LABEL = { video: "Video", pdf: "PDF", audio: "Audio" };

function MediaPlayer({ practice }) {
  if (practice.type === "video") {
    return (
      <div className={styles.videoPlayer}>
        <div className={styles.playCircle}>
          <Play size={20} fill="#fff" color="#fff" />
        </div>
        <span className={styles.duration}>{practice.meta}</span>
      </div>
    );
  }

  if (practice.type === "pdf") {
    return (
      <div className={styles.pdfPlayer}>
        <div className={styles.pdfThumb}>
          <FileText size={20} />
        </div>
        <div>
          <div className={styles.pdfName}>{practice.name}.pdf</div>
          <div className={styles.pdfMeta}>{practice.meta}</div>
          <span className={styles.pdfLink}>Open document</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.audioPlayer}>
      <div className={styles.playCircleSmall}>
        <Play size={14} fill="#fff" color="#fff" />
      </div>
      <div className={styles.waveform}>
        {Array.from({ length: 34 }).map((_, i) => {
          const height = 6 + Math.abs(Math.sin(i * 0.7)) * 16;
          return <span key={i} className={styles.waveBar} style={{ height: `${height}px` }} />;
        })}
      </div>
      <span className={styles.duration} style={{ position: "static", background: "none", padding: 0 }}>
        {practice.meta}
      </span>
    </div>
  );
}

export default function PracticeTiles() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className={styles.tiles}>
      {practices.map((practice) => {
        const open = openId === practice.id;
        const TypeIcon = TYPE_ICON[practice.type];
        return (
          <div key={practice.id} className={styles.tile}>
            <button
              type="button"
              className={styles.tileHeader}
              onClick={() => setOpenId(open ? null : practice.id)}
            >
              <span className={styles.iconBox}>
                <TypeIcon size={17} />
              </span>
              <span className={styles.tileMeta}>
                <span className={styles.tileName}>{practice.name}</span>
                <span className={styles.tileSub}>
                  {TYPE_LABEL[practice.type]} &middot; {practice.meta}
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
                <MediaPlayer practice={practice} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
