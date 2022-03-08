import type { NextPage } from "next";
import { Grid, Header } from "semantic-ui-react";
import styles from "../styles/Home.module.css";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import axios from "axios";
import { getEndpoint } from "../frontend/util";

const Home: NextPage = () => {
  const [completedBookings, setCompletedBookings] = useState(0);
  const [registeredPersonals, setRegisteredPersonals] = useState(0);
  const [registeredDrivers, setRegisteredDrivers] = useState(0);

  useEffect(() => {
    (async () => {
      setCompletedBookings(
        (await axios.get(getEndpoint("/api/statistics/completedBookings"))).data
          .count
      );
      setRegisteredPersonals(
        (
          await axios.get(
            getEndpoint("/api/statistics/registeredAccount/personal")
          )
        ).data.count
      );
      setRegisteredDrivers(
        (
          await axios.get(
            getEndpoint("/api/statistics/registeredAccount/driver")
          )
        ).data.count
      );
    })();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>{`Book N' Go`}</h1>
        <p className={styles.description}>
          {`Easier, Faster, and Hassle-free Deliveries of your Needs`}
        </p>
      </main>
      <div style={{ width: "70%", margin: "auto", padding: "75px 0" }}>
        <Grid columns={3} divided>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <Header as="h1">
                <CountUp end={completedBookings} duration={1} />
              </Header>
              <Header as="h5">Completed Bookings</Header>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Header as="h1">
                <CountUp end={registeredPersonals} duration={1} />
              </Header>
              <Header as="h5">Users</Header>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Header as="h1">
                <CountUp end={registeredDrivers} duration={1} />
              </Header>
              <Header as="h5">Drivers</Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
};

export default Home;
