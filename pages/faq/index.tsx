import React, { FC, useState } from "react";
import { Accordion, Header, Icon, Segment } from "semantic-ui-react";

const QnA = [
  {
    question: "Making a booking",
    answer: [
      "Enter package's details (Weight, Lenght, Height, Weight, ...)",
      "Enter pickup and dropoff locations",
      "Select payment method, and confirm the total fee by clicking 'Book'",
      "Wait for a driver to be assigned to your package",
    ],
  },
  {
    question: "What does ETA (Estimated Time of Arrival) mean?",
    answer: [
      "Book n' Go provides an ETA for when your driver should arrive at your given pickup location.",
      "After picking up the items you provided, Book n' Go provides an ETA for when your driver should arrive at the given drop off location. ",
      "Please take note that ETA are only estimates and cannot be guaranteed. Differents factors like a heavy traffic and inclement weather can affect and delay your delivery.",
    ],
  },
  {
    question: "Editing my order",
    answer: [
      "If you want to edit the details on your order, just call to our customer service 8008 8008 at working hour.",
    ],
  },
  {
    question: "What is Book n' Go operating hours?",
    answer: [
      "Book n' Go operates 24/7 in able for users to place an order anytime of the day. For more enquiries, Book n' Go's customer service team operating details are as follows:",
      "Monday - Friday: 8:00AM - 7:30PM",
      "Saturday - Sunday: 9:00AM - 6:00PM",
    ],
  },
];

const FAQ: FC = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  return (
    <div style={{ width: "min(768px, 80%)", margin: "auto", height: "100%" }}>
      <Segment>
        <Header as="h2">Frequently Asked Questions</Header>
        <Accordion styled fluid>
          {QnA.map(({ question, answer }, idx) => {
            return (
              <React.Fragment key={idx}>
                <Accordion.Title
                  active={activeIndex === idx}
                  index={idx}
                  onClick={() => {
                    setActiveIndex(activeIndex === idx ? -1 : idx);
                  }}
                >
                  <Icon name="dropdown" />
                  {question}
                </Accordion.Title>
                <Accordion.Content active={activeIndex === idx}>
                  {answer.map((ans, idx2) => (
                    <p key={idx2}>{ans}</p>
                  ))}
                </Accordion.Content>
              </React.Fragment>
            );
          })}
        </Accordion>
      </Segment>
    </div>
  );
};

export default FAQ;
