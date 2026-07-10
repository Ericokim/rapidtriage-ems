import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { TriageForm } from "@/src/components/triage/TriageForm";

const NAME_PLACEHOLDER = "Enter patient full name";
const CONDITION_PLACEHOLDER =
  "Describe the patient’s condition, symptoms, injuries, etc.";

describe("TriageForm", () => {
  it("keeps submit disabled until valid, then submits the values", async () => {
    const onSubmit = jest.fn();
    const screen = render(<TriageForm onSubmit={onSubmit} />);

    const submit = screen.getByRole("button", { name: "Save & Submit" });
    expect(submit).toBeDisabled();

    fireEvent.changeText(
      screen.getByPlaceholderText(NAME_PLACEHOLDER),
      "John Kamau"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText(CONDITION_PLACEHOLDER),
      "Chest pain and shortness of breath"
    );
    fireEvent.press(screen.getByRole("button", { name: "Priority 1 Critical" }));
    fireEvent.press(screen.getByRole("button", { name: "In-Transit" }));

    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.press(submit);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      patientName: "John Kamau",
      conditionDescription: "Chest pain and shortness of breath",
      priorityLevel: 1,
      status: "In-Transit",
    });
  });

  it("shows an inline error when the patient name is cleared", async () => {
    const onSubmit = jest.fn();
    const screen = render(<TriageForm onSubmit={onSubmit} />);

    const nameInput = screen.getByPlaceholderText(NAME_PLACEHOLDER);
    fireEvent.changeText(nameInput, "John");
    fireEvent.changeText(nameInput, "");

    await waitFor(() =>
      expect(screen.getByText("Patient name is required.")).toBeTruthy()
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
