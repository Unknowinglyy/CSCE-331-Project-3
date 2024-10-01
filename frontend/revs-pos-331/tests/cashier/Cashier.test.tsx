import React, {act} from 'react';
import { render, screen, waitFor,fireEvent } from '@testing-library/react';
import Home  from '../../src/app/cashier/page';
const foods=[
  {
      "foodID": 5,
      "name": "Three Tender Basket",
      "price": 9.8,
      "foodType": "Baskets",
      "onmenu": 1,
      "startmonth": null,
      "endmonth": null,
      "temperature": null
  },
  {
      "foodID": 6,
      "name": "Four Steak Finger Basket",
      "price": 9.59,
      "foodType": "Baskets",
      "onmenu": 1,
      "startmonth": null,
      "endmonth": null,
      "temperature": ""
  },
  {
      "foodID": 23,
      "name": "Shake",
      "price": 10,
      "foodType": "Beverages",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 22,
      "name": "Fountain Drink",
      "price": 7,
      "foodType": "Beverages",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 324,
      "name": "GOod Burger",
      "price": 12.15,
      "foodType": "Burger",
      "onmenu": 1,
      "startmonth": null,
      "endmonth": null,
      "temperature": "Hot"
  },
  {
      "foodID": 323,
      "name": "Gooder Burger",
      "price": 12.11,
      "foodType": "Burger",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": "Hot"
  },
  {
      "foodID": 315,
      "name": "Seasonal Sandwich",
      "price": 12.99,
      "foodType": "Burgers",
      "onmenu": 1,
      "startmonth": null,
      "endmonth": null,
      "temperature": "Cold"
  },
  {
      "foodID": 3,
      "name": "Classic Burger",
      "price": 10.47,
      "foodType": "Burgers",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 4,
      "name": "Bacon Cheese Burger",
      "price": 10.99,
      "foodType": "Burgers",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 327,
      "name": "Test Food",
      "price": 1,
      "foodType": "Burgers",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": ""
  },
  {
      "foodID": 2,
      "name": "Double Stack Cheeseburger",
      "price": 17.79,
      "foodType": "Burgers",
      "onmenu": 1,
      "startmonth": null,
      "endmonth": null,
      "temperature": null
  },
  {
      "foodID": 1,
      "name": "Rev's Burger",
      "price": 15.59,
      "foodType": "Burgers",
      "onmenu": 1,
      "startmonth": null,
      "endmonth": null,
      "temperature": null
  },
  {
      "foodID": 322,
      "name": "Cold Sandwich",
      "price": 12.31,
      "foodType": "Sandwich",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 10,
      "name": "Grilled Cheese",
      "price": 8.49,
      "foodType": "Sandwiches",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 9,
      "name": "Classic Chicken Sandwich",
      "price": 10.79,
      "foodType": "Sandwiches",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 8,
      "name": "Spicy ranch chicken sandwich",
      "price": 12.99,
      "foodType": "Sandwiches",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 7,
      "name": "Gig 'Em Patty Melt",
      "price": 10.29,
      "foodType": "Sandwiches",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 20,
      "name": "BBQ",
      "price": 3,
      "foodType": "Sauces",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 17,
      "name": "Buffalo",
      "price": 3,
      "foodType": "Sauces",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 16,
      "name": "Gigem Sauce",
      "price": 3,
      "foodType": "Sauces",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 21,
      "name": "Honey Mustard",
      "price": 3,
      "foodType": "Sauces",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 12,
      "name": "Onion Rings",
      "price": 5,
      "foodType": "Sides",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 15,
      "name": "Fries",
      "price": 5,
      "foodType": "Sides",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 326,
      "name": "Out Of Season Side",
      "price": 0,
      "foodType": "Sides",
      "onmenu": 1,
      "startmonth": 20240529,
      "endmonth": 20240801,
      "temperature": ""
  },
  {
      "foodID": 325,
      "name": "Seasonal Side",
      "price": 0,
      "foodType": "Sides",
      "onmenu": 1,
      "startmonth": 20240321,
      "endmonth": 20240529,
      "temperature": ""
  },
  {
      "foodID": 11,
      "name": "Tater tots",
      "price": 5,
      "foodType": "Sides",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  },
  {
      "foodID": 13,
      "name": "Kettle Chips",
      "price": 5,
      "foodType": "Sides",
      "onmenu": 1,
      "startmonth": 0,
      "endmonth": 0,
      "temperature": null
  }
]
describe('cashier page', () => {

  it('render the cashier page', () => {
   
    act(() => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        json: () => Promise.resolve(foods)
      });
      render(<Home/>);
    })
  
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
  it('renders items properly', async() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve(foods)
    });
    act(() => {
      render(<Home/>);
    })
    await waitFor(() => expect(foods).toEqual(foods)); 
  })
  it('updates quantities properly', async() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve(foods)
    });
    act(() => {
      render(<Home/>);
    })
    await waitFor(() => expect(foods).toEqual(foods)); 
    const inputButton = screen.getAllByTestId('addInput');
    await fireEvent.click(inputButton[0]);
    const inputButtonDecrease = screen.getAllByTestId('removeInput');
    await fireEvent.click(inputButtonDecrease[0]);
    const quantityInputs = screen.getAllByTestId('quantityInput');
    await fireEvent.change(quantityInputs[0], { target: { value: '5' } }); 
    const quantityDecreaseInputs = screen.getAllByTestId('quantityDecreaseInput');
    await fireEvent.change(quantityDecreaseInputs[0], { target: { value: '5' } }); 
    await fireEvent.change(quantityInputs[0], { target: { value: '55' } }); 
    const finishButton = screen.getByText('Finish Order');
    await fireEvent.click(finishButton);


  })
})
