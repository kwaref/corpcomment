import FeedbackItem from "./FeedbackItem";
import Spinner from "../Spinner";
import ErrorMessage from "../ErrorMessage";
import { useFeedbackItemsStore } from "../../stores/feedbackItemsStore";

export default function FeedbackList() {
    const isLoading = useFeedbackItemsStore(state => state.isLoading);
    const filteredFeedbackItems = useFeedbackItemsStore(state => state.getFilteredFeedbackItems());
    const errorMessage = useFeedbackItemsStore(state => state.errorMessage);

    return (
        <ol className="feedback-list">
            {isLoading && <Spinner />}
            {errorMessage && <ErrorMessage message={errorMessage} />}
            {
                filteredFeedbackItems.map(item => <FeedbackItem key={item.id} feedbackItem={item} />)
            }
        </ol>
    );
}
