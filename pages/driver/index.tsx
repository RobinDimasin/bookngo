import { useRouter } from "next/router";
import { FC } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { handleRedirectButton } from "../../frontend/util";

const Driver: FC = () => {
  const router = useRouter();
  return (
    <div>
      <Segment padded="very">
        <Header as="h1">{`Be A Book n' Go Driver Now!`}</Header>
        <Header as="h3">
          {`Earn up to ₱100 or more per delivery. Many benefits and wide range of
          BNG rewards are waiting for you. Become a Book n' Go Driver now!`}
        </Header>
        <Button
          onClick={handleRedirectButton(router, `/register?type=driver`)}
          color="yellow"
        >
          Register now!
        </Button>
      </Segment>
    </div>
  );
};

export default Driver;
