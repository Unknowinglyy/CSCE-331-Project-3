/**
 * @module Home
 */
'use client';
import Link from 'next/link';
import "./customerpage.css";
import Translate from '../components/Translate';
import { useEffect, useState } from "react";

/**
 * Home component for the customer page.
 * @returns {JSX.Element} The rendered component.
 */
export default function Home() {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [order, setOrder] = useState([]);
    const [selectedItemName, setSelectedItemName] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [currentDate, setCurrentDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const togglePaymentModal = () => setIsPaymentModalOpen(!isPaymentModalOpen);

    /**
     * Modal component.
     * @module Modal
     * @param {Object} props - The component props.
     * @param {boolean} props.isOpen - Flag to indicate if the modal is open.
     * @param {Function} props.onClose - Function to close the modal.
     * @param {JSX.Element} props.children - The children elements.
     * @param {Function} props.onFinishOrder - Function to finish the order.
     * @param {Function} props.onCancelOrder - Function to cancel the order.
     * @returns {JSX.Element} The modal component.
     */
    function Modal({ isOpen, onClose, children, onFinishOrder, onCancelOrder, onRemoveItem }) {
        if (!isOpen) return null;
    
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: 'white', padding: 20, borderRadius: 8, width: '80%', maxWidth: '600px', color: 'black' }}>
                    <h2 className="modal-title">Order Summary</h2>
                    <div>
                        {order.map((item, index) => (
                            <div key={index} className="order-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <p>{item.name} - Quantity: {item.quantity} - ${item.price.toFixed(2)}</p>
                                <button className="modal-button remove-button" onClick={() => onRemoveItem(index)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <p className="modal-total">Total: ${totalPrice.toFixed(2)}</p>
                    <div className="modal-buttons">
                        <button className="modal-button" onClick={onFinishOrder}>Finish Order</button>
                        <button className="modal-button" onClick={onCancelOrder}>Cancel Order</button>
                        <button className="modal-button" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
    }
    
    /**
     * PaymentModal component.
     * @module PaymentModal
     * @param {Object} props - The component props.
     * @param {boolean} props.isOpen - Flag to indicate if the payment modal is open.
     * @param {Function} props.onClose - Function to close the payment modal.
     * @param {Function} props.onSelectPayment - Function to select the payment method.
     * @returns {JSX.Element} The payment modal component.
     */
    function PaymentModal({ isOpen, onClose, onSelectPayment }) {
        if (!isOpen) return null;
    
        return (
            <div className="payment-modal-container">
                <div className="payment-modal-content">
                    <h2 className="payment-modal-title">Choose Payment Method</h2>
                    <div className="payment-options">
                        <button className="payment-option-button" onClick={() => onSelectPayment("Credit Card")}>
                            <img src="paymentOptionImages/credit-card.png" alt="Credit Card" />
                            <span>Credit Card</span>
                        </button>
                        <button className="payment-option-button" onClick={() => onSelectPayment("Cash")}>
                            <img src="paymentOptionImages/money.png" alt="Cash" />
                            <span>Cash</span>
                        </button>
                        <button className="payment-option-button" onClick={() => onSelectPayment("Dining Dollar")}>
                            <img src="paymentOptionImages/table-etiquette.png" alt="Dining Dollar" />
                            <span>Dining Dollar</span>
                        </button>
                    </div>
                    <button className="payment-modal-button cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        );
    }    
    
    /**
     * A function to fetch menu items
     *
     * @type {Object.<string, number>}
     */
    const fetchMenuItems = async () => {
        try {
            const response = await fetch('/api/inStockFoods', {
                method: 'GET',
            });
            const json = await response.json();
            setMenuItems(json);
        } catch (error) {
            console.error("Error fetching menu items:", error);
        }
    };

    const fetchWeather = async () => {
        try {
            const response = await fetch('/api/weather', {
                method: 'GET',
            });
            const json = await response.json();
            setWeatherData(json);
            console.log(weatherData.main.temp);
        } catch (error) {
            console.error("Error fetching menu items:", error);
        }
    };

    useEffect(() => {
        fetchMenuItems();
        fetchWeather();
        const today = new Date();
        setCurrentDate(today.getFullYear().toString() + "0" + (today.getMonth() + 1).toString() +"0" +today.getDate().toString());
    }, []);

    const categories = ["Recomended Foods","Burgers", "Sandwiches", "Sides", "Sauces", "Beverages"];

    const foodImages = {
        "Classic Burger": "images/classic.png",
        "Bacon Cheese Burger": "images/baconcheese.png",
        "Double Stack Cheeseburger": "images/doublestack.png",
        "Rev's Burger": "images/revsburger.png",
        "Testing Seasonal": "images/pattymelt.png",
        "Gig 'Em Patty Melt": "images/pattymelt.png",
        "Grilled Cheese": "images/grilledcheese.png",
        "Classic Chicken Sandwich": "images/classicchicken.png",
        "Spicy ranch chicken sandwich": "images/spicyranch.png",
        "Kettle Chips": "images/kettle.png",
        "Tater tots": "images/tatertots.png",
        "Onion Rings": "images/onionrings.png",
        "Fries": "images/fries.png",
        "BBQ": "images/bbq.png",
        "Honey Mustard": "images/honeymustard.png",
        "Gigem Sauce": "images/gigemsauce.png",
        "Buffalo": "images/buffalo.png",
        "Ranch": "images/ranch.png",
        "Shake": "images/shake.png",
        "Fountain Drink": "images/fountain.png",
        "Seasonal Sandwich": "images/seasonalsandwich.png",
        "Recomended Foods": "images/leaves.png",
        "Burgers": "images/burger.png",
        "Sandwiches": "images/sandwich.png",
        "Sides": "images/sides.png",
        "Sauces": "images/sauces.png",
        "Beverages": "images/beverages.png"
    };

    const addToOrder = (item, e) => {
        e.stopPropagation();
        setOrder((currentOrder) => [...currentOrder, item]);
        setSelectedItemName(null);
    };

    const orderFood = async () => {
        console.log(order);
        try {
            await fetch('api/addOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Specify content type as JSON
                },
                body: JSON.stringify(order) // Convert order array to JSON string and send in the body
            });
            setOrder([]);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const handleMenuItemClick = (itemName) => {
        const newName = selectedItemName === itemName ? null : itemName;
        setSelectedItemName(newName);
    };

    const removeItem = (index) => {
        setOrder(currentOrder => {
            const newOrder = [...currentOrder];
            newOrder.splice(index, 1);
            return newOrder;
        });
    };

    const finishOrder = async () => {
        if (order.length === 0) {
            alert("You should add an item to your order before finishing.");
            return;
        }

        console.log('Order finished:', order);
        toggleModal(); 
        togglePaymentModal();
    };

    const handlePaymentSelection = (method) => {
        console.log('Payment method selected:', method);
        orderFood();
        togglePaymentModal();
        setSelectedCategory(null);
        setOrder([]); 
        alert("Thank you for your order!");
    };

    const cancelOrder = () => {
        setOrder([]);
        setSelectedCategory(null);
    };

    const totalPrice = order.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    

   
    // Call fetchData within the callback 

    return (
        <main className="customer-container">
            <div className="flex w-full justify-between">
            <Link href="/"><button className="navButton rounded-full">Home</button></Link>
            {weatherData ? (
                <div>
                <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                <p>Temperature: {weatherData.main.temp}°F</p>
                <p>Description: {weatherData.weather[0].description}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <div><Translate></Translate></div>
            </div>
            


            <nav className="customer-nav">
                <span className="nav-title">REVs American Grill</span> 
            </nav>
            <div className="categories-container category-nav">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => {
                            setSelectedCategory(category);
                            setSelectedItemName(null);
                        }}
                        className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className="menu-container">
                <div className="flex flex-wrap justify-around menu-items-wrapper menu-items-container">
                    {selectedCategory && menuItems
                        .filter((item) => item.foodType === selectedCategory && (((item.startmonth < currentDate) && (item.endmonth > currentDate)) || (!item.startmonth || !item.endmonth)))
                        .map((item) => (
                            <div key={item.foodID} className="menu-item h-fit" onClick={() => handleMenuItemClick(item.name)}>
                                <img src={foodImages[item.name]} alt={foodImages[item.foodType]} />
                                <h2>{item.name}</h2>
                                <h2>${item.price.toFixed(2)}</h2>
                                <button onClick={e => {
                                e.stopPropagation(); 
                                addToOrder(item, e);
                                }} className="add-to-order-btn">Add to Order</button>
                            </div>
                        ))}
                    {selectedCategory && menuItems
                        .filter((item) => "Recomended Foods" === selectedCategory && (((item.startmonth < currentDate) && (item.endmonth > currentDate)) 
                        || ((item.temperature === "Cold" && weatherData.main.temp < 70) || (item.temperature === "Hot" && weatherData.main.temp > 80))))
                        .map((item) => (
                            <div key={item.foodID} className="menu-item" onClick={() => handleMenuItemClick(item.name)}>
                                <img src={foodImages[item.name]} alt={item.name} />
                                <h2>{item.name}</h2>
                                <h2>${item.price.toFixed(2)}</h2>
                                <button onClick={e => {
                                e.stopPropagation(); 
                                addToOrder(item, e);
                                }} className="add-to-order-btn">Add to Order</button>
                            </div>
                        ))}
                </div>
            </div>
            <div className="order-container">
                <div className="order-content">
                    <div className="order-summary-container">
                        <h3 className="item-in-order">{order.length} Items in Order</h3>
                        <h3 className="item-in-order">Total: ${totalPrice.toFixed(2)}</h3>
                        <button className="order-action-btn" onClick={toggleModal}>View My Order</button>
                    </div>
                    <Modal 
                        isOpen={isModalOpen} 
                        onClose={toggleModal}
                        onFinishOrder={() => {
                            finishOrder();
                            toggleModal(); 
                        }}
                        onCancelOrder={() => {
                            cancelOrder();
                            toggleModal(); 
                        }}
                        onRemoveItem={removeItem}>
                        {order.map((item, index) => (
                            <div key={index} className="order-item">
                                <p>{item.name} - Quantity: {item.quantity} - ${item.price.toFixed(2)}</p>
                                <button className="modal-button" onClick={() => removeItem(index)}>Remove</button>
                            </div>
                        ))}
                    </Modal>
                    <PaymentModal 
                        isOpen={isPaymentModalOpen} 
                        onClose={togglePaymentModal}
                        onSelectPayment={handlePaymentSelection}
                    />
                </div>
            </div>
        </main>
    );
}