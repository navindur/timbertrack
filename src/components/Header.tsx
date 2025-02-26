import React from "react";
import { Link } from "react-router-dom"; // Import Link
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoOrange}>Timber</span>
        <span className={styles.logoBlue}>Track</span>
      </div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>
          Home
        </Link>
        <Link to="/contact" className={styles.navLink}>
          Contact
        </Link>
        <Link to="/about" className={styles.navLink}>
          About
        </Link>
        <Link to="/signup" className={`${styles.navLink} ${styles.active}`}>
          Sign Up
        </Link>
      </nav>
      <div className={styles.searchBox}>
        <input type="text" placeholder="Search" className={styles.searchInput} />
        <button className={styles.searchButton}>Search</button>
      </div>
    </header>
  );
};

export default Header;
