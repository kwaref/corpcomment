import { useFeedbackItemsContext } from "../../lib/hooks";
import HashtagItem from "./HashtagItem";

export default function HashtagList() {
    const { companyList, handleSelectCompany } = useFeedbackItemsContext();

    return <ul className="hashtags">
        {companyList.map(item => <HashtagItem key={item} company={item} onSelectCompany={handleSelectCompany} />)}
    </ul>;
}
