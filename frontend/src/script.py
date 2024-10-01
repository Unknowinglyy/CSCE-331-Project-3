import random

ItemPrice = {
    "Rev's Burger": 15.59,
    "Double Stack CheeseBurger": 17.79,
    "Classic Burger": 10.47,
    "Bacon Cheese Burger": 10.99,
    "Three Tender Basket": 9.79,
    "Four Steak Finger Basket": 10.99,
    "Gig 'Em Patty Melt": 10.29,
    "Spicy ranch chicken sandwich": 12.99,
    "Classic Chicken Sandwich": 10.79,
    "Grilled Cheese": 9.49,
    "Tater tots": 5,
    "Onion Rings": 5,
    "Kettle Chips": 5,
    "Fries": 5,
    "Gigem Sauce": 3,
    "Buffalo": 3,
    "Ranch": 3,
    "Spicy Ranch": 3,
    "BBQ": 3,
    "Honey Mustard": 3,
    "Fountain Drink": 7,
    "Shake": 10
}


itemIndex = {
    "Rev's Burger": 1,
    "Double Stack CheeseBurger": 2,
    "Classic Burger": 3,
    "Bacon Cheese Burger": 4,
    "Three Tender Basket": 5,
    "Four Steak Finger Basket": 6,
    "Gig 'Em Patty Melt": 7,
    "Spicy ranch chicken sandwich": 8,
    "Classic Chicken Sandwich": 9,
    "Grilled Cheese": 10,
    "Tater tots": 11,
    "Onion Rings": 12,
    "Kettle Chips": 13,
    "Fries": 15,
    "Gigem Sauce": 16,
    "Buffalo": 17,
    "Ranch": 18,
    "Spicy Ranch": 19,
    "BBQ": 20,
    "Honey Mustard": 21,
    "Fountain Drink": 22,
    "Shake": 23
}

itemList = ["Ketchup",
            "Mayo",
            "Ranch",
            "Gig em Sauce",
            "Buffalo Sauce",
            "Honey Mustard",
            "Spicy Ranch",
            "Pickles",
            "Patties",
            "Chicken Tenders",
            "Fries",
            "Bun",
            "Lettuce",
            "Tomato",
            "Onion",
            "Vanilla Ice Cream",
            "Chocolate Ice Cream",
            "Strawberry Ice Cream",
            "Brownie",
            "Bacon",
            "Pepper Jack Cheese",
            "Texas Toast",
            "Black Bean Patty",
            "Kettle Chips",
            "Gravy",
            "Onion Rings",
            "Tater Tots",
            "Cold Brew",
            "Coffee Grounds",
            "Cheese",
            "Sesame Buns",
            "Cookie Dough",
            "Flour",
            "Jalapenos",
            "Pepsi Syrup",
            "Starry Syrup",
            "Gatorade Syrup",
            "Dr Pepper Syrup",
            "Diet Pepsi Syrup",
            "Chicken Patty",
            "Potatoes"
            ]

menuFooditems = ["Hamburger",
                 "Rev Burger",
                 "Bacon Burger",
                 "Cheeseburger",
                 "Deluxe Burger"
                 "Chicken Sandwich",
                 "Grilled Chicken Sandwich",
                 "Spicy Chicken Sandwich",
                 "Texas Toast Patty Melt",
                 "",
                 "Cheeseburger",
                 "Chicken Sandwich",
                 "5 Chicken Tenders Box",
                 "3 Chicken Tenders Box",
                 "Salad",
                 "Soda",
                 "Icecream",
                 "Icecream Sundae",
                 "Cookie",
                 "Onion Rings",
                 "Fries"]

payOptions = ["Dining Dollars",
              "Meal Swipes",
              "Card",
              "Cash"]

foodTypes = ["Burger", 
             "Baskets", 
             "Desert", 
             "Sides"]

foodIngredients = {
    "Hamburger": {"Bun": 2, "Patties": 1, "Lettuce": 1, "Tomato": 1, "Onion": 1},
    "Cheeseburger": {"Bun": 2, "Patties": 1, "Lettuce": 1, "Tomato": 1, "Onion": 1, "Cheese": 1},
    "5 Chicken Tenders Box": {"Chicken Tenders": 5, "Fries": 1},
    "3 Chicken Tenders Box": {"Chicken Tenders": 3, "Fries": 1},
    "Onion Rings": {"Onion Rings": 1},
    "Fries": {"Fries": 1}
    # ingredients for other food items to be added later
}
foodIDs = [i for i in range(1, 22)]
with open("fillOrders.sql", "w") as fd:
    # fd.write("CREATE TABLE db("
    #          "Name TEXT PRIMARY KEY,"
    #          "Stock INT);\n")

    # for i in range(len(itemList)):
        
    #     fd.write(f"INSERT INTO ingredient (\"ingredientID\", \"name\", stock)\nVALUES ({i+1}, '{itemList[i]}', {random.randint(0, 150)});\n")

    # filling tickets for 104 weeks (2 years)
    orderID = 1
    
    # ingredientIDMap = {item: i+1 for i, item in enumerate(itemList)}
    # for item in range(40):
    #             fd.write(f"INSERT INTO food (\"foodID\", name, price, \"foodType\")\nVALUES ({foodID}, 'Hamburger', 11.99, 'Burger');\n")

    #             for ingredient, amountRequired in foodIngredients['Hamburger'].items():
    #                 ingredientID = ingredientIDMap[ingredient]
    #                 fd.write(f"INSERT INTO foodIngredient (\"foodID\", \"ingredientID\", amount)\nVALUES ({foodID}, {ingredientID}, {amountRequired});\n")
                
    #             foodID += 1
    for day in range(728):
        numberOfOrders = random.randint(1, 20)

        for orderNum in range(numberOfOrders):
            numItems = random.randint(1, 5)
            totalPrice = 0

            interval = 10 + (10/numberOfOrders)*orderNum
            fd.write(f"INSERT INTO ticket (\"ticketID\", \"timeOrdered\", \"totalCost\", payment)\nVALUES ({orderID}, date (LOCALTIMESTAMP) - {728 - day} + interval '{interval} hour', {totalPrice}, '{payOptions[random.randint(0,3)]}');\n")


            for item in range(numItems):
                pair = key, val = random.choice(list(ItemPrice.items()))
                foodID = itemIndex[key]
                totalPrice += val
                fd.write(f"INSERT INTO foodticket (amount, \"ticketID\", \"foodID\")\nVALUES (1, {orderID}, {foodID});\n")
            interval = 10 + (10/numberOfOrders)*orderNum

            fd.write(f"UPDATE ticket SET \"totalCost\"={totalPrice} where \"ticketID\"={orderID};\n")

            orderID += 1
    # fd.write(f"INSERT INTO food (\"foodID\", name, price, \"foodType\")\nVALUES (69, 'Hamburger', 11.99, 'Burger');\n")
    
