import Router, { useRouter } from "next/router";
import { FC, useState, useEffect } from "react";
import { Button, Grid, Item, Loader, Segment } from "semantic-ui-react";
import {
  calculateDistance,
  getEndpoint,
  handleRedirectButton,
} from "../../frontend/util";
import axios from "axios";

import {
  BookingDetailsExtendend,
  BookingStatus,
} from "../../shared/types/Booking";
import { Status, StatusCode } from "../../shared/status";
import BookingCard from "../../components/booking/Booking";

const Delivery: FC = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingDetailsExtendend[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 14.5799875,
    lng: 120.9758997,
  });

  useEffect(() => {
    (async () => {
      const {
        data: { bookings },
      } = await axios.get<{
        bookings: BookingDetailsExtendend[];
        status: Status;
      }>(getEndpoint(`/api/bookings?status=${BookingStatus.PENDING}`));

      setBookings(bookings);
    })();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setCoords({
        lat,
        lng,
      });
    });
  }, []);

  return (
    <div style={{ width: "min(768px, 80%)", margin: "auto" }}>
      {coords ? (
        bookings.length > 0 ? (
          <Segment>
            {bookings
              .sort((a, b) => {
                const lat1 = coords.lat;
                const lng1 = coords.lng;

                return (
                  calculateDistance(
                    [lng1, lat1],
                    [a.pickUp.lng, a.pickUp.lat]
                  ) -
                  calculateDistance([lng1, lat1], [b.pickUp.lng, b.pickUp.lat])
                );
              })
              .map((details, idx) => {
                const lat1 = coords.lat;
                const lng1 = coords.lng;

                const dist = calculateDistance(
                  [lng1, lat1],
                  [details.pickUp.lng, details.pickUp.lat]
                );
                return (
                  <Segment key={idx}>
                    <BookingCard details={details} />
                    <br />
                    <Button
                      fluid
                      color="yellow"
                      onClick={async () => {
                        const {
                          data: { status },
                        } = await axios.post<{ status: Array<StatusCode> }>(
                          getEndpoint(`/api/booking/take/`),
                          {
                            id: details.id,
                          }
                        );
                        router.replace(getEndpoint(`/booking/${details.id}`));
                      }}
                    >
                      TAKE ({Math.round(dist * 100) / 100} km away)
                    </Button>
                  </Segment>
                );
              })}
          </Segment>
        ) : (
          <Segment textAlign="center">No Available Deliveries</Segment>
        )
      ) : (
        <Loader>Getting your location...</Loader>
      )}
    </div>
  );
};

export default Delivery;
