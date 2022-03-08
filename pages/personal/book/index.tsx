import { useFormik } from "formik";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import {
  Button,
  Form,
  Input,
  List,
  Message,
  Segment,
  Step,
  TextArea,
} from "semantic-ui-react";
import * as Yup from "yup";
import axios from "axios";
import { getCookie } from "cookies-next";
import {
  BookingPaymentMethod,
  BookingSpecialPackaging,
} from "../../../shared/types/Booking";
import { getEndpoint } from "../../../frontend/util";
import MultiStageForm from "../../../components/MultiStageForm";
import MapInput from "../../../components/MapInput";
import { useStore } from "../../../frontend/store";

const specialPackagingOptions = [
  { key: "f", text: "Fragile", value: "fragile" },
  { key: "h", text: "Heavy", value: "heavy" },
  { key: "i", text: "Irregular Shape", value: "irregular_shape" },
  { key: "l", text: "Liquids", value: "liquids" },
];

const paymentMethodOptions = [
  { key: "c", text: BookingPaymentMethod.COD, value: BookingPaymentMethod.COD },
  {
    key: "g",
    text: BookingPaymentMethod.GCASH,
    value: BookingPaymentMethod.GCASH,
  },
];

const BreakdownEntry: FC<{ label: string; value: number; bold?: boolean }> = ({
  label,
  value,
  bold = false,
}) => {
  return (
    <>
      <div
        style={{
          width: 100,
          display: "inline-block",
          fontWeight: bold ? "bold" : "normal",
        }}
      >
        {label}:
      </div>
      <div
        style={{
          width: 75,
          display: "inline-block",
          fontWeight: bold ? "bold" : "normal",
          textAlign: "right",
        }}
      >
        {value} PHP
      </div>
    </>
  );
};

