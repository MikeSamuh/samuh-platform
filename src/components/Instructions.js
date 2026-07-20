import styles from "./Instructions.module.css";

function parseOrderedList(markdown) {
  return markdown
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\d+\.\s+/, ""));
}

function renderInline(text, key) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <li key={key}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </li>
  );
}

export default function Instructions({ markdown }) {
  const items = parseOrderedList(markdown);

  return (
    <div className={styles.card}>
      <div className={styles.title}>Instructions</div>
      <ol className={styles.list}>
        {items.map((item, i) => renderInline(item, i))}
      </ol>
    </div>
  );
}
