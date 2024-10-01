[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/ttC5_kKh)

Project: Rev’s Grill POS System

Sprint Number: 03

Sprint Dates: 04/14/2024 - 04/28/2024

Team Members: Sam Bush, Dong Ha Cho, Blake Dejohn, Nicholas Petersilge, Shantanu Raghavan

Sprint Goal:

Now that most features have been implemented, the focus of this sprint is to apply finishing touches to the work of previous sprints. We have to
add accessibility features, improve styling, add the admin page, and perhaps some pages that are proactively improving the user experience.
We also must perform testing using an automated framework or something of that nature, and that should close out our sprint.


Sprint Backlog:
- [x] Task: Create admin page
- [x] Task: Add order viewing component to employee view
- [x] Task: Allow order viewing component to edit and delete orders
- [x] Task: Allow user to add/modify inventory items
- [x] Task: Implement functionality to view menu items in order of decreasing popularity
- [x] Task: Create a log of order operations(deletion, adding)
- [x] Task: Make login more robust, modify UI
- [x] Task: Add images to menu on customer page
- [x] Task: Make high contrast text/buttons
- [x] Task: Add alt-text and ARIA attributes
- [x] Task: Add a background pattern
- [x] Task: Add magnifier API
- [x] Task: Test manager page functions
- [x] Task: Test customer page functions
- [x] Task: Test cashier page functions
- [x] Task: Test admin page functions




Sprint Number: 02

Sprint Dates: 03/31/2024 - 04/14/2024

Team Members: Sam Bush, Dong Ha Cho, Blake Dejohn, Nicholas Petersilge, Shantanu Raghavan

Sprint Goal

We aim to create a functional customer interface that enables users to browse menu items by category, add items to a cart, modify their cart, and seamlessly place orders. In order to do this, we must also establish the core database structure and connectivity to support the customer-facing interface and order management.

Spring Backlog

1. Cashier Page

- [x] Task: Design frontend interfaces for item display
- [x] Task: Design frontend interfaces for adding items
- [x] Task: Design frontend interfaces to view and modify current order
- [x] Task: Add POST request to update database with new order

2. Third-Party APIs
- [x] Task: Implement Google OAuth for logging in to different profiles.
- [x] Task: Implement weather API to display weather on customer self-checkout page.
- [x] Task: Implement translation API to translate self-checkout page
 
3. Manager page

- [x] Task: Create frontend interface for manager to modify menu items
- [x] Task: Create API calls from frontend to update menu item
- [x] Task: Create frontend interface for manager to create a new menu item
- [x] Task: Create API calls from frontend to update database with inputted data
- [x] Task: Create API calls from frontend to fetch inventory stock data
- [x] Task: Use fetched data from API to update GUI to stock data
- [x] Task: Create API calls from frontend to update inventory stock data
- [x] Task: Create frontend design for manager to view a visualized representation of excess ingredient usage data
- [x] Task: Create API calls from the frontend to fetch excess ingredient usage data
- [x] Task: Use fetched data from API to create a visualization of excess ingredient usage data
- [x] Task: Create frontend design for manager to view a visualization of commonly ordered item pairs
- [x] Task: Create API calls from frontend to fetch commonly ordered pairs data
- [x] Task: Use fetched data from API to create a visualization of commonly ordered item pairs data

4. Previous Sprint Backlog:
- [x] Task: Develop the PATCH endpoint to update inventory stock after order placement.
- [x] Task: Develop the POST endpoint for submitting new orders.




Project: Rev’s Grill POS System

Sprint Number: 01

Sprint Dates: 03/18/2024 - 03/29/2024

Team Members: Sam Bush, Dong Ha Cho, Blake Dejohn, Nicholas Petersilge, Shantanu Raghavan

Sprint Goal

We aim to create a functional customer interface that enables users to browse menu items by category, add items to a cart, modify their cart, and seamlessly place orders. In order to do this, we must also establish the core database structure and connectivity to support the customer-facing interface and order management.

Sprint Backlog

1. User Interface Design and Development

- [x] Task: Design frontend interfaces for category selection and dynamic menu display.

- [x] Task: Design frontend interfaces for cart viewing, adding/removing items, and modification.

- [x] Task: Implement and connect frontend designs to fetch and display menu items from the backend.

2. Database Design and Implementation

- [x] Task: Design and create tables for:
Orders,
Food Items, and
Ingredients

- [x] Task: Design relationships between tables, ensuring data integrity and efficient querying.

- [x] Task: Populate the database with initial data (as needed).

3. Backend Connectivity and API Endpoints

- [x] Task: Develop the GET endpoint to retrieve the entire menu.

- [x] Task: Develop the GET endpoint to fetch menu items filtered by category.

- [x] Task: Develop the POST endpoint for submitting new orders.

- [x] Task: Develop the PATCH endpoint to update inventory stock after order placement.

- [x] Task: Establish backend connectivity to the database for data retrieval and updates.



