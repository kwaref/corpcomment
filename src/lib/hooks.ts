import { useContext, useEffect, useState } from "react";
import { FeedbackItemsContext } from "../contexts/FeedbackItemsContextProvider";
import { TFeedbackItem } from "./types";

export function useFeedbackItemsContext() {
    const context = useContext(FeedbackItemsContext);

    if (!context) {
        throw new Error("FeedbackItemsContext is not defined in feedbackList component");

    }

    return context;
}

export function useFeedbackItems() {
    const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchFeedbackItems = async () => {
            try {

                const response = await fetch('https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks');

                if (!response.ok) {
                    throw new Error();
                }

                const data = await response.json();
                setFeedbackItems(data.feedbacks);
                setIsLoading(false);
            } catch (e) {
                setErrorMessage('Something went wront');
                setIsLoading(false);
            }

        };
        fetchFeedbackItems();
    }, []);

    return {feedbackItems, isLoading, errorMessage, setFeedbackItems}
}