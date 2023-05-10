import styles from "./Navigation.module.css";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/icons/logo.svg";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

export default function Navigation() {
  const router = useRouter();

  function handleClick() {
    router.push("/");
  }

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    document
      .querySelector(`.${styles.lineOne}`)
      .classList.add(styles.lineOneHover);
    document
      .querySelector(`.${styles.lineTwo}`)
      .classList.add(styles.lineTwoHover);
  };

  const handleMouseLeave = () => {
    document
      .querySelector(`.${styles.lineOne}`)
      .classList.remove(styles.lineOneHover);
    document
      .querySelector(`.${styles.lineTwo}`)
      .classList.remove(styles.lineTwoHover);
  };

  return (
    <>
      <main
        className={styles.main}
        onClick={toggleMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.logoContainer}>
          <Image priority src={logo} className={styles.logo} />
          <p>Nova</p>
        </div>
        <div className={`${styles.menuContainer} ${isOpen ? styles.open : ""}`}>
          <div
            className={`${styles.lineOne} ${isOpen ? styles.lineOneOpen : ""}`}
          ></div>
          <div
            className={`${styles.lineTwo} ${isOpen ? styles.lineTwoOpen : ""}`}
          ></div>
        </div>
      </main>
      <motion.div
        className={styles.sidebar}
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className={styles.sidebarContent}>
          <Link href="/" className={styles.link}>
            <ul>Item 1</ul>
          </Link>
          <Link href="/" className={styles.link}>
            <ul>Item 2</ul>
          </Link>
          <Link href="/" className={styles.link}>
            <ul>Item 3</ul>
          </Link>
          <Link href="/" className={styles.link}>
            <ul>Item 4</ul>
          </Link>
          <Link href="/" className={styles.link}>
            <ul>Item 5</ul>
          </Link>
        </div>
      </motion.div>
    </>
  );
}
