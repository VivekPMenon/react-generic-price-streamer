import styles from './breaking-news.module.scss';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button, Spinner } from '@radix-ui/themes';
import { Message } from './models';
import { useBreakNewsDataStore } from '@/services/break-news/break-news-data-store';
import { breakNewsDataService } from '@/services/break-news/break-news-data-service';
import WhatsAppGroupDropdown from './breaking-group';
import { formatTime } from '@/lib/utility-functions/date-operations';

export interface BreakingNewsProps {
  isExpanded: boolean;
}

export function BreakingNews({ isExpanded }: BreakingNewsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { selectedGroupId, selectedBreakNewsItem } = useBreakNewsDataStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [nextPage, setNextPage] = useState(1);
  const [expandedMessages, setExpandedMessages] = useState<{ [key: string]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadingTriggerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef(0);
  const MESSAGES_PER_PAGE = 20;
  const hasMoreMessages = currentPage < totalPages;

  // Function to fetch messages with pagination
  const fetchMessages = useCallback(async (pageNumber: number, isInitial: boolean = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
      if (scrollContainerRef.current) {
        prevScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
      }
    }
  
    try {
      const response = await breakNewsDataService.getGroupMessages(
        selectedGroupId,
        pageNumber,
        MESSAGES_PER_PAGE
      );
    
      const newMessages = response.data.records as Message[];
      const totalPagesFromResponse = response.data.pagination.total_pages || 0;
      const nextPageFromResponse = response.data.pagination.current_page || 1;
  
      setTotalPages(totalPagesFromResponse);
      setNextPage(nextPageFromResponse + 1);
  
      if (newMessages.length !== 0) {
        setMessages(prevMessages => {
          // Prevent duplicates
          const existingMessageIds = new Set(prevMessages.map(msg => msg.id));
          const uniqueNewMessages = newMessages.filter(newMsg => !existingMessageIds.has(newMsg.id));
  
          return isInitial ? uniqueNewMessages : [...uniqueNewMessages, ...prevMessages];
        });
  
        if (isInitial) {
          setTimeout(scrollToBottom, 100);
        } else {
          requestAnimationFrame(() => {
            if (scrollContainerRef.current) {
              const newScrollHeight = scrollContainerRef.current.scrollHeight;
              const heightDifference = newScrollHeight - prevScrollHeightRef.current;
              scrollContainerRef.current.scrollTop += heightDifference;
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [selectedGroupId]);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setIsAtBottom(false);
    }
  };

  // Initial load of messages
  useEffect(() => {
    setCurrentPage(1);
    fetchMessages(1, true);
  }, [selectedGroupId, selectedBreakNewsItem, fetchMessages]);
  
  // Set up Intersection Observer for loading previous messages
  useEffect(() => {
    const options = {
      root: scrollContainerRef.current,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && hasMoreMessages && !isLoadingMore) {
          setCurrentPage(nextPage);
          fetchMessages(nextPage);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    if (loadingTriggerRef.current) {
      observer.observe(loadingTriggerRef.current);
    }

    return () => {
      if (loadingTriggerRef.current) {
        observer.unobserve(loadingTriggerRef.current);
      }
      observer.disconnect();
    };
  }, [fetchMessages, hasMoreMessages, isLoadingMore, nextPage]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingMore) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight > 300;
    setIsAtBottom(isNearBottom);
  }, [isLoadingMore]);

   // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Format date to display in a readable format
  const formatDate = (timeString: string | undefined) => {
    if (!timeString) {
      return 'Unknown Date';
    }
    
    const date = new Date(timeString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if the date is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    // Check if the date is yesterday
    else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    // Otherwise, display the full date
    else {
      return date.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };
  
  const groupMessagesByDate = () => {
    // Group messages by date
    const groupedMessages: { [key: string]: Message[] } = {};
    
    messages.forEach(message => { //Updated to no sort Temp
      if (!message.sender_time_info) {
        // Handle messages with no timestamp - put them in an "Unknown Date" group
        const dateString = "Unknown Date";
        if (!groupedMessages[dateString]) {
          groupedMessages[dateString] = [];
        }
        groupedMessages[dateString].push(message);
        return;
      }
      
      // const dateString = message.sender_time_info
      const dateString = message.sender_time_info.split(' ')[0];
      if (!groupedMessages[dateString]) {
        groupedMessages[dateString] = [];
      }
      
      groupedMessages[dateString].push(message);
    });
    
    return groupedMessages;
  };
  
  function getMessageType(message: Message) {
    if (!message) return null; // Handle undefined message safely
    
    // If there's no message content and no attachment, return null
    if (!message.message && !message.attachment) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const videoExtensions = ["mp4", "webm", "ogg"];
    const MAX_LENGTH = 1000;
    
    // Create the text component if message text exists
    let textComponent = null;
    const isExpanded = expandedMessages[message.id!] || false;
    if (message.message) {
      const shouldTruncate = message.message.length > MAX_LENGTH;
      const displayText = isExpanded
        ? message.message
        : message.message.slice(0, MAX_LENGTH) + (shouldTruncate ? "..." : "");
  
      textComponent = (
        <p className="text-sm max-w-xs md:max-w-sm lg:max-w-md mb-2">
          {displayText.split("\n").map((line, index) => (
            <span key={index}>
              {line.split(urlRegex).map((part, partIndex) =>
                urlRegex.test(part) ? (
                  <a
                    key={partIndex}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {part}
                  </a>
                ) : (
                  part
                )
              )}
              <br />
            </span>
          ))}
          {shouldTruncate && (
            <button
              onClick={() =>
                setExpandedMessages((prev) => ({
                  ...prev,
                  [message.id!]: !isExpanded,
                }))
              }
              className="text-blue-300 underline ml-1 cursor-pointer"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </p>
      );
    }

    let attachmentComponent = null;
    const openModal = (imageUrl: string) => {
      setSelectedImage(imageUrl);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setSelectedImage(null);
      setIsModalOpen(false);
    };
    if (message.attachment) {
      // Extract file extension from URL
      const urlParts = message.attachment.split(".");
      const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1].toLowerCase().split("?")[0] : "";
      
      if (imageExtensions.includes(extension)) {
        // Image attachment
        attachmentComponent = (
          <div className="mt-1" onClick={() => openModal(message.attachment!)}>
            <img
              src={message.attachment}
              alt="Attachment"
              className="w-auto h-auto max-h-[300px] rounded-lg object-cover"
              loading="lazy"
            />
          </div>
        );
      } else if (videoExtensions.includes(extension)) {
        // Video attachment
        attachmentComponent = (
          <div className="mt-1">
            <video
              controls
              className="w-auto h-auto max-h-[300px] rounded-lg"
            >
              <source src={message.attachment} type={`video/${extension}`} />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      } else {
        // Other file attachment (link)
        attachmentComponent = (
          <div className="mt-1">
            <a
              href={message.attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline break-all flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
              </svg>
              {message.attachment.split('/').pop()}
            </a>
          </div>
        );
      }
    }
    // Modal Component for displaying the image in full size
    const modalComponent = isModalOpen ? (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeModal}>
        <button
        className={`fixed ${styles['close-top']} right-5 text-white text-3xl font-bold bg-gray-800 hover:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center`}
        onClick={closeModal}>&times;</button>
        <div className="relative">
          <img src={selectedImage!} alt="Full Size" className="max-w-full max-h-screen rounded-lg" />
        </div>
      </div>
    ) : null;
    // Return both text and attachment in a container
    return (
      <div className="message-container">
        {attachmentComponent}
        {modalComponent}
        <br/>
        {textComponent}
      </div>
    );
  }

  const renderMessage = (message: Message) => {
    return (
      <div key={`message-${message.id}`} className="mb-3 flex flex-col items-start">
        <div className={`bg-[#2a2d30] text-white p-2 rounded-lg flex flex-col ${message.attachment ? 'w-[70%]' : 'max-w-lg'}`}>
          <div className="flex-1">{getMessageType(message)}</div>
          <span className="text-xs text-gray-400 whitespace-nowrap w-full text-end p-1">{formatTime(message.sender_time_info || '')}</span>
        </div>
      </div>
    );
  };
  
  if(isLoading) {
    return <div className={`${styles['breaking-news']} height-vh-75 flex justify-center items-center`}>
      <Spinner size='3' className='text-center'></Spinner>
    </div>;
  }

  // Group messages by date
  const groupedMessages = groupMessagesByDate();


  return (
    <div className={`${styles['breaking-news']} scrollable-div`}>
      <div className='sm:w-[60%] mr-4 max-sm:w-full border-r border-color-r h-full'>
        <div 
          className={`${styles['whatsapp-cont']} p-2 overflow-y-auto`}
          ref={scrollContainerRef}
        >
          {/* Loading trigger at the top - this is observed by the Intersection Observer */}
          <div ref={loadingTriggerRef} className="h-10 -mt-5 flex justify-center">
            {isLoadingMore && (
              <div className="flex justify-center items-end h-full">
                <Spinner size='1' className='text-center'></Spinner>
              </div>
            )}
          </div>
          
          {/* Messages grouped by date */}
          {Object.entries(groupedMessages).map(([dateString, messagesForDate]) => (
            <div key={`date-${dateString}`}>
              <div className="flex justify-center mb-3">
                <div className={`text-xs px-2 py-1 rounded-full ${styles['message-item']}`}>
                  {formatDate(messagesForDate[0].sender_time_info || '')}
                </div>
              </div>
              {messagesForDate.map(message => renderMessage(message))}
            </div>
          ))}
        </div>

        {/* Down Arrow Button */}
        {isAtBottom && (
          <Button type='button' button-name='scroll to bottom'
            onClick={scrollToBottom}
            className={`${styles['scroll-to-bottom-btn']}`}
          >
            <i className="fa-solid fa-chevron-down"></i>
          </Button>
        )}

      </div>

      <div className='flex-grow'>
        <div>
          <WhatsAppGroupDropdown></WhatsAppGroupDropdown>
        </div>

        <div className={`p-2`}>
          {/* <BreakingNewaChatBot></BreakingNewaChatBot> */}
        </div>
      </div>
    </div>
  );
}