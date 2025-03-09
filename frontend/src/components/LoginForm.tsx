import React from "react";
import styles from "../styles/LoginForm.module.css";

const LoginForm: React.FC = () => {
  return (
    <div className={styles.container}>
      <img
        src="public/Signup Front.png"
        alt="loginImage"
        className={styles.image}
      />
      <div className={styles.formContainer}>
        <h2>Log in to TimberTrack</h2>
        <p>Enter your details below</p>
        <form>
          <input type="email" placeholder="Email" className={styles.input} />
          <input type="password" placeholder="Password" className={styles.input} />
          <button type="submit" className={`${styles.button} ${styles.loginButton}`}>
            Log In
          </button>
        </form>
        <p className={styles.forgotPassword}>
          <a href="#" className={styles.forgotPasswordLink}>Forgot Password?</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
