import FeedbackItem from "./FeedbackItem";
import Spinner from "../Spinner";
import ErrorMessage from "../ErrorMessage";
import { useFeedbackItemsContext } from "../../lib/hooks";

export default function FeedbackList() {
    const { isLoading, feedbackItems, errorMessage } = useFeedbackItemsContext();

    return (
        <ol className="feedback-list">
            {isLoading && <Spinner />}
            {errorMessage && <ErrorMessage message={errorMessage} />}
            {
                feedbackItems.map(item => <FeedbackItem key={item.id} feedbackItem={item} />)
            }
        </ol>
    );
}
