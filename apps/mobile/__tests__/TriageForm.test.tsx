import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { TriageForm } from "@/src/components/triage/TriageForm";

const NAME_PLACEHOLDER = "Enter patient full name";
const CONDITION_PLACEHOLDER =
  "Describe the patient’s condition, symptoms, injuries, etc.";

describe("TriageForm (multi-step)", () => {
  it("gates step 1 → step 2 and submits the collected values", async () => {
    const onSubmit = jest.fn();
    const screen = render(<TriageForm onSubmit={onSubmit} />);

    // Step 1: Continue is disabled until name + condition are filled.
    const cont = screen.getByRole("button", { name: "Continue" });
    expect(cont).toBeDisabled();

    fireEvent.changeText(screen.getByPlaceholderText(NAME_PLACEHOLDER), "John Kamau");
    fireEvent.changeText(
      screen.getByPlaceholderText(CONDITION_PLACEHOLDER),
      "Chest pain and shortness of breath"
    );
    await waitFor(() => expect(cont).toBeEnabled());
    fireEvent.press(cont);

    // Step 2: Save & Submit disabled until priority + status chosen.
    const submit = await screen.findByRole("button", { name: "Save & Submit" });
    expect(submit).toBeDisabled();

    fireEvent.press(screen.getByRole("button", { name: "Priority 1 Critical" }));
    fireEvent.press(screen.getByRole("button", { name: "In-Transit" }));

    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.press(submit);

    // A confirmation dialog is shown first; nothing is saved until confirmed.
    const confirm = await screen.findByRole("button", { name: "Submit Record" });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.press(confirm);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      patientName: "John Kamau",
      conditionDescription: "Chest pain and shortness of breath",
      priorityLevel: 1,
      status: "In-Transit",
    });
  });

  it("cancels the confirmation dialog without submitting", async () => {
    const onSubmit = jest.fn();
    const screen = render(<TriageForm onSubmit={onSubmit} />);

    fireEvent.changeText(screen.getByPlaceholderText(NAME_PLACEHOLDER), "Jane Doe");
    fireEvent.changeText(
      screen.getByPlaceholderText(CONDITION_PLACEHOLDER),
      "Fractured wrist"
    );
    const cont = screen.getByRole("button", { name: "Continue" });
    await waitFor(() => expect(cont).toBeEnabled());
    fireEvent.press(cont);

    fireEvent.press(await screen.findByRole("button", { name: "Priority 3 Urgent" }));
    fireEvent.press(screen.getByRole("button", { name: "Pending" }));

    const submit = await screen.findByRole("button", { name: "Save & Submit" });
    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.press(submit);

    fireEvent.press(await screen.findByRole("button", { name: "Review again" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("keeps Continue disabled when the patient name is blank", async () => {
    const onSubmit = jest.fn();
    const screen = render(<TriageForm onSubmit={onSubmit} />);

    fireEvent.changeText(
      screen.getByPlaceholderText(CONDITION_PLACEHOLDER),
      "Chest pain"
    );

    const cont = screen.getByRole("button", { name: "Continue" });
    await waitFor(() => expect(cont).toBeDisabled());
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
