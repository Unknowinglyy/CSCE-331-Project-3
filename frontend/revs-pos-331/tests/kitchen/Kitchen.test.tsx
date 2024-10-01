import React, {act} from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../../src/app/kitchen/page';
const ticks = [
  {
      "ticketID": 69031,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  },
  {
      "ticketID": 69032,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  },
  {
      "ticketID": 69033,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  },
  {
      "ticketID": 69034,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  },
  {
      "ticketID": 69035,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  },
  {
      "ticketID": 69036,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  },
  {
      "ticketID": 69037,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  },
  {
      "ticketID": 69038,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  },
  {
      "ticketID": 69039,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  },
  {
      "ticketID": 69040,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  },
  {
      "ticketID": 69041,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  },
  {
      "ticketID": 69042,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  },
  {
      "ticketID": 69043,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  },
  {
      "ticketID": 69044,
      "isStarted": 0,
      "isOverdue": 0,
      "isCompleted": 0
  }
]
vi.useFakeTimers(); // Enable fake timers for the test

describe('kitchen page', () => {
  it('render the kitchen page', async() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok:true,
      json: () => Promise.resolve(ticks)
    });
    render(<Home/>);
    await act(() => vi.advanceTimersByTime(5000));
    const heading = screen.getByText('REVs American Grill');
    expect(heading).toBeInTheDocument();
  })
  it('render the kitchen page', async() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok:true,
      json: () => Promise.resolve(ticks)
    });
    render(<Home/>);
    await act(() => vi.advanceTimersByTime(5000));
    const heading = screen.getByText('REVs American Grill');
    expect(heading).toBeInTheDocument();
    const beginButton = screen.getAllByText('Begin');
    
  })
})
describe('Home (handleStatusChange)', () => {
  it('should update status, set timer, and update to overdue if needed', async () => {
    // Mock functions 
    const mockChangeStatus = vi.fn();
    const mockGetCookTime= vi.fn().mockResolvedValue(30); // Assuming 30 seconds cook time

    // Render your component
    render(<Home changeStatus={mockChangeStatus} getCookTime={mockGetCookTime} />);
    await act(() => vi.advanceTimersByTime(10000)); // Advance timers to fetch data
    // Find the button
    screen.debug();
    const beginButton = screen.getAllByRole('button', { name: 'Begin' });

    // Initial check
    // expect(mockChangeStatus).not.toHaveBeenCalled();

    // Click the button
    await fireEvent.click(beginButton[0]);

    // Assertions after the click
    // expect(mockChangeStatus).toHaveBeenCalledWith(expect.any(Number), 'inProgress');

    // Advance timers for the cook time
    await act(() => vi.advanceTimersByTime(30000)); 

    // Check if status changes to 'overdue'
    // expect(mockChangeStatus).toHaveBeenCalledWith(expect.any(Number), 'overdue');

    // Restore real timers for other tests
    vi.useRealTimers();
  });
});