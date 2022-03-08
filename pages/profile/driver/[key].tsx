import { FC, useEffect, useState } from "react";
import axios from "axios";
import { getEndpoint } from "../../../frontend/util";
import { useRouter } from "next/router";
import {
  Button,
  Comment,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Rating,
  Segment,
} from "semantic-ui-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useStore } from "../../../frontend/store";
import { BookingStatus } from "../../../shared/types/Booking";
import { Feedback } from "../../../shared/types/Feedback";
import moment from "moment";
import Link from "next/link";
const ProfileDriver: FC = () => {
  const router = useRouter();
  const { ClientStore } = useStore();
  const { key } = router.query;
  const [accountDetails, setAccountDetails] = useState<{
    key: string;
  }>();
  const [completedBookings, setCompletedBookings] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const formik = useFormik({
    initialValues: {
      feedback: "",
      rating: 5,
    },
    validationSchema: Yup.object({
      feedback: Yup.string()
        .required("Required")
        .max(256, "Feedback exceeded 256 characters limit"),
      rating: Yup.number().required("Required").min(0).max(5),
    }),
    onSubmit: async (v, { resetForm }) => {
      const feedbackDetails = {
        to: key,
        from: ClientStore.key,
        message: v.feedback,
        rating: v.rating,
      };

      setLoading(true);
      const {
        data: { feedback: f },
      } = await axios.post<{ feedback: Feedback }>(
        getEndpoint("/api/account/feedback/new"),
        feedbackDetails
      );
      setLoading(false);

      setFeedbacks([f, ...feedbacks]);

      resetForm();
    },
  });

  useEffect(() => {
    if (key) {
      (async () => {
        const {
          data: { account },
        } = await axios.get(getEndpoint(`/api/account/details/driver/${key}`));

        setAccountDetails(account);

        const {
          data: { bookings },
        } = await axios.get(
          getEndpoint(
            `/api/bookings/fromDriver/${ClientStore.key}?status=${BookingStatus.COMPLETED}`
          )
        );

        setCompletedBookings(bookings.length);

        const {
          data: { feedbacks },
        } = await axios.get(getEndpoint(`/api/account/feedback/getTo/${key}`));

        setFeedbacks(feedbacks);
      })();
    }
  }, [key, ClientStore.key]);

  return (
    <>
      <div style={{ width: "min(768px, 80%)", margin: "auto" }}>
        <Segment>
          <div
            style={{
              textAlign: "center",
              fontSize: "2.5rem",
              fontWeight: "bold",
              margin: "20px 0",
            }}
          >
            {accountDetails
              ? (accountDetails.key ?? "---").toUpperCase()
              : "---"}
          </div>
          <div style={{ textAlign: "center", width: "40%", margin: "auto" }}>
            <div style={{ display: "inline-block", width: "50%" }}>
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                {completedBookings ?? "--"}
              </div>
              <div>Completed Deliveries</div>
            </div>
            <div style={{ display: "inline-block", width: "50%" }}>
              <div style={{ textAlign: "center" }}>
                <Rating
                  maxRating={5}
                  rating={
                    feedbacks.reduce((total, feedback) => {
                      return total + feedback.rating;
                    }, 0) / feedbacks.length
                  }
                  icon="star"
                  size="mini"
                  disabled
                />
                ({feedbacks.length})
              </div>
              <div>User Feedback</div>
            </div>
          </div>
          <Divider />
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "20px",
              width: "100%",
            }}
          >
            Feedbacks
            <Comment.Group>
              {feedbacks
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((feedback, idx) => {
                  return (
                    <Comment key={idx}>
                      <Comment.Avatar
                        as="a"
                        src="https://imgur.com/hXD7SMU.png"
                      />
                      <Comment.Content>
                        <Comment.Author>{feedback.from}</Comment.Author>
                        <Comment.Metadata>
                          <div>
                            <Rating
                              icon="star"
                              rating={feedback.rating}
                              maxRating={5}
                              size="mini"
                              disabled
                            />
                          </div>
                          <div>{moment(feedback.timestamp).fromNow()}</div>
                        </Comment.Metadata>
                        <Comment.Text>{feedback.message}</Comment.Text>
                      </Comment.Content>
                    </Comment>
                  );
                })}
            </Comment.Group>
          </div>
          {ClientStore.key !== key ? (
            ClientStore.accountType ? (
              <Form onSubmit={formik.handleSubmit} loading={loading}>
                <Form.TextArea
                  width={16}
                  label="Feedback"
                  placeholder="Feedback"
                  {...formik.getFieldProps("feedback")}
                  error={formik.touched.feedback && formik.errors.feedback}
                  required
                  fluid
                />
                <Button
                  type="submit"
                  onClick={() => console.log(formik.errors)}
                  color="yellow"
                >
                  Submit a Feedback
                </Button>
                <Rating
                  maxRating={5}
                  icon="star"
                  rating={formik.values.rating}
                  onRate={(_, { rating }) => {
                    formik.setFieldValue("rating", rating);
                  }}
                />
              </Form>
            ) : (
              <div>
                <Link href={getEndpoint("/login")}>Login</Link> to leave a
                feedback
              </div>
            )
          ) : null}
        </Segment>
      </div>
    </>
  );
};

export default ProfileDriver;
