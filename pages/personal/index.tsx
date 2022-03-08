import { useRouter } from "next/router";
import { FC } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { handleRedirectButton } from "../../frontend/util";

const Personal: FC = () => {
  const router = useRouter();

  return (
    <div>
      <Segment padded="very">
        <Header as="h1">Make On-Demand Delivery Possible</Header>
        <Header as="h3">
          {`Book n' Go is designed to make on-demand delivery possible for
          everyone without leaving their home.`}
        </Header>
        <Button
          onClick={handleRedirectButton(router, "/personal/book")}
          color="yellow"
        >
          Book a courier now!
        </Button>
      </Segment>
    </div>
  );
};

export default Personal;
