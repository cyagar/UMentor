"use client";

import { useEffect, useState } from 'react';

export default function Home() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/hello')
            .then(res => res.text())
            .then(data => setMessage(data))
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    return (
        <main>
            <h1>Frontend is connected!</h1>
            <p>{message || "Loading..."}</p>
        </main>
    );
}
