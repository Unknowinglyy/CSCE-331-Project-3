const pool = require("../../db")
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {

    try {
        const apiKey = '8b09a2135553dfdb0c9f38ba5e6d47eb';
        const city = "College Station";
        const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
        );
        const weatherData = response.data;
        return new Response(JSON.stringify(weatherData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return new Response(JSON.stringify("Error fetching weather data"), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
            
    }

}