import React, { useState } from 'react';
import './feedbackForm.css'

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event) => {
  event.preventDefault();

  // Create the feedback data object
  const feedbackData = {
    rating,
    comment,
  };

  // Send the feedback data to the server
  fetch('https://traya-health-im76.onrender.com/submit-feedback', {
    mode: 'no-cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackData),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data); // Success message from the server
      // Reset form fields
      setRating(0);
      setComment('');
    })
    .catch((error) => {
      console.error('Error submitting feedback:', error);
      // Handle error case
    });
};


  return (
    <div className="feedback-form">
      <h2>Leave Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className="rating">
          <label>Rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={rating === value}
                  onChange={handleRatingChange}
                />
                <span className="star">&#9733;</span>
              </label>
            ))}
          </div>
        </div>
        <div className="comment">
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Enter your comment..."
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
