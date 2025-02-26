import React from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import styles from "../styles/SignUpForm.module.css";

const SignUpForm: React.FC = () => {
  return (
    <div className={styles.container}>
      <img
        src="public/Signup Front.png"
        alt="signUpImage"
        className={styles.image}
      />
      <div className={styles.formContainer}>
        <h2>Create an account</h2>
        <p>Enter your details below</p>
        <form>
          <input type="text" placeholder="First Name" className={styles.input} />
          <input type="text" placeholder="Last Name" className={styles.input} />
          <input type="email" placeholder="Email" className={styles.input} />
          <input type="tel" placeholder="Phone Number" className={styles.input} />
          <input type="password" placeholder="Password" className={styles.input} />
          <button type="submit" className={`${styles.button} ${styles.createAccount}`}>
            Create Account
          </button>
        </form>
        <button className={`${styles.button} ${styles.googleSignIn}`}>
          <FcGoogle /> Sign up with Google
        </button>
        <p className={styles.loginLink}>
          Already have an account?{" "}
          <Link to="/login" className={styles.loginAnchor}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
