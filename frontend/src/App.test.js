import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

describe('Allfunds news APP', () => {

  it("Should render the APP", () => {
    render(<App />);
    const archivedButton = screen.getByText(/ARCHIVED/i);
    expect(archivedButton).toBeInTheDocument();
  })

  it("Should render the app and display the normal news)", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("normal-new-1")).toBeInTheDocument()
    })
  })

  it("Should render the app and display the archived news)", async () => {
    render(<App />);
    const archivedButton = screen.getByText(/ARCHIVED/i);
    fireEvent.click(archivedButton)
    await waitFor(() => {
      expect(screen.getByTestId("archived-new-1")).toBeInTheDocument()
    });
  })
});