import React, {act} from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Admin from '../../src/app/admin/page';
import axios from 'axios';
import jest from 'jest-mock';
import userEvent from '@testing-library/user-event';

const users = [
  {
    "id": 749,
    "name": "Fake",
    "email": "",
    "permissions": 3
  },
  {
    "id": 74,
    "name": "Blake",
    "email": "unknowinglyyy@gmail.com",
    "permissions": 3
  },
  {
    "id": 14,
    "name": "Shantanu Raghavan",
    "email": "sr613416@tamu.edu",
    "permissions": 2
  },
  {
    "id": 75,
    "name": "Shanty",
    "email": "UFOSHANTANU@GMAIL.COM",
    "permissions": 3
  },
  {
    "id": 15,
    "name": "Shantanu Raghavan",
    "email": "shantanuraghavan1@gmail.com",
    "permissions": 4
  },
  {
    "id": 1,
    "name": "Blake",
    "email": "dejohnblake@gmail.com",
    "permissions": 4
  },
  {
    "id": 6,
    "name": "Blake Dejohn",
    "email": "unknowingly@tamu.edu",
    "permissions": 4
  },
  {
    "id": 41,
    "name": "Nicholas Petersilge",
    "email": "nap2736@tamu.edu",
    "permissions": 4
  },
  {
    "id": 12,
    "name": "Dong Ha Cho",
    "email": "donghatamu@tamu.edu",
    "permissions": 4
  },
  {
    "id": 2,
    "name": "Samuel Bush",
    "email": "samuelkbush@tamu.edu",
    "permissions": 4
  }
]
vi.mock('axios');
vi.mock('frontend/revs-pos-331/src/app/admin/page.tsx')
beforeEach(() => {
  vi.clearAllMocks();
})

describe('admin page', () => {

  it('render the admin page', () => {
    act(() => {
      render(<Admin />);
    })
   
    const heading = screen.getByText('Welcome to the Admin Page!');
    expect(heading).toBeInTheDocument();
  })

  it('get api request', async() => {
    // const users = [{id: 1, name: 'test', email: 'test@example.com', permissions: 2}, {id: 2, name: 'test2', email: 'test@example.com', permissions: 3}]
    act(() => {
      vi.spyOn(axios, 'get').mockResolvedValue({data: users});
      render(<Admin />);
    })
    // render(<Admin />);
    await waitFor(() => expect(users).toEqual(users)); 
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Samuel Bush')).toBeInTheDocument();
    expect(screen.getByText('dejohnblake@gmail.com')).toBeInTheDocument();
    
  })
  it("edit button test", async() =>{
    act(() => {
      vi.spyOn(axios, 'get').mockResolvedValue({data: users});
      render(<Admin />);
    })
    // render(<Admin />);
    await waitFor(() => expect(users).toEqual(users)); 
    const edit = screen.getAllByText(/Edit/i);
    const user = userEvent.setup();
    await user.click(edit[0]);
    expect(screen.getByText('Edit User')).toBeInTheDocument();

  })
  it("close button test", async() =>{
    act(() => {
      vi.spyOn(axios, 'get').mockResolvedValue({data: users});
      
      render(<Admin />);
    })
    // render(<Admin />);
    await waitFor(() => expect(users).toEqual(users)); 
    const edit = screen.getAllByText(/Edit/i);
    const user = userEvent.setup();
    await user.click(edit[0]);
    expect(screen.getByText('Edit User')).toBeInTheDocument();
    const close = screen.getByText('Close');
    await user.click(close);
  })
  it("DELETE button test good", async() =>{
    act(() => {

      const user  ={
        "id": 78,
        "name": "example",
        "email": "example@gmail.com",
        "permissions": 3
    }
      vi.spyOn(axios, 'delete').mockResolvedValue({data: user, status:200 });
      render(<Admin />);
    })
    // render(<Admin />);
    await waitFor(() => expect(users).toEqual(users)); 
    const deleteButton = screen.getAllByText(/Delete/i);
    const user = userEvent.setup();
    await user.click(deleteButton[0]);
  })
  it("add button test", async() =>{
    act(() => {
      render(<Admin />);
    })
    // render(<Admin />);
    await waitFor(() => expect(users).toEqual(users)); 
    const edit = screen.getAllByText(/Edit/i);
    const user = userEvent.setup();
    await user.click(edit[0]);
    const update = screen.getByText("Update User")
    user.click(update);

  })
  it("update button test", async() =>{
    act(() => {
      vi.spyOn(axios, 'get').mockResolvedValue({data: users});
      const mockResponse = { data: { id:32, name:"example",email:"test@example.com",permissions:3 }, status: 200 };
      vi.spyOn(axios, 'post').mockResolvedValue(mockResponse);
      render(<Admin />);
    })
    // render(<Admin />);
    await waitFor(() => expect(users).toEqual(users)); 
    const nameInput = screen.getByPlaceholderText('Enter Name');
    await fireEvent.change(nameInput, { target: { value: 'Test User' } }); 

    const emailInput = screen.getByPlaceholderText('Enter Email');
    await fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const selectElement = screen.getByTestId('user-permissions-select');
    await fireEvent.change(selectElement, { target: { value: '2' } }); // Select Cashier

    // Find and click the submit button
    const submitButton = screen.getByRole('button', { name: 'Add User' }); 
    await fireEvent.click(submitButton);
    screen.debug();
    expect(axios.post).toHaveBeenCalledWith(
      '../api/addUser',
      {
        userName: 'Test User',
        userEmail: 'test@example.com',
        userPermissions: 2,
      }
    );   
  })
  

  
})