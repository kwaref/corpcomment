import { useEffect, useMemo, useState } from 'react';
import Container from './components/layout/Container';
import Footer from './components/layout/Footer';
import HashtagList from './components/hashtags/HashtagList';
import { TFeedbackItem } from './lib/types';

function App() {
  const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');

  const filteredFeedbackItems = useMemo(() => selectedCompany
    ? feedbackItems.filter(item => item.company.toLowerCase() === selectedCompany.toLowerCase())
    : feedbackItems, [selectedCompany, feedbackItems]);

  const companyList = useMemo(() => feedbackItems.map(item => item.company).filter((company, index, array) => array.indexOf(company) === index), [feedbackItems]);

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

  const handleSelectCompany = (company: string) => {
    setSelectedCompany(company);
  };

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

  return (
    <div className='app'>
      <Footer />
      <Container handleAddToList={handleAddToList} errorMessage={errorMessage} isLoading={isLoading} feedbackItems={filteredFeedbackItems} />
      <HashtagList companyList={companyList} handleSelectCompany={handleSelectCompany} />
    </div>
  );
}

export default App;
