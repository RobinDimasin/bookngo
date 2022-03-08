import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useStore } from "../../frontend/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { hashPassword } from "../../frontend/util/account";
import { getEndpoint } from "../../frontend/util";
import { StatusCode } from "../../shared/status";
import { setCookies } from "cookies-next";
import { Button, Form, Input } from "semantic-ui-react";
import { DriverVehicleType } from "../../shared/types/Driver";

const driverVehicleOptions = Object.values(DriverVehicleType).map((type) => {
  return {
    key: type,
    text: type,
    value: type,
  };
});

const RegisterFormDriver: FC = () => {
  const router = useRouter();
  const { ClientStore } = useStore();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      phone: "",
      vehicle: DriverVehicleType.MOTORCYCLE,
      password: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string().required("Required").length(11),
      vehicle: Yup.string().required("Required"),
      password: Yup.string()
        .min(8, "Too short! Must be 8 characters or more")
        .required("Required"),
    }),
    onSubmit: async (values, { setErrors }) => {
      const accountDetails = {
        key: values.phone,
        vehicle: values.vehicle,
        password: hashPassword(values.password),
      };

      const url = getEndpoint("/api/account/register/driver");

      setLoading(true);
      const {
        data: { accessToken, status },
      } = await axios.post<{
        accessToken: string | null;
        status: Array<StatusCode>;
      }>(url, accountDetails);
      setLoading(false);

      if (status.includes(StatusCode.ACCOUNT_EXISTS)) {
        setErrors({ phone: "Phone already taken" });
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
          id="phone"
          control={Input}
          label="Phone"
          placeholder="Phone"
          {...formik.getFieldProps("phone")}
          error={formik.touched.phone && formik.errors.phone}
          required
        />
        <Form.Select
          id="vehicle"
          label="Vehicle"
          options={driverVehicleOptions}
          placeholder="Vehicle"
          defaultValue={DriverVehicleType.MOTORCYCLE}
          error={formik.touched.vehicle && formik.errors.vehicle}
          required
          fluid
          onChange={(_, { value }) => {
            formik.setFieldValue("vehicle", value);
          }}
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
          Register as Driver
        </Button>
      </Form>
    </div>
  );
};

export default RegisterFormDriver;
