

// app/api/send-notification/route.js  
import axios from 'axios';

export async function POST(request) {
    const { to, body, schedule } = await request.json();
    const starsenderApiKey = process.env.STARSENDER_API_KEY


    try {
        const response = await axios.post('https://api.starsender.online/api/send', {
            messageType: "text",
            to,
            body,
            schedule,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": starsenderApiKey, // Ganti dengan API key Anda  
            },
        });

        return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}  
