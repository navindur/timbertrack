import React from "react";
import styles from "../styles/HomePage.module.css";

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <h2>New Arrival</h2>
          <h1>Discover Our New Collection</h1>
          <p>
            Come visit us and find out world-best furniture, select what you like, own them as you like.
          </p>
          <button className={styles.heroButton}>BUY NOW</button>
        </div>
      </section>

      {/* Browse The Range Section */}
      <section className={styles.range}>
        <h2>Browse The Range</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <div className={styles.rangeGrid}>
          <div className={styles.rangeCard}>Dining</div>
          <div className={styles.rangeCard}>Living</div>
          <div className={styles.rangeCard}>Bedroom</div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className={styles.products}>
        <h2>Our Products</h2>
        <div className={styles.productGrid}>
          <div className={styles.productCard}>
            <img src="public/Signup Front.png" alt="Syltherine" />
            <h3>Syltherine</h3>
            <p>Stylish cafe chair</p>
            <p>Rs. 2,500,000</p>
          </div>
          <div className={styles.productCard}>
            <img src="public/Signup Front.png" alt="Lolito" />
            <h3>Lolito</h3>
            <p>Luxury big sofa</p>
            <p>Rs. 7,000,000</p>
          </div>
          <div className={styles.productCard}>
            <img src="public/Signup Front.png" alt="Respira" />
            <h3>Respira</h3>
            <p>Outdoor bar table and stool</p>
            <p>Rs. 500,000</p>
          </div>
          {/* Add more product cards as needed */}
        </div>
        <button className={styles.loadMoreButton}>Show More</button>
      </section>
    </div>
  );
};

export default HomePage;
