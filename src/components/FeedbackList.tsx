import { useEffect, useState } from "react";
import FeedbackItem from "./FeedbackItem";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";

export default function FeedbackList() {
    const [feedbackItems, setFeedbackItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetch('https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks')
            .then(response => {
                if (!response.ok) {
                    throw new Error();
                }
                return response.json();
            })
            .then(data => {
                setFeedbackItems(data.feedbacks);
                setIsLoading(false);
            })
            .catch(() => {
                setErrorMessage('Something went wrong.');
                setIsLoading(false);
            });
    }, []);

    return (
        <ol className="feedback-list">
            {isLoading && <Spinner />}
            {errorMessage && <ErrorMessage message={errorMessage} />}
            {
                feedbackItems.map(item => <FeedbackItem feedbackItem={item} />)
            }
        </ol>
    );
}
