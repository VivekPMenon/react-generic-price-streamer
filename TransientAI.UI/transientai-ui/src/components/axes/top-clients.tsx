import { productBrowserDataService, TopRecommendation } from '@/services/product-browser-data';
import { useContext, useEffect, useState } from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatbotDataContext } from '@/services/chatbot-data';
import { SearchDataContext } from '@/services/search-data';

export function TopClients() {

  const { chatbotData, setChatbotData } = useContext(ChatbotDataContext);
  const { searchData, setSearchData } = useContext(SearchDataContext);

  const [topRecommendations, setTopRecommendations] = useState<TopRecommendation[]>();
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);

  useEffect(() => loadTopRecommendations(), [searchData.id]);

  function loadTopRecommendations() {
    const loadTopRecommendationsAsync = async () => {
      let selectedCompany = '';
      if (searchData.id) {
        const bondInfo = await productBrowserDataService.getTodaysAxes(searchData.id);
        selectedCompany = bondInfo.length ? bondInfo[0].bond_issuer! : '';
      }

      const topCompanies = await productBrowserDataService.getTopRecommendations();
      const firstFiveComapanies = selectedCompany ? topCompanies.filter(topCompany => topCompany === selectedCompany) : topCompanies.slice(0, 4);

      const promises = firstFiveComapanies
        ?.map(companyName => productBrowserDataService.getRecommendationsDetails(companyName));

      const results: TopRecommendation[] = await Promise.all(promises);
      results.forEach(result => {
        if (result.clients_to_contact?.length) {
          result.overview = `Please contact the client(s) ${result.clients_to_contact.join(',')}`;
          return;
        }

        if (result.news?.length) {
          result.overview = result.news[0].headline;
          return;
        }

        if (result.current_axes?.length) {
          result.overview = 'Top Axe: ' + result.current_axes[0].bond_name;
          return;
        }
      });

      setTopRecommendations(results);

      // if security is in context, and a recommendation is found, that will be set in the cahtbot as well
      if (searchData.id && results?.length) {
        selectRecommendation(results[0]);
      } else {
        setChatbotData({
          ...chatbotData,
          isChatbotResponseActive: false
        });
      }
    };

    loadTopRecommendationsAsync();
  }

  function selectRecommendation(recommendation: TopRecommendation) {
    setChatbotData({
      title: recommendation.company,
      isChatbotResponseActive: true,
      conversations: [
        {
          request: {
            query: recommendation.company
          },
          response: {
            responseText: recommendation.reasoning
          }
        }
      ]
    });
  }

  return (
    <div>
      <div className='sub-header'>Top Recommendations</div>

      <div className='news'>
        {
          topRecommendations?.map(topRecommendation =>
            <div className='news-item' onClick={() => selectRecommendation(topRecommendation)}>
              <div className='news-content'>
                <div className='news-title'>
                  {topRecommendation.company}
                </div>
                <div className='news-description'>
                  {topRecommendation.overview}
                </div>
              </div>

              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <div className='news-menu' onClick={() => setIsDetailsVisible(true)}>
                    <i className='fa-solid fa-ellipsis-v fa-lg'></i>
                  </div>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="DialogOverlay" />
                  <Dialog.Content className="DialogContent">
                    <Dialog.Title className="DialogTitle">{topRecommendation.company} Details</Dialog.Title>
                    <Dialog.Description className="DialogDescription">

                    </Dialog.Description>
                    <div>
                      <ReactMarkdown className='markdown' remarkPlugins={[remarkGfm]}>{topRecommendation.reasoning}</ReactMarkdown>
                      {/* 
                      <Dialog.Close asChild>
                        <button className="Button green">CLOSE</button>
                      </Dialog.Close> */}
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          )
        }
      </div>

      {
        isDetailsVisible ? <></> : <></>
      }
    </div>
  );
}