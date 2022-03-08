import { FC, FormEvent, useEffect, useState } from "react";
import {
  Button,
  Form,
  FormProps,
  Icon,
  Segment,
  Step,
} from "semantic-ui-react";
import { useStore } from "../frontend/store";

const MultiStageForm: FC<{
  stages: {
    stepContent: JSX.Element;
    content: JSX.Element;
    isCompleted: () => boolean;
    onLoad: () => void;
  }[];
  onSubmit?: (event: FormEvent<HTMLFormElement>, data: FormProps) => void;
  submitButton: (isDisabled: boolean) => JSX.Element;
}> = ({ stages, onSubmit = () => {}, submitButton }) => {
  const { ClientStore } = useStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    stages[currentStepIndex].onLoad();
  }, [currentStepIndex, stages]);

  return (
    <>
      <Step.Group ordered horizontal fluid>
        {stages.map((stage, idx) => {
          return (
            <Step
              key={idx}
              completed={idx < currentStepIndex}
              active={currentStepIndex === idx}
              disabled={currentStepIndex < idx}
            >
              {stage.stepContent}
            </Step>
          );
        })}
      </Step.Group>
      <Segment>
        <div style={{ marginBottom: "10px" }}>
          <Form onSubmit={onSubmit}>
            {stages.map((stage, idx) => {
              return (
                <div
                  key={idx}
                  style={{
                    ...(currentStepIndex !== idx
                      ? {
                          visibility: "hidden",
                          position: "absolute",
                          top: -9999,
                        }
                      : {}),
                  }}
                >
                  {stage.content}
                </div>
              );
            })}
          </Form>
        </div>
        <Button
          onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
          disabled={currentStepIndex <= 0}
        >
          <Icon name="arrow left" />
          Previous
        </Button>
        <Button
          onClick={() =>
            setCurrentStepIndex(
              Math.min(stages.length - 1, currentStepIndex + 1)
            )
          }
          disabled={
            currentStepIndex >= stages.length - 1 ||
            !stages[currentStepIndex].isCompleted()
          }
        >
          Next
          <Icon name="arrow right" />
        </Button>
        {currentStepIndex >= stages.length - 1 &&
          submitButton(currentStepIndex < stages.length - 1)}
      </Segment>
    </>
  );
};

export default MultiStageForm;
