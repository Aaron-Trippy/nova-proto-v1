import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.lds_circle}>
      <div></div>
    </div>
  );
}
