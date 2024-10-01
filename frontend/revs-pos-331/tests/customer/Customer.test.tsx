import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../src/app/customer/page';
import userEvent from '@testing-library/user-event';

describe('customer page', () => {

  it('render the customer page', () => {
    render(<Home/>);
    
    const recommend = screen.getByText('Recomended Foods');
    expect(recommend).toBeInTheDocument();

    const burgers = screen.getByText('Burgers');
    expect(burgers).toBeInTheDocument();

    const sandwiches = screen.getByText('Sandwiches');
    expect(sandwiches).toBeInTheDocument();

    const sides = screen.getByText('Sides');
    expect(sides).toBeInTheDocument();

    const sauces = screen.getByText('Sauces');
    expect(sauces).toBeInTheDocument();

    const beverages = screen.getByText('Beverages');
    expect(beverages).toBeInTheDocument();
  })

  it('can click the order button', async () => {
    render(<Home/>);
    const order = screen.getByText('View My Order');
    const user = userEvent.setup();
    await user.click(order);
    expect(screen.getByText('Cancel Order')).toBeInTheDocument();
  })
})