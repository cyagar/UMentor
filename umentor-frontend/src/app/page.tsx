"use client";

import { useEffect, useState } from 'react';
import { Assignment } from '../types';

export default function Home() {
    // State to hold the list of assignments
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    // State for loading status
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch assignments from your new backend endpoint
        fetch('http://localhost:8080/api/assignments')
            .then((res) => res.json())
            .then((data: Assignment[]) => {
                setAssignments(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching assignments:", err);
                setIsLoading(false);
            });
    }, []); // The empty array [] means this runs only once when the component mounts

    const [newTitle, setNewTitle] = useState('');
    const [newCourse, setNewCourse] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the page from reloading on form submit

        const newAssignment = {
            title: newTitle,
            courseName: newCourse,
            dueDate: new Date().toISOString().split('T')[0], // Just use today's date for now
            completed: false,
        };

        try {
            const response = await fetch('http://localhost:8080/api/assignments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAssignment),
            });
            const createdAssignment = await response.json();

            // Add the new assignment to our list to update the UI
            setAssignments([...assignments, createdAssignment]);

            // Clear the form fields
            setNewTitle('');
            setNewCourse('');
        } catch (err) {
            console.error("Error creating assignment:", err);
        }
    };

    return (
        <main style={{ padding: '2rem' }}>
            <h1>UMentor Assignments</h1>

            {isLoading ? (
                <p>Loading assignments...</p>
            ) : (
                <ul>
                    {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                            <li key={assignment.id}>
                                <strong>{assignment.title}</strong> ({assignment.courseName})
                            </li>
                        ))
                    ) : (
                        <p>No assignments found. Add one below!</p>
                    )}
                </ul>
            )}

            <hr />
            <h2>Add New Assignment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title: </label>
                    <input
                        id="title"
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                    <label htmlFor="course">Course: </label>
                    <input
                        id="course"
                        type="text"
                        value={newCourse}
                        onChange={(e) => setNewCourse(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" style={{ marginTop: '1rem' }}>Add Assignment</button>
            </form>
        </main>
    );
}
