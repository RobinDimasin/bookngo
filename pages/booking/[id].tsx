import Router, { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import BookingCard from "../../components/booking/Booking";
import MapInput from "../../components/MapInput";
import {
  BookingDetailsExtendend,
  BookingStatus,
} from "../../shared/types/Booking";
import axios from "axios";
import { getEndpoint } from "../../frontend/util";
import { Button, Loader, Segment } from "semantic-ui-react";
import { useStore } from "../../frontend/store";

const BookingInfo: FC = () => {
  const router = useRouter();
  const { ClientStore } = useStore();
  const { id } = router.query;

  const [booking, setBooking] = useState<BookingDetailsExtendend>();

  useEffect(() => {
    (async () => {
      if (id) {
        const {
          data: { booking },
        } = await axios.get<{ booking: BookingDetailsExtendend }>(
          getEndpoint(`/api/booking/${id}`)
        );

        setBooking(booking);
      }
    })();
  }, [id]);

  return (
    <div style={{ width: "min(768px, 80%)", margin: "auto" }}>
      {id && typeof id === "string" ? (
        <>
          {booking ? (
            <>
              <Segment.Group>
                <Segment>
                  <BookingCard details={booking} />
                </Segment>
                <Segment>
                  <MapInput
                    coordinate={
                      booking.status === BookingStatus.PENDING ||
                      booking.status === BookingStatus.TO_PICK_UP
                        ? {
                            lat: booking.pickUp.lat,
                            lng: booking.pickUp.lng,
                          }
                        : {
                            lat: booking.dropOut.lat,
                            lng: booking.dropOut.lng,
                          }
                    }
                    fixedMarkers={[
                      {
                        lat: booking.pickUp.lat,
                        lng: booking.pickUp.lng,
                        color: "blue",
                        label: "Pick Up",
                      },
                      {
                        lat: booking.dropOut.lat,
                        lng: booking.dropOut.lng,
                        color: "red",
                        label: "Drop Out",
                      },
                    ]}
                  />
                </Segment>
                {booking.status === BookingStatus.TO_PICK_UP &&
                ClientStore.key === booking.driver &&
                booking.driver ? (
                  <Segment>
                    <Button
                      fluid
                      color="yellow"
                      onClick={async () => {
                        await axios.post(
                          getEndpoint("/api/booking/changeStatus"),
                          {
                            id,
                            status: {
                              to: BookingStatus.TO_DROP_OFF,
                            },
                          }
                        );

                        Router.reload();
                      }}
                    >
                      Mark as Picked Up
                    </Button>
                  </Segment>
                ) : null}

                {booking.status === BookingStatus.TO_DROP_OFF &&
                ClientStore.key === booking.driver &&
                booking.driver ? (
                  <Segment>
                    <Button
                      fluid
                      color="yellow"
                      onClick={async () => {
                        await axios.post(
                          getEndpoint("/api/booking/changeStatus"),
                          {
                            id,
                            status: {
                              to: BookingStatus.COMPLETED,
                            },
                          }
                        );

                        Router.reload();
                      }}
                    >
                      Mark as Delivered
                    </Button>
                  </Segment>
                ) : null}
                {booking.status === BookingStatus.PENDING &&
                ClientStore.key === booking.owner ? (
                  <Segment>
                    <Button
                      fluid
                      color="red"
                      onClick={async () => {
                        await axios.post(
                          getEndpoint("/api/booking/changeStatus"),
                          {
                            id,
                            status: {
                              to: BookingStatus.CANCELLED,
                            },
                          }
                        );

                        Router.reload();
                      }}
                    >
                      Cancel
                    </Button>
                  </Segment>
                ) : null}
              </Segment.Group>
            </>
          ) : (
            <>
              <Loader active inline="centered">
                {`Fetching Booking ID: "${id}"`}
              </Loader>
            </>
          )}
        </>
      ) : (
        <div>Invalid ID</div>
      )}
    </div>
  );
};

export default BookingInfo;
