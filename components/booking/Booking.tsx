import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { Item, Label, List, Loader, Segment } from "semantic-ui-react";
import {
  getEndpoint,
  handleRedirectButton,
  makeLabel,
} from "../../frontend/util";
import {
  BookingDetailsExtendend,
  BookingStatus,
} from "../../shared/types/Booking";
import axios from "axios";
import MapInput from "../MapInput";
import DotLoading from "../DotLoading";

const BookingCard: FC<{ id?: string; details?: BookingDetailsExtendend }> = ({
  id,
  details,
}) => {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetailsExtendend>();

  useEffect(() => {
    (async () => {
      if (details) {
        setBooking(details);
      } else if (id) {
        const {
          data: { booking },
        } = await axios.get<{ booking: BookingDetailsExtendend }>(
          getEndpoint(`/api/booking/${id}`)
        );

        setBooking(booking);
      }
    })();
  }, [id, details]);

  return (
    <Item fluid="true">
      <Item.Content>
        {booking ? (
          <>
            <Item.Header>
              <List.Item>
                <span
                  style={{ paddingRight: 5, cursor: "pointer" }}
                  onClick={handleRedirectButton(
                    router,
                    `/booking/${booking.id}`
                  )}
                >
                  {booking.pickUp.name}
                </span>
                {makeLabel(
                  booking.status,
                  booking.status.toUpperCase().replaceAll("_", " ")
                )}
                {makeLabel(
                  booking.paymentMethod,
                  booking.paymentMethod,
                  `${booking.totalFee} PHP`
                )}
              </List.Item>
            </Item.Header>
            <Item.Meta>
              {booking.pickUp.address} → {booking.dropOut.address}
            </Item.Meta>
            <Item.Description>
              <List>
                <List.Item>
                  <Label>
                    Sender
                    <Label.Detail>
                      <span
                        style={{ paddingRight: 5, cursor: "pointer" }}
                        onClick={handleRedirectButton(
                          router,
                          `/profile/personal/${booking.owner}`
                        )}
                      >
                        {booking.owner}
                      </span>
                    </Label.Detail>
                  </Label>
                  {booking.status !== BookingStatus.CANCELLED ? (
                    <Label>
                      Driver
                      <Label.Detail>
                        {booking.driver ? (
                          <span
                            style={{ paddingRight: 5, cursor: "pointer" }}
                            onClick={handleRedirectButton(
                              router,
                              `/profile/driver/${booking.driver}`
                            )}
                          >
                            {booking.driver}
                          </span>
                        ) : (
                          <i>
                            Assigning
                            <DotLoading length={5} />
                          </i>
                        )}
                      </Label.Detail>
                    </Label>
                  ) : null}
                </List.Item>
                <List.Item>
                  <Label>
                    Width
                    <Label.Detail>{booking.width}cm</Label.Detail>
                  </Label>
                  <Label>
                    Length
                    <Label.Detail>{booking.length}cm</Label.Detail>
                  </Label>
                  {booking.height ? (
                    <Label>
                      Height
                      <Label.Detail>{booking.height}cm</Label.Detail>
                    </Label>
                  ) : null}
                  <Label>
                    Weight
                    <Label.Detail>{booking.weight}kg</Label.Detail>
                  </Label>
                </List.Item>
                {booking.specialPackaging.length > 0 ? (
                  <List.Item>
                    {booking.specialPackaging.map((packaging) =>
                      makeLabel(
                        packaging,
                        packaging.toUpperCase().replaceAll("_", " ")
                      )
                    )}
                  </List.Item>
                ) : null}
                {booking.pickUp.notes ? (
                  <List.Item>
                    <Label color="orange" basic horizontal>
                      Pick Out Note
                      <Label.Detail>{booking.pickUp.notes}</Label.Detail>
                    </Label>
                  </List.Item>
                ) : null}
                {booking.dropOut.notes ? (
                  <List.Item>
                    <Label color="orange" basic horizontal>
                      Drop Off Note
                      <Label.Detail>{booking.dropOut.notes}</Label.Detail>
                    </Label>
                  </List.Item>
                ) : null}
              </List>
            </Item.Description>
          </>
        ) : (
          <Segment>
            <Item.Meta>
              <div style={{ color: "transparent" }}>
                {`-------------------------------------------------------------------------------------------------------------------------------`}
              </div>
            </Item.Meta>
            <Item.Description>
              <Loader active inline="centered">
                {`Fetching Booking ID: "${id}"`}
              </Loader>
            </Item.Description>
          </Segment>
        )}
      </Item.Content>
    </Item>
  );
};

export default BookingCard;
