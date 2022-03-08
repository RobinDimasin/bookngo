import { observer } from "mobx-react";
import { FC, useEffect, useState } from "react";
import { useStore } from "../../frontend/store";
import { getEndpoint } from "../../frontend/util";
import {
  BookingDetailsExtendend,
  BookingStatus,
} from "../../shared/types/Booking";
import axios from "axios";
import BookingCard from "./Booking";
import { Card, Header, Icon, Item, Segment } from "semantic-ui-react";

const BookingStatusDetails: FC<{ status: BookingStatus[] }> = ({
  status = [],
}) => {
  const { ClientStore } = useStore();
  const [bookings, setBookings] = useState<BookingDetailsExtendend[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (ClientStore.key) {
        setLoading(true);
        const {
          data: { bookings },
        } = await axios.get<{ bookings: BookingDetailsExtendend[] }>(
          getEndpoint(
            `/api/bookings?${status.map((s) => `status=${s}`).join("&")}`
          )
        );

        setBookings(bookings);
        setLoading(false);
      }
    })();
  }, [ClientStore.key]);

  return (
    <>
      {bookings.length > 0 ? (
        <Item.Group divided>
          {bookings.map((booking) => (
            <BookingCard id={booking.id} key={booking.id} />
          ))}
        </Item.Group>
      ) : (
        <Header as="h4" textAlign="center">
          <Icon name="inbox" />
          No Bookings Yet
        </Header>
      )}
    </>
  );
};
export default observer(BookingStatusDetails);
