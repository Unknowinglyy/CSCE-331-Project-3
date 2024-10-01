import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Router from 'next/router';
import { it, expect, describe } from 'vitest';
import Home from "../../src/app/manager/page";
import * as jest from 'jest';
import { mock } from 'node:test';
import AddFoodForm from '../../src/app/manager/AddFoodForm';
import react from "@vitejs/plugin-react";
import userEvent from '@testing-library/user-event';
import { Main } from 'next/document';
import fetch from 'node-fetch'; 

const menu= [
    {
        "foodID": 328,
        "name": "",
        "price": 0,
        "foodType": "",
        "onmenu": 1,
        "startmonth": 0,
        "endmonth": 0,
        "temperature": ""
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
        "foodID": 13,
        "name": "Kettle Chips",
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
    }
  ]
const inventory = [
    {
        "ingredientID": 1,
        "name": "Burger Patty",
        "stock": 30
    },
    {
        "ingredientID": 2,
        "name": "Cheese",
        "stock": 137
    },
    {
        "ingredientID": 3,
        "name": "Gigem Sauce",
        "stock": 44
    },
    {
        "ingredientID": 4,
        "name": "Buns",
        "stock": 30
    },
    {
        "ingredientID": 5,
        "name": "Pickles",
        "stock": 54
    },
    {
        "ingredientID": 6,
        "name": "Lettuce",
        "stock": 255
    },
    {
        "ingredientID": 7,
        "name": "Tomato",
        "stock": 250
    },
    {
        "ingredientID": 8,
        "name": "Onion",
        "stock": 169
    },
    {
        "ingredientID": 9,
        "name": "Bacon",
        "stock": 256
    },
    {
        "ingredientID": 10,
        "name": "Chicken Tender",
        "stock": 258
    },
    {
        "ingredientID": 11,
        "name": "French Fries",
        "stock": 292
    },
    {
        "ingredientID": 12,
        "name": "Texas Toast",
        "stock": 198
    },
    {
        "ingredientID": 13,
        "name": "Gravy",
        "stock": 300
    },
    {
        "ingredientID": 14,
        "name": "4x Steak Finger",
        "stock": 300
    },
    {
        "ingredientID": 15,
        "name": "Bun",
        "stock": 131
    },
    {
        "ingredientID": 16,
        "name": "Spicy Ranch Sauce",
        "stock": 293
    },
    {
        "ingredientID": 17,
        "name": "Tater tots",
        "stock": 299
    },
    {
        "ingredientID": 18,
        "name": "Onion Rings",
        "stock": 222
    },
    {
        "ingredientID": 19,
        "name": "Kettle Chips",
        "stock": 299
    },
    {
        "ingredientID": 21,
        "name": "Buffalo",
        "stock": 300
    },
    {
        "ingredientID": 22,
        "name": "Ranch",
        "stock": 300
    },
    {
        "ingredientID": 23,
        "name": "Spicy Tanch",
        "stock": 300
    },
    {
        "ingredientID": 24,
        "name": "BBQ",
        "stock": 300
    },
    {
        "ingredientID": 25,
        "name": "Honey Mustard",
        "stock": 300
    },
    {
        "ingredientID": 26,
        "name": "Fountain Drink",
        "stock": 299
    },
    {
        "ingredientID": 27,
        "name": "Shake",
        "stock": 300
    }
]
describe('ManagerPage', () => {
    it('renders title properly', () => {
        render(
                <Home /> 
          );
        expect(screen.getByText("Revs Grill Management")).toBeDefined();
    });
    it('renders buttons properly', () => {
        // expect(screen.getByText("Home")).toBeDefined();
        render(<Home/>)
        const home = screen.getByRole('link', {name: /home/i});
        expect(home).toBeDefined();
        expect(screen.getByText("View and Edit Menu")).toBeDefined();
        expect(screen.getByText("Add Food Items")).toBeDefined();
        expect(screen.getByText("View Past Orders")).toBeDefined();
        expect(screen.getByText("View Commonly Ordered Pairs")).toBeDefined();
        expect(screen.getByText("View Sales Report")).toBeDefined();
        expect(screen.getByText("View Excess Report")).toBeDefined();
        expect(screen.getByText("View Product Usage Chart")).toBeDefined();


    });
    it("has working view and edit menu Button", async ()=>{
        render(<Home/>)
        const view = screen.getByText('View and Edit Menu');
        const user = userEvent.setup();
        await user.click(view);
        expect(screen.getByText("Menu Modifier")).toBeDefined();
        await user.click(view);

    })
    it("has working addFood Button", async ()=>{
        render(<Home/>)
        const view = screen.getByText('Add Food Items');
        const user = userEvent.setup();
        await user.click(view);
        expect(screen.getByText("Add new food item:")).toBeDefined();
        await user.click(view);

    })
    
    it("has working add new food Button", async ()=>{
        render(<AddFoodForm/>)
        const view = screen.getByRole('button', {name: /Add Food Item/i});
        const user = userEvent.setup();
        await user.click(view);
        expect(screen.getByText("Add Food Item")).toBeDefined();
        await user.click(view);

    })
    it("has working view past orders Button", async ()=>{
        render(<Home/>)
        const view = screen.getByText("View Past Orders")
        const user = userEvent.setup();
        await user.click(view);
        expect(screen.getByText("Choose Ingredient")).toBeDefined();
        await user.click(view);

    })
    it("has working excess report Button", async ()=>{
        render(<Home/>)
        const view = screen.getByText("View Excess Report")
        const user = userEvent.setup();
        await user.click(view);
        expect(screen.getByText("View Excess From Today → Any past Date:")).toBeDefined();
        await user.click(view);

    })
    it("has working commonly ordered pairs Button", async ()=>{
        render(<Home/>)
        const view = screen.getByText("View Commonly Ordered Pairs")
        const user = userEvent.setup();
        await user.click(view);
        expect(screen.getByText("View Items Commonly Sold Together From Start Date → End Date:")).toBeDefined();
        await user.click(view);

    })
    it("has working Sales report Button", async ()=>{
        render(<Home/>)
        const view = screen.getByText("View Sales Report")
        const user = userEvent.setup();
        await user.click(view);
        expect(screen.getByText("Sales Report From Start Date → End Date:")).toBeDefined();
        await user.click(view);

    })
    it("has working product usage chart Button", async ()=>{
        act(() => {
            render(<Home/>)
        })
        
        const view = screen.getByText("View Product Usage Chart")
        const user = userEvent.setup();
        await user.click(view);
        expect(screen.getByText("Load Chart!")).toBeDefined();
        await user.click(view);

    })
    it("has a working menu change form", async()=>{
        vi.spyOn(global, 'fetch').mockResolvedValue({
            json: () => Promise.resolve(menu)
          });
        render(<Home/>);
        await waitFor(() => expect(menu).toEqual(menu));
        const view = screen.getByText('View and Edit Menu');
        const user = userEvent.setup();
        await user.click(view);
        expect(screen.getByText("Menu Modifier")).toBeDefined();
        screen.debug()
        const editButton = screen.getAllByRole('button', {name: /Edit/i});
        await fireEvent.click(editButton[0]);
        const submit = screen.getByRole('button', {name: /Submit/i});
        await fireEvent.click(submit);
        
    })
    // it("has a working menu change form", async()=>{
        
    //       act(() => {
    //         vi.spyOn(global, 'fetch').mockImplementation((input: string | URL | Request, init?: RequestInit | undefined)=> {
    //             if(typeof input == 'string'){
    //                 const url= input;
    //                 if (url.includes('/api/menu')) {
    //                     return Promise.resolve({ json: () => Promise.resolve({ menu: menu }) });
    //                   } else if (url.includes('/api/inventory')) {
    //                     return Promise.resolve({ json: () => Promise.resolve({ items: inventory }) });
    //                   }
    //             }
    //             else{

    //             }
    //             // Handle other URLs or errors as needed
    //           });
    //         render(<ManagerPage/>)
    //       });
    //       screen.debug
    //     await waitFor(() => expect(menu).toEqual(menu));
    //     const view = screen.getByText('View and Edit Menu');
    //     const user = userEvent.setup();
    //     await fireEvent.click(view);
    //     expect(screen.getByText("Menu Modifier")).toBeDefined();
    //     const editButton = screen.getAllByRole('button', {name: /Edit/i});
    //     await fireEvent.click(editButton[0]);
    //     const submit = screen.getByRole('button', {name: /Submit/i});
    //     await fireEvent.click(submit);
    // })
});
