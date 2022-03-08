import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>{`Book N' Go`}</h1>
        <p className={styles.description}>
          {`Easier, Faster, and Hassle-free Deliveries of your Needs`}
        </p>
      </main>
    </div>
  );
};

export default Home;
