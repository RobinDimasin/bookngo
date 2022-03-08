import "../styles/globals.css";
import type { AppProps } from "next/app";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { useStore } from "../frontend/store";
import Head from "next/head";
import { observer } from "mobx-react";

function MyApp({ Component, pageProps }: AppProps) {
  const { ClientStore } = useStore();
  useEffect(() => {
    const accessToken = getCookie("accessToken");

    if (accessToken && typeof accessToken === "string") {
      ClientStore.setToken(accessToken);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{`Book N' Go`}</title>
        <meta name="description" />
        <link rel="icon" href="/bookngo.png" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default observer(MyApp);
