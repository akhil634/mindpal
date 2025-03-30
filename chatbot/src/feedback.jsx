import React, { useState } from 'react';

const Feedback = () => {
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            setSubmitted(true);
        }
    };

    return (
        <div>
            {!submitted ? (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="feedback">Your Feedback:</label>
                    <textarea
                        id="feedback"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your feedback here..."
                    />
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <p>Thank you for your feedback!</p>
            )}
        </div>
    );
};

export default Feedback;