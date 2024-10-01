'use client';
import Link from 'next/link';
import "./customerpage.css";
import { useEffect, useState } from "react";

//I think i need to seperate the different sections as it seems that the loading does not work
export default function Home() {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Recomended Foods");
    const [weatherData, setWeatherData] = useState(null);
    const [currentDate, setCurrentDate] = useState(null);




    const fetchMenuItems = async () => {
        try {
            const response = await fetch('/api/menu', {
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
        fetchWeather();
        fetchMenuItems()
        const interval = setInterval(() => {
            fetchWeather();
            fetchMenuItems()
            setSelectedCategory((prevCategory) => {
                console.log(selectedCategory)
                const currentIndex = categories.indexOf(prevCategory);
                const nextIndex = (currentIndex + 1) % categories.length;
                return categories[nextIndex];
            });
        }, 10000);

        return () => clearInterval(interval);

    }
        , []);

    //initalizes the google translate element
   

    const categories = ["Recomended Foods", "Burgers", "Sandwiches", "Sides", "Sauces", "Beverages"];

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
        "Seasonal Sandwich": "images/seasonalsandwich.png"
    };

    // Call fetchData within the callback 

    return (
        <main className="customer-container">
            <div className="flex w-full justify-between">
                {/* <Link href="/"><button className="navButton rounded-full">Home</button></Link> */}

            </div>

            <nav className="customer-nav text-white">
                <span className="nav-title text-white">REVs American Grill</span>
            </nav>
            <div className="categories-container category-nav">
                {categories.map((category) => (
                    <div
                        key={category}
                        className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                    >
                        {category}
                    </div>
                ))}
            </div>


            <div className="menu-container">
                <div className="flex flex-wrap justify-around menu-items-wrapper menu-items-container">
                    {selectedCategory && menuItems
                        .filter((item) => item.foodType === selectedCategory && (((item.startmonth < currentDate) && (item.endmonth > currentDate)) || (!item.startmonth || !item.endmonth)))
                        .map((item) => (
                            <div key={item.foodID} className="menu-item">
                                <img src={foodImages[item.name]} alt={item.name} />
                                <h2>{item.name}</h2>
                                <h2>${item.price.toFixed(2)}</h2>

                            </div>
                        ))}
                    {selectedCategory && menuItems
                        .filter((item) => "Recomended Foods" === selectedCategory && (((item.startmonth < currentDate) && (item.endmonth > currentDate))
                            || ((item.temperature === "Cold" && weatherData.main.temp < 70) || (item.temperature === "Hot" && weatherData.main.temp > 80))))
                        .map((item) => (
                            <div key={item.foodID} className="menu-item">
                                <img src={foodImages[item.name]} alt={item.name} />
                                <h2>{item.name}</h2>
                                <h2>${item.price.toFixed(2)}</h2>

                            </div>
                        ))}
                </div>
            </div>
            <div className="order-container">

            </div>
        </main>
    );
}