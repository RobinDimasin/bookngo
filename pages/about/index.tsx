import { FC } from "react";
import { Accordion, Header, Segment } from "semantic-ui-react";

const AboutUs: FC = () => {
  return (
    <div style={{ width: "min(768px, 80%)", margin: "auto", height: "100%" }}>
      <Segment>
        <Header as="h1" textAlign="center" dividing>
          About us
        </Header>
        <Header as="h4">
          {`Book n' Go is created for a easier, faster, and hassle-free deliveries
          of your needs with just one click of a button. It allows users to
          conveniently connect to a large fleet of delivery vehicles driven by
          professional drivers.`}
        </Header>
        <Header as="h4">
          {`The name "Book n' Go" is derived from the simple steps needed to use
          our program, you "book" and we "go" do it for you. Book n' Go
          showcases the quick, efficient, and convenient way of booking that we
          aim to serve our users.`}
        </Header>
        <Header as="h4">
          {`It was established during the COVID-19 pandemic to reduce people going
          out to buy their needs, and to provide source of income and job
          opportunies to people who were severely affected by the pandemic.`}
        </Header>
      </Segment>
    </div>
  );
};

export default AboutUs;
