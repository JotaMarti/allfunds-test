import { render, screen, waitFor, shallow, Mount } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Allfunds news APP', () => {

  it("Should render the APP", () => {
    render(<App />);
    const archivedButton = screen.getByText(/ARCHIVED/i);
    expect(archivedButton).toBeInTheDocument();
  })

  it("Should show archived new when archive button is pressed (This only works with default data)", async () => {
    render(<App />);
    const archivedButton = screen.getByText(/ARCHIVED/i);
    userEvent.click(archivedButton)
    setTimeout(function () {
      const archiveNew = screen.getAllByText(/Archived on: 11-2-2010/i);
      expect(archiveNew).toBeInTheDocument();
    }, 500);
  })
});