const Test: FC = () => {
  const router = useRouter();
  const { ClientStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [pickUpLatLng, setPickUpLatLng] = useState({
    lat: 14.5799875,
    lng: 120.9758997,
  });
  const [dropOutLatLng, setDropOutLatLng] = useState({
    lat: 14.5799875,
    lng: 120.9758997,
  });

  const formik = useFormik({
    initialValues: {
      width: "",
      length: "",
      height: "",
      weight: "",
      specialPackaging: [],

      pickUpName: "",
      pickUpContactNumber: "",
      pickUpAddress: "",
      pickUpNotes: "",

      dropOutName: "",
      dropOutContactNumber: "",
      dropOutAddress: "",
      dropOutNotes: "",

      paymentMethod: BookingPaymentMethod.COD,

      tip: 0,
      deliveryFee: 0,
    },
    validationSchema: Yup.object({
      width: Yup.number().required("Required").min(0),
      length: Yup.number().required("Required").min(0),
      height: Yup.number().min(0),
      weight: Yup.number().required("Required").min(0),
      specialPackaging: Yup.array(Yup.string().max(256)).required("Required"),

      pickUpName: Yup.string().required("Required").max(256),
      pickUpContactNumber: Yup.string().required("Required").length(11),
      pickUpAddress: Yup.string().required("Required").max(256),
      pickUpNotes: Yup.string().max(256),

      dropOutName: Yup.string().required("Required").max(256),
      dropOutContactNumber: Yup.string().required("Required").length(11),
      dropOutAddress: Yup.string().required("Required").max(256),
      dropOutNotes: Yup.string().max(256),

      tip: Yup.number().min(0).default(0),
      deliveryFee: Yup.number().min(0).default(0),

      paymentMethod: Yup.string()
        .required("Required")
        .max(256)
        .default(BookingPaymentMethod.COD),
    }),
    onSubmit: async (v, { setErrors, resetForm }) => {
      const bookingDetails = {
        width: parseFloat(v.width),
        length: parseFloat(v.length),
        height: parseFloat(v.height),
        weight: parseFloat(v.weight),
        specialPackaging: v.specialPackaging as BookingSpecialPackaging[],
        pickUp: {
          name: v.pickUpName,
          contactNumber: v.pickUpContactNumber,
          address: v.pickUpAddress,
          notes: v.pickUpNotes,
          lat: pickUpLatLng.lat,
          lng: pickUpLatLng.lng,
        },
        dropOut: {
          name: v.dropOutName,
          contactNumber: v.dropOutContactNumber,
          address: v.dropOutAddress,
          notes: v.dropOutNotes,
          lat: dropOutLatLng.lat,
          lng: dropOutLatLng.lng,
        },
        paymentMethod: v.paymentMethod,
        tip: v.tip,
        deliveryFee: v.deliveryFee,
        totalFee: v.tip + v.deliveryFee,
      };

      resetForm();

      const accessToken = getCookie("accessToken");

      if (accessToken && typeof accessToken === "string") {
        const url = getEndpoint("/api/personal/book");

        setLoading(true);
        const {
          data: { id },
        } = await axios.post<{ id: string }>(url, {
          details: bookingDetails,
          token: accessToken,
        });
        setLoading(false);

        if (id) {
          router.replace(getEndpoint(`/booking/${id}`));
        }
      }
    },
  });
  return (
    <div style={{ width: "min(768px, 80%)", margin: "auto" }}>
      <MultiStageForm
        onSubmit={formik.handleSubmit}
        stages={[
          {
            stepContent: (
              <Step.Content>
                <Step.Title>Package Details</Step.Title>
              </Step.Content>
            ),
            content: (
              <>
                <Form.Group widths={"equal"}>
                  <Form.Field
                    id="width"
                    control={Input}
                    label="Width (cm)"
                    placeholder="Width"
                    {...formik.getFieldProps("width")}
                    error={formik.touched.width && formik.errors.width}
                    required
                    fluid
                  />
                  <Form.Field
                    id="length"
                    control={Input}
                    label="Length (cm)"
                    placeholder="Length"
                    {...formik.getFieldProps("length")}
                    error={formik.touched.length && formik.errors.length}
                    required
                    fluid
                  />
                  <Form.Field
                    id="height"
                    control={Input}
                    label="Height (cm)"
                    placeholder="Height"
                    {...formik.getFieldProps("height")}
                    error={formik.touched.height && formik.errors.height}
                    fluid
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field
                    id="weight"
                    control={Input}
                    label="Weight (kg)"
                    placeholder="Weight"
                    {...formik.getFieldProps("weight")}
                    error={formik.touched.weight && formik.errors.weight}
                    required
                    fluid
                  />
                  <Form.Dropdown
                    id="specialPackaging"
                    label="Special Packaging"
                    options={specialPackagingOptions}
                    placeholder="Special Packaging"
                    defaultValue={[]}
                    error={
                      formik.touched.specialPackaging &&
                      formik.errors.specialPackaging
                    }
                    onChange={(_, { value }) => {
                      formik.setFieldValue("specialPackaging", value);
                    }}
                    fluid
                    multiple
                    selection
                  />
                </Form.Group>
              </>
            ),

            isCompleted: () => {
              const { errors, touched } = formik;
              return !(
                !touched.width ||
                errors.width ||
                !touched.length ||
                errors.length ||
                !touched.weight ||
                errors.weight
              );
            },
            onLoad: () => {},
          },
          {
            stepContent: (
              <Step.Content>
                <Step.Title>Pick Up</Step.Title>
              </Step.Content>
            ),
            content: (
              <>
                <Form.Group widths={"equal"}>
                  <Form.Field
                    id="pickUpName"
                    control={Input}
                    label="Name"
                    placeholder="Name"
                    {...formik.getFieldProps("pickUpName")}
                    error={
                      formik.touched.pickUpName && formik.errors.pickUpName
                    }
                    required
                  />
                  <Form.Field
                    id="pickUpContactNumber"
                    control={Input}
                    label="Contact Number"
                    placeholder="Contact Number"
                    {...formik.getFieldProps("pickUpContactNumber")}
                    error={
                      formik.touched.pickUpContactNumber &&
                      formik.errors.pickUpContactNumber
                    }
                    required
                  />
                </Form.Group>
                <Form.Field
                  id="pickUpAddress"
                  control={Input}
                  label="Pick Up Address"
                  placeholder="Pick Up Address"
                  {...formik.getFieldProps("pickUpAddress")}
                  error={
                    formik.touched.pickUpAddress && formik.errors.pickUpAddress
                  }
                  required
                />
                <MapInput onChange={setPickUpLatLng} hasCrosshair={true} />
                <Form.Field
                  id="pickUpNotes"
                  control={TextArea}
                  label="Pick Up Notes"
                  placeholder="Pick Up Notes"
                  {...formik.getFieldProps("pickUpNotes")}
                  error={
                    formik.touched.pickUpNotes && formik.errors.pickUpNotes
                  }
                />
              </>
            ),
            isCompleted: () => {
              const { errors, touched } = formik;
              return !(
                !touched.pickUpName ||
                errors.pickUpName ||
                !touched.pickUpAddress ||
                errors.pickUpAddress ||
                !touched.pickUpContactNumber ||
                errors.pickUpContactNumber
              );
            },
            onLoad: () => {},
          },
          {
            stepContent: (
              <Step.Content>
                <Step.Title>Drop Out</Step.Title>
              </Step.Content>
            ),
            content: (
              <>
                <Form.Group widths={"equal"}>
                  <Form.Field
                    id="dropOutName"
                    control={Input}
                    label="Name"
                    placeholder="Name"
                    {...formik.getFieldProps("dropOutName")}
                    error={
                      formik.touched.dropOutName && formik.errors.dropOutName
                    }
                    required
                  />
                  <Form.Field
                    id="dropOutContactNumber"
                    control={Input}
                    label="Contact Number"
                    placeholder="Contact Number"
                    {...formik.getFieldProps("dropOutContactNumber")}
                    error={
                      formik.touched.dropOutContactNumber &&
                      formik.errors.dropOutContactNumber
                    }
                    required
                  />
                </Form.Group>
                <Form.Field
                  id="dropOutAddress"
                  control={Input}
                  label="Drop Off Address"
                  placeholder="Drop Off Address"
                  {...formik.getFieldProps("dropOutAddress")}
                  error={
                    formik.touched.dropOutAddress &&
                    formik.errors.dropOutAddress
                  }
                  required
                />
                <MapInput onChange={setDropOutLatLng} hasCrosshair={true} />
                <Form.Field
                  id="dropOutNotes"
                  control={TextArea}
                  label="Drop Off Notes"
                  placeholder="Drop Off Notes"
                  {...formik.getFieldProps("dropOutNotes")}
                  error={
                    formik.touched.dropOutNotes && formik.errors.dropOutNotes
                  }
                />
              </>
            ),
            isCompleted: () => {
              const { errors, touched } = formik;
              return !(
                !touched.dropOutName ||
                errors.dropOutName ||
                !touched.dropOutAddress ||
                errors.dropOutAddress ||
                !touched.dropOutContactNumber ||
                errors.dropOutContactNumber
              );
            },
            onLoad: () => {},
          },
          {
            stepContent: (
              <Step.Content>
                <Step.Title>Payment</Step.Title>
              </Step.Content>
            ),
            content: (
              <>
                <Form.Group widths="equal">
                  <Form.Input
                    id="deliveryFee"
                    label="Delivery Fee"
                    placeholder="Delivery Fee"
                    {...formik.getFieldProps("deliveryFee")}
                    error={
                      formik.touched.deliveryFee && formik.errors.deliveryFee
                    }
                    fluid
                    readOnly
                    required
                  />
                  <Form.Field
                    id="tip"
                    control={Input}
                    label="Driver's Tip"
                    placeholder="Driver's Tip"
                    {...formik.getFieldProps("tip")}
                    error={formik.touched.tip && formik.errors.tip}
                    fluid
                  />
                  <Form.Select
                    fluid
                    label="Payment Method"
                    options={paymentMethodOptions}
                    placeholder="Payment Method"
                    onChange={(_, { value }) => {
                      formik.setFieldValue("paymentMethod", value);
                    }}
                    required
                    defaultValue={BookingPaymentMethod.COD}
                  />
                </Form.Group>
                <Message
                  header="Fee Breakdown"
                  size="mini"
                  content={
                    <>
                      <List>
                        <List.Item>
                          <BreakdownEntry
                            label="Delivery Fee"
                            value={
                              isNaN(+formik.values.deliveryFee)
                                ? 0
                                : +formik.values.deliveryFee
                            }
                          />
                        </List.Item>
                        <List.Item>
                          <BreakdownEntry
                            label="Driver's Tip"
                            value={
                              isNaN(+formik.values.tip) ? 0 : +formik.values.tip
                            }
                          />
                        </List.Item>
                        <List.Item>
                          <BreakdownEntry
                            label="Total Fee"
                            value={
                              (isNaN(+formik.values.deliveryFee)
                                ? 0
                                : +formik.values.deliveryFee) +
                              (isNaN(+formik.values.tip)
                                ? 0
                                : +formik.values.tip)
                            }
                            bold={true}
                          />
                        </List.Item>
                      </List>
                    </>
                  }
                />
              </>
            ),
            isCompleted: () => {
              return formik.values.deliveryFee > 0;
            },
            onLoad: async () => {
              const lat1 = pickUpLatLng.lat;
              const lng1 = pickUpLatLng.lng;

              const lat2 = dropOutLatLng.lat;
              const lng2 = dropOutLatLng.lng;

              const {
                data: { cost: distance },
              } = await axios.get<{ cost: number; units: string }>(
                getEndpoint(
                  `/api/calculateDistance?lat1=${lat1}&lng1=${lng1}&lat2=${lat2}&lng2=${lng2}`
                )
              );

              formik.setFieldValue("deliveryFee", Math.ceil(distance) * 10);
            },
          },
        ]}
        submitButton={(isDisabled) => {
          return (
            <Button
              disabled={isDisabled || formik.values.deliveryFee === 0}
              type="submit"
              icon="shopping basket"
              labelPosition="left"
              content="Book"
              color="yellow"
              floated="right"
              onClick={() => {
                formik.submitForm();
                ClientStore.fetchBookingCount();
              }}
            />
          );
        }}
      />
    </div>
  );
};

export default Test;
