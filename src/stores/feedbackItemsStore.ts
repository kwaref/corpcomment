import { create } from "zustand";
import { TFeedbackItem } from "../lib/types";

type Store = {
    feedbackItems: TFeedbackItem[];
    isLoading: boolean;
    errorMessage: string;
    selectedCompany: string;
    getCompanyList: () => string[];
    addItemToList: (text: string) => Promise<void>;
    getFilteredFeedbackItems: () => TFeedbackItem[];
    selectCompany: (company: string) => void;
    fetchFeedbackItems: () => Promise<void>;
};

export const useFeedbackItemsStore = create<Store>((set, get) => ({
    feedbackItems: [],
    isLoading: false,
    errorMessage: '',
    selectedCompany: '',
    getCompanyList: () => {
        return get()
            .feedbackItems.map(item => item.company)
            .filter((company, index, array) => array.indexOf(company) === index);
    },
    getFilteredFeedbackItems: () => {
        const state = get();
        return state.selectedCompany
            ? state.feedbackItems.filter(item => item.company.toLowerCase() === state.selectedCompany.toLowerCase())
            : state.feedbackItems;
    },
    addItemToList: async (text: string) => {
        const companyName = text.split(' ').find(word => word.includes('#'))!.substring(1);
        const newItem: TFeedbackItem = {
            id: new Date().getTime(),
            text,
            upvoteCount: 0,
            daysAgo: 0,
            company: companyName,
            badgeLetter: companyName.substring(0, 1).toLocaleUpperCase(),
        };
        set((state) => ({
            feedbackItems: [...state.feedbackItems, newItem]
        }));

        await fetch('https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks', {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
    },
    selectCompany: (company: string) => {
        set(() => ({
            selectedCompany: company
        }));
    },
    fetchFeedbackItems: async () => {
        set(() => ({ isLoading: true }));
        try {

            const response = await fetch('https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks');

            if (!response.ok) {
                throw new Error();
            }

            const data = await response.json();
            set(() => ({ feedbackItems: data.feedbacks }));
            set(() => ({ isLoading: false }));
        } catch (e) {
            set(() => ({ errorMessage: 'Something went wront' }));
            set(() => ({ isLoading: false }));
        }
    }
}));