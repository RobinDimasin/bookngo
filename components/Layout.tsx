import { FC } from "react";
import { Segment } from "semantic-ui-react";
import { observer } from "mobx-react";
import Navbar from "./Navbar";

const Layout: FC = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default observer(Layout);
