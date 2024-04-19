import { createContext, useMemo, useState } from "react";
import { TFeedbackItem } from "../lib/types";
import { useFeedbackItems } from "../lib/hooks";

type TFeedbackItemsContext = {
    isLoading: boolean;
    feedbackItems: TFeedbackItem[];
    errorMessage: string;
    companyList: string[];
    handleAddToList: (text: string) => void;
    handleSelectCompany: (company: string) => void;
};

type FeedbackItemsContextProviderProps = { children: React.ReactNode; };

export const FeedbackItemsContext = createContext<TFeedbackItemsContext | null>(null);

export default function FeedbackItemsContextProvider({ children }: FeedbackItemsContextProviderProps) {
    const { isLoading, feedbackItems, errorMessage, setFeedbackItems } = useFeedbackItems();
    const [selectedCompany, setSelectedCompany] = useState('');

    const companyList = useMemo(() => feedbackItems.map(item => item.company).filter((company, index, array) => array.indexOf(company) === index), [feedbackItems]);

    const filteredFeedbackItems = useMemo(() => selectedCompany
        ? feedbackItems.filter(item => item.company.toLowerCase() === selectedCompany.toLowerCase())
        : feedbackItems, [selectedCompany, feedbackItems]);

    const handleSelectCompany = (company: string) => {
        setSelectedCompany(company);
    };

    const handleAddToList = async (text: string) => {
        const companyName = text.split(' ').find(word => word.includes('#'))!.substring(1);
        const newItem: TFeedbackItem = {
            id: new Date().getTime(),
            text,
            upvoteCount: 0,
            daysAgo: 0,
            company: companyName,
            badgeLetter: companyName.substring(0, 1).toLocaleUpperCase(),
        };
        setFeedbackItems([...feedbackItems, newItem]);

        await fetch('https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks', {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
    };

    return (
        <FeedbackItemsContext.Provider value={{
            feedbackItems: filteredFeedbackItems,
            isLoading,
            errorMessage,
            companyList,
            handleAddToList,
            handleSelectCompany
        }}>{children}</FeedbackItemsContext.Provider>
    );
}
