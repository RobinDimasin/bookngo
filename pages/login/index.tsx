import { useRouter } from "next/router";
import { FC } from "react";
import { Tab } from "semantic-ui-react";
import LoginFormDriver from "../../components/login/LoginFormDriver";
import LoginFormPersonal from "../../components/login/LoginFormPersonal";
import { AccountTypes } from "../../shared/types/AccountTypes";

const panes = [
  {
    key: AccountTypes.PERSONAL,
    menuItem: "Personal",
    type: AccountTypes.PERSONAL,
    pane: (
      <Tab.Pane>
        <LoginFormPersonal />
      </Tab.Pane>
    ),
  },
  {
    key: AccountTypes.DRIVER,
    menuItem: "Driver",
    type: AccountTypes.DRIVER,
    pane: (
      <Tab.Pane>
        <LoginFormDriver />
      </Tab.Pane>
    ),
  },
];

const LoginForm: FC = () => {
  const router = useRouter();
  const {
    query: { type },
  } = router;

  const logins =
    type && typeof type === "string"
      ? panes.filter((pane) => pane.type.toLowerCase() === type.toLowerCase())
      : panes;

  return (
    <div style={{ width: "max(30%, 300px)", margin: "auto" }}>
      <Tab
        panes={logins.length === 0 ? panes : logins}
        renderActiveOnly={false}
      />
    </div>
  );
};

export default LoginForm;
