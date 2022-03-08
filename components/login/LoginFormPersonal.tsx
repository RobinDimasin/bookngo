import { FC, useState } from "react";
import { useFormik } from "formik";
import { Button, Form, Input } from "semantic-ui-react";
import * as Yup from "yup";
import { hashPassword } from "../../frontend/util/account";
import axios from "axios";
import { getEndpoint } from "../../frontend/util";
import { StatusCode } from "../../shared/status";
import { setCookies } from "cookies-next";
import { useRouter } from "next/router";
import { useStore } from "../../frontend/store";

const LoginFormPersonal: FC = () => {
  const router = useRouter();
  const { ClientStore } = useStore();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { setErrors }) => {
      const accountDetails = {
        key: values.email,
        password: hashPassword(values.password),
      };

      const url = getEndpoint("/api/account/login/personal");

      setLoading(true);
      const {
        data: { accessToken, status },
      } = await axios.post<{
        accessToken: string | null;
        status: Array<StatusCode>;
      }>(url, accountDetails);
      setLoading(false);

      if (status.includes(StatusCode.INCORRECT_PASSWORD)) {
        setErrors({ password: "Incorrect password" });
      }

      if (status.includes(StatusCode.ACCOUNT_DOES_NOT_EXISTS)) {
        setErrors({ email: "Email does not exists" });
      }

      if (accessToken) {
        setCookies("accessToken", accessToken);
        ClientStore.setToken(accessToken);

        const query = router.query;

        if (query.next && typeof query.next === "string") {
          router.replace(query.next);
        } else {
          router.replace(getEndpoint("/"));
        }
      }
    },
  });

  return (
    <div>
      <Form onSubmit={formik.handleSubmit} loading={loading}>
        <Form.Field
          id="email"
          control={Input}
          label="Email"
          placeholder="Email"
          {...formik.getFieldProps("email")}
          error={formik.touched.email && formik.errors.email}
          required
        />
        <Form.Input
          id="password"
          label="Password"
          type="password"
          placeholder="Password"
          {...formik.getFieldProps("password")}
          error={formik.touched.password && formik.errors.password}
          required
        />
        <Button type="submit" fluid color="yellow">
          Login
        </Button>
      </Form>
    </div>
  );
};

export default LoginFormPersonal;
