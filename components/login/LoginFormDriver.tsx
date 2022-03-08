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

const LoginFormDriver: FC = () => {
  const router = useRouter();
  const { ClientStore } = useStore();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string().required("Required").length(11),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { setErrors }) => {
      const accountDetails = {
        key: values.phone,
        password: hashPassword(values.password),
      };
      const url = getEndpoint("/api/account/login/driver");

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
        setErrors({ phone: "Phone does not exists" });
      }

      if (accessToken) {
        setCookies("accessToken", accessToken);
        ClientStore.setToken(accessToken);

        const query = router.query;

        if (query.next && typeof query.next === "string") {
          router.push(query.next);
        } else {
          router.push(getEndpoint("/"));
        }
      }
    },
  });

  return (
    <div>
      <Form onSubmit={formik.handleSubmit} loading={loading}>
        <Form.Field
          id="phone"
          control={Input}
          label="Phone"
          placeholder="Phone"
          {...formik.getFieldProps("phone")}
          error={formik.touched.phone && formik.errors.phone}
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
          Login as Driver
        </Button>
      </Form>
    </div>
  );
};

export default LoginFormDriver;
