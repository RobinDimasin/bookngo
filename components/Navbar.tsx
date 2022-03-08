import { removeCookies } from "cookies-next";
import { observer } from "mobx-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Dropdown,
  Icon,
  Label,
  Menu,
  SemanticICONS,
} from "semantic-ui-react";
import { useStore } from "../frontend/store";
import { getEndpoint, handleRedirectButton } from "../frontend/util";
import { AccountTypes } from "../shared/types/AccountTypes";

import { isMobile } from "react-device-detect";

const Navbar: FC = () => {
  const { ClientStore } = useStore();
  const router = useRouter();

  const handleLougout = () => {
    removeCookies("accessToken");
    ClientStore.setToken(null);
    router.push(getEndpoint("/"));
  };

  const navContent = useCallback(
    (text: string | JSX.Element, icon: SemanticICONS) => {
      return !isMobile ? text : <Icon name={icon} />;
    },
    [isMobile]
  );

  useEffect(() => {
    console.log({ isMobile });
  }, [isMobile]);

  return (
    <Menu>
      <Menu.Item
        header
        active={router.asPath === "/"}
        onClick={handleRedirectButton(router, "/")}
        {...(!isMobile ? { fitted: "vertically" } : {})}
      >
        {navContent(
          <div style={{ padding: "15px" }}>
            <Image src="/bookngo.png" alt="Book N' Go" width={76} height={40} />
          </div>,
          "home"
        )}
      </Menu.Item>
      {ClientStore.key ? (
        ClientStore.accountType === AccountTypes.PERSONAL ? (
          <Menu.Item
            content={navContent("Book", "book")}
            active={router.asPath.startsWith("/personal")}
            onClick={handleRedirectButton(router, "/personal/book")}
          />
        ) : (
          <Menu.Item
            content={navContent("Delivery", "box")}
            active={router.asPath.startsWith("/delivery")}
            onClick={handleRedirectButton(router, "/delivery")}
          />
        )
      ) : (
        <>
          <Menu.Item
            content={navContent("Personal", "user")}
            active={router.asPath.startsWith("/personal")}
            onClick={handleRedirectButton(router, "/personal")}
          />

          <Menu.Item
            content={navContent("Driver", "shipping fast")}
            active={router.asPath.startsWith("/driver")}
            onClick={handleRedirectButton(router, "/driver")}
          />
        </>
      )}
      <Menu.Item
        content={navContent("About Us", "question circle")}
        active={router.asPath.startsWith("/about")}
        onClick={handleRedirectButton(router, "/about")}
      />
      <Menu.Menu position="right">
        {ClientStore.key ? (
          ClientStore.accountType === AccountTypes.PERSONAL ? (
            <Menu.Item
              content={navContent(
                <>
                  My Bookings
                  <Label circular color="yellow">
                    {ClientStore.bookingsCount}
                  </Label>
                </>,
                "shopping cart"
              )}
              active={router.asPath.startsWith("/bookings")}
              onClick={handleRedirectButton(router, "/bookings")}
            />
          ) : (
            <Menu.Item
              content={navContent("My Delivery", "boxes")}
              active={router.asPath.startsWith("/deliveries")}
              onClick={handleRedirectButton(router, "/deliveries")}
            />
          )
        ) : null}
        {ClientStore.key ? (
          <>
            <Dropdown
              {...(!isMobile
                ? { text: ClientStore.key }
                : { icon: "address card outline" })}
              pointing
              className="link item"
            >
              <Dropdown.Menu>
                <Dropdown.Header>
                  <h4>{ClientStore.key}</h4>
                  {ClientStore.accountType ?? ""}
                </Dropdown.Header>
                <Dropdown.Item
                  onClick={handleRedirectButton(
                    router,
                    `/profile/${ClientStore.accountType}/${ClientStore.key}`
                  )}
                >
                  Profile
                </Dropdown.Item>
                {ClientStore.accountType === AccountTypes.DRIVER ? (
                  <Dropdown.Item
                    onClick={handleRedirectButton(router, "/deliveries")}
                  >
                    Deliveries
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item
                    onClick={handleRedirectButton(router, "/bookings")}
                  >
                    Bookings
                  </Dropdown.Item>
                )}
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleRedirectButton(router, "/faq")}>
                  FAQs
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLougout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) : (
          <>
            {isMobile ? (
              <>
                <Menu.Item
                  onClick={handleRedirectButton(router, "/register")}
                  color="red"
                >
                  Register
                </Menu.Item>
                <Menu.Item onClick={handleRedirectButton(router, "/login")}>
                  Login
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item>
                  <Button onClick={handleRedirectButton(router, "/register")}>
                    Register
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button
                    onClick={handleRedirectButton(router, "/login")}
                    color="yellow"
                  >
                    Login
                  </Button>
                </Menu.Item>
              </>
            )}
          </>
        )}
      </Menu.Menu>
    </Menu>
  );
};

export default observer(Navbar);
