import { useRouter } from "next/router";
import { FC, useState } from "react";
import { useStore } from "../../frontend/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { hashPassword } from "../../frontend/util/account";
import { getEndpoint } from "../../frontend/util";
import { StatusCode } from "../../shared/status";
import { setCookies } from "cookies-next";
import { Button, Form, Input } from "semantic-ui-react";

const RegisterFormPersonal: FC = () => {
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
      password: Yup.string()
        .min(8, "Too short! Must be 8 characters or more")
        .required("Required"),
    }),
    onSubmit: async (values, { setErrors }) => {
      const accountDetails = {
        key: values.email,
        password: hashPassword(values.password),
      };
      const url = getEndpoint("/api/account/register/personal");

      setLoading(true);
      const {
        data: { accessToken, status },
      } = await axios.post<{
        accessToken: string | null;
        status: Array<StatusCode>;
      }>(url, accountDetails);
      setLoading(false);

      if (status.includes(StatusCode.ACCOUNT_EXISTS)) {
        setErrors({ email: "Email already taken" });
      }

      if (
        status.includes(StatusCode.ACCOUNT_SUCCESSFULLY_CREATED) &&
        accessToken !== null
      ) {
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
    <div style={{ height: "100%" }}>
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
          Register
        </Button>
      </Form>
    </div>
  );
};

export default RegisterFormPersonal;
