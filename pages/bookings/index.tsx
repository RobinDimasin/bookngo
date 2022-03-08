import { FC, useMemo } from "react";
import { BookingStatus } from "../../shared/types/Booking";
import { observer } from "mobx-react";
import { Item, Tab } from "semantic-ui-react";
import BookingStatusDetails from "../../components/booking/BookingStatusDetails";

const makePane = (name: string, bookingStatus: BookingStatus[]) => {
  return {
    key: name,
    menuItem: name,
    pane: (
      <Tab.Pane key={name}>
        <BookingStatusDetails status={bookingStatus} />
      </Tab.Pane>
    ),
  };
};

const Bookings: FC = () => {
  const panes = useMemo(() => {
    return [
      makePane("Pending", [BookingStatus.PENDING]),
      makePane("To Pick Up", [BookingStatus.TO_PICK_UP]),
      makePane("To Drop Off", [BookingStatus.TO_DROP_OFF]),
      makePane("Completed", [BookingStatus.COMPLETED]),
      // makePane("Failed", [BookingStatus.FAILED]),
      makePane("Cancelled", [BookingStatus.CANCELLED]),
    ];
  }, []);

  return (
    <div style={{ width: "min(768px, 80%)", margin: "auto" }}>
      <Tab panes={panes} renderActiveOnly={false} />
    </div>
  );
};

export default observer(Bookings);
