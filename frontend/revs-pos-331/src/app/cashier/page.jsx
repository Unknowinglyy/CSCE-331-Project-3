'use client';
import Link from 'next/link';
import "./cashierpage.css";
import { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter, useDisclosure
} from "@nextui-org/react";
import OrderView from "../components/OrderView";
/**
 * @component Cashier Page Component
 * 
 * Represents the cashier page component, enabling users to manage and finalize the orders.
 * This component handles the lifecycle of an order from item selection to final submission.
 * It fetches available menu items from the API, allows users to modify item quantities,
 * and provides an interface to submit or cancel the order.
 *
 * @returns {JSX.Element} - Returns the Cashier page.
 */
export default function CashierPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [order, setOrder] = useState([]);
    const [inputQuantities, setInputQuantities] = useState({});
    const categories = ["Burgers", "Sandwiches", "Sides", "Sauces", "Beverages"];
    const [showOrders, setShowOrders] = useState(false);
    
    /**
     * Effect hook that triggers fetching of menu items when the component mounts.
     * It sets up initial states for menu items and their order input quantities.
     */

    useEffect(() => {
        fetchMenuItemsForCashier();
    }, []);

    /**
     * Asynchronously fetches available menu items from the server.
     * Filters the received items to ensure they have essential properties (name and price).
     * Initializes the order input quantities for each item to facilitate adding and removing items from the order.
     *
     * @async
     * @function fetchMenuItemsForCashier
     */
    const fetchMenuItemsForCashier = async () => {
        try {
            const response = await fetch('/api/inStockFoods', { method: 'GET' });
            const json = await response.json();
            const validatedItems = json.filter(item => item.name && item.price != null);
            setMenuItems(validatedItems);
            const initialQuantities = {};
            validatedItems.forEach(item => {
                initialQuantities[item.name] = { add: 1, remove: 1 };
            });
            setInputQuantities(initialQuantities);
        } catch (error) {
            console.error("Error fetching menu items:", error);
        }
    };

    /**
     * Handles dynamic changes to the input fields for adding or removing items from the order.
     * Ensures that the quantities remain non-negative.
     *
     * @param {string} itemName - The name of the item being adjusted.
     * @param {number} quantity - The new quantity value for the input field, parsed from the event.
     * @param {string} action - Specifies whether the quantity adjustment is for adding or removing items.
     */
    const handleQuantityChange = (itemName, quantity, action) => {
        setInputQuantities(currentQuantities => ({
            ...currentQuantities,
            [itemName]: {
                ...currentQuantities[itemName],
                [action]: Math.max(quantity, 0)
            }
        }));
    };

    /**
    * Adds specified quantities of an item to the order. If the item already exists in the order,
    * it increments the existing quantity. Otherwise, it adds a new entry to the order.
    *
    * @param {Object} item - The item object to add to the order, containing at least name and price.
    * @param {number} quantity - The number of units of the item to add to the order.
    */
    const addToOrder = (item, quantity) => {
        setOrder(currentOrder => {
            const itemIndex = currentOrder.findIndex(oi => oi.name === item.name);
            if (itemIndex > -1) {
                return currentOrder.map((oi, idx) =>
                    idx === itemIndex ? { ...oi, quantity: oi.quantity + quantity } : oi
                );
            } else {
                return [...currentOrder, { ...item, quantity }];
            }
        });
    };

    /**
     * Removes items from the order by reducing the quantity. 
     * If the quantity drops to zero or below, the item is removed from the order.
     * 
     * @param {string} itemName - The name of the item to remove.
     * @param {number} quantity - The quantity to remove.
     */
    const removeFromOrder = (itemName, quantity) => {
        setOrder(currentOrder => currentOrder.reduce((acc, item) => {
            if (item.name === itemName) {
                const newQuantity = item.quantity - quantity;
                if (newQuantity > 0) {
                    acc.push({ ...item, quantity: newQuantity });
                }
            } else {
                acc.push(item);
            }
            return acc;
        }, []));
    };

    /**
     * Finalizes the order by sending it to the backend API for processing. Clears the order state upon completion.
     * Logs the expanded order to the console.
     * 
     * @async
     * @function finishOrder
     */
    const finishOrder = async () => {
        console.log(order);
        const expandedOrder = order.flatMap(item => Array.from({ length: item.quantity }, () => item));
        console.log(expandedOrder);
        try {
            const response = await fetch('api/addOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expandedOrder)
            });
        }
        catch (error) {
            console.error(error);
        }

        setOrder([]);
    }

    /**
    * Cancels the current order and resets the order state array.
    * This function is triggered by a user action to cancel the order and prevents submission.
    *
    * @function cancelOrder
    */
    const cancelOrder = () => setOrder([]);

    /**
     * Calculates and returns the total price of all items in the order.
     * This function iterates over the order array, multiplying each item's price by its quantity and summing the results.
     *
     * @returns {number} The total price of the order, formatted to two decimal places.
     */
    const totalPrice = order.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div>

        
        <div className="cashier-container flex flex-col">
            <div className="title-and-summary">
                <div className="order-summary">
                    <div style={{ position: 'relative' }}>
                        <button className="navButton rounded-full">
                            <Link href="/">
                                Home
                            </Link>
                        </button>
                        <div className="order-summary-content">
                            <h2>Order Summary</h2>
                            {order.map((item, index) => (
                                <div key={item.name + index}>
                                    <span>{item.name} (x{item.quantity}) - ${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="order-summary-footer">
                        <h3>Total: ${totalPrice.toFixed(2)}</h3>
                        <div className="action-buttons">
                            <button className="order-action-btn" onClick={finishOrder}>Finish Order</button>
                            <button className="order-action-btn" onClick={cancelOrder}>Cancel Order</button>
                        </div>
                        <button className="order-action-btn view-past-orders-btn" onClick={() => {
                            setShowOrders(!showOrders);
                        }}>View Past Orders</button>
                    </div>
                </div>

            </div>
            <div className="menu-list">
                {categories.map((category) => (
                    <div className="menu-category" key={category}>
                        <h3>{category}</h3>
                        {menuItems.filter(item => item.foodType === category).map(item => (
                            <div className="menu-item" key={item.id}>
                                <span>{item.name} - ${item.price}</span>
                                <div className="menu-item-controls">
                                    <div>
                                        <button data-testid="addInput" onClick={() => addToOrder(item, inputQuantities[item.name]?.add)}>Add</button>
                                        <input
                                            data-testid="quantityInput"
                                            type="number"
                                            min="1"
                                            value={inputQuantities[item.name]?.add || ''}
                                            onChange={(e) => handleQuantityChange(item.name, parseInt(e.target.value, 10), 'add')}
                                        />
                                    </div>
                                    <div>
                                        <button data-testid="removeInput" onClick={() => removeFromOrder(item.name, inputQuantities[item.name]?.remove)}>Remove</button>
                                        <input
                                            data-testid="quantityDecreaseInput"
                                            type="number"
                                            min="0"
                                            value={inputQuantities[item.name]?.remove || ''}
                                            onChange={(e) => handleQuantityChange(item.name, parseInt(e.target.value, 10), 'remove')}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            
            
        </div>
            {showOrders && <OrderView/>}
        </div>
        
    );
} 