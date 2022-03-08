import { observer } from "mobx-react";
import { FC, useEffect, useState } from "react";
import { useStore } from "../../frontend/store";
import { getEndpoint } from "../../frontend/util";
import {
  BookingDetailsExtendend,
  BookingStatus,
} from "../../shared/types/Booking";
import axios from "axios";
import { Header, Icon, Item, Segment } from "semantic-ui-react";
import BookingCard from "../../components/booking/Booking";

const BookingStatusDetails: FC<{ status: BookingStatus[] }> = observer(
  ({ status = [] }) => {
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
              `/api/bookings/fromDriver/${ClientStore.key}?${status
                .map((s) => `status=${s}`)
                .join("&")}`
            )
          );

          setBookings(
            bookings.filter((booking) => booking.driver === ClientStore.key)
          );
          setLoading(false);
        }
      })();
    }, [ClientStore.key, status]);

    return (
      <>
        <Segment>
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
        </Segment>
      </>
    );
  }
);

const Deliveries: FC = () => {
  return (
    <div style={{ width: "min(768px, 80%)", margin: "auto" }}>
      <BookingStatusDetails
        status={[
          BookingStatus.PENDING,
          BookingStatus.TO_PICK_UP,
          BookingStatus.TO_DROP_OFF,
        ]}
      />
    </div>
  );
};

export default Deliveries;
