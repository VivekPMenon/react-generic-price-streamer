import { productBrowserDataService, TopRecommendation } from '@/services/product-browser-data';
import { useEffect, useState } from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function TopClients() {

  const [topRecommendations, setTopRecommendations] = useState<TopRecommendation[]>();
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);

  useEffect(() => loadTopRecommendations(), []);

  function loadTopRecommendations() {
    const loadTopRecommendationsAsync = async () => {
      const topCompanies = await productBrowserDataService.getTopRecommendations();
      const firstFiveComapanies = topCompanies.slice(0, 4);

      const promises = firstFiveComapanies
        .map(companyName => productBrowserDataService.getRecommendationsDetails(companyName));

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
    };

    loadTopRecommendationsAsync();
  }

  return (
    <div>
      <div className='sub-header'>Top Recommendations</div>

      <div className='news'>
        {
          topRecommendations?.map(topRecommendation =>
            <div className='news-item'>
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