import styles from './breaking-news.module.scss';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Spinner } from '@radix-ui/themes';
import { Message } from './models';
import { useBreakNewsDataStore } from '@/services/break-news/break-news-data-store';
import { breakNewsDataService } from '@/services/break-news/break-news-data-service';
import WhatsAppGroupDropdown from './breaking-group';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const MESSAGES_PER_PAGE = 10;

  // Function to fetch messages with pagination
  const fetchMessages = useCallback(async (pageNumber: number, isInitial: boolean = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    try {
      const response = await breakNewsDataService.getGroupMessages(
        selectedGroupId,
        pageNumber,
        MESSAGES_PER_PAGE
      );
      
      console.log('Fetched messages for page', pageNumber, response);
      
      // Extract messages and total pages from the response
      const newMessages = response.data.records as Message[];
      const totalPagesFromResponse = response.data.pagination.total_pages || 0;
      
      // Update total pages
      setTotalPages(totalPagesFromResponse);
      
      if (newMessages.length !== 0) {
        if (isInitial) {
          // For initial load, just set the messages
          setMessages(newMessages);
        } else {
          // For pagination, handle merging with existing messages
          setMessages(prevMessages => {
            // Create a Map to track unique messages by ID
            const messageMap = new Map();
            
            // Add existing messages to the map
            prevMessages.forEach(msg => messageMap.set(msg.id, msg));
            
            // Add new messages to the map (duplicates will be overwritten)
            newMessages.forEach(msg => messageMap.set(msg.id, msg));
            
            // Convert back to array and return
            return Array.from(messageMap.values());
          });
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      if (isInitial) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, [selectedGroupId]);

  const messageStatus = async (messageId: string | number) => {
    try {
      await breakNewsDataService.updateMessageStatus(messageId);
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  }

  // Initial load of messages
  useEffect(() => {
    setCurrentPage(1);
    fetchMessages(1, true);
    messageStatus(selectedBreakNewsItem?.id || '');
  }, [selectedGroupId, selectedBreakNewsItem, fetchMessages]);

  // Handle scroll to load more messages
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingMore) return;
    
    // Check if user has scrolled to the top (or very close to it)
    if (container.scrollTop < 50) {
      // Check if there are more pages to load
      if (currentPage < totalPages) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchMessages(nextPage);
      }
    }
  }, [fetchMessages, isLoadingMore, currentPage, totalPages]);

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Maintain scroll position when adding older messages
  useEffect(() => {
    if (isLoadingMore && scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const scrollHeightBefore = scrollContainer.scrollHeight;
      
      // After messages are added and DOM is updated
      const timer = setTimeout(() => {
        const newScrollHeight = scrollContainer.scrollHeight;
        const heightDifference = newScrollHeight - scrollHeightBefore;
        
        // Set scroll position to maintain the same relative position
        if (heightDifference > 0) {
          scrollContainer.scrollTop = heightDifference;
        }
      }, 10); // Slightly longer timeout to ensure DOM is updated
      
      return () => clearTimeout(timer);
    }
  }, [messages, isLoadingMore]);

  // Format time to display only hours and minutes
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) {
      return '';
    }
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
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
    // Sort messages by sender_time_info
    const sortedMessages = [...messages].sort((a, b) => {
      const timeA = a.sender_time_info ? new Date(a.sender_time_info).getTime() : 0;
      const timeB = b.sender_time_info ? new Date(b.sender_time_info).getTime() : 0;
      return timeA - timeB;
    });
    
    // Group messages by date
    const groupedMessages: { [key: string]: Message[] } = {};
    
    sortedMessages.forEach(message => {
      if (!message.sender_time_info) {
        // Handle messages with no timestamp - put them in an "Unknown Date" group
        const dateString = "Unknown Date";
        if (!groupedMessages[dateString]) {
          groupedMessages[dateString] = [];
        }
        groupedMessages[dateString].push(message);
        return;
      }
      
      const date = new Date(message.sender_time_info);
      const dateString = date.toDateString();
      
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
    
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const videoExtensions = ["mp4", "webm", "ogg"];
    
    // Create the text component if message text exists
    const textComponent = message.message ? (
      <p className="text-sm max-w-xs md:max-w-sm lg:max-w-md mb-2">
        {message.message}
      </p>
    ) : null;
    
    // Create the attachment component if attachment exists
    let attachmentComponent = null;
    
    if (message.attachment) {
      // Extract file extension from URL
      const urlParts = message.attachment.split(".");
      const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1].toLowerCase().split("?")[0] : "";
      
      if (imageExtensions.includes(extension)) {
        // Image attachment
        attachmentComponent = (
          <div className="mt-1">
            <img
              src={message.attachment}
              alt="Attachment"
              className="w-full h-auto max-h-[300px] rounded-lg object-cover"
            />
          </div>
        );
      } else if (videoExtensions.includes(extension)) {
        // Video attachment
        attachmentComponent = (
          <div className="mt-1">
            <video
              controls
              className="w-full h-auto max-h-[300px] rounded-lg"
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
    
    // Return both text and attachment in a container
    return (
      <div className="message-container">
        {attachmentComponent}
        {textComponent}
      </div>
    );
  }
  

// Update the renderMessage function to ensure unique keys
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
    return <div className={`${styles['breaking-news']} height-vh-75`}>
      <Spinner size='3' className='text-center'></Spinner>
    </div>;
  }

  // Group messages by date
  const groupedMessages = groupMessagesByDate();

  return (
    <div className={`${styles['breaking-news']} scrollable-div height-vh-75`}>
      <div className='sm:w-[60%] mr-4 max-sm:w-full border-r border-color-r'>
        <div 
          onScroll={handleScroll}
          className={`${styles['whatsapp-cont']} p-2 overflow-y-auto`}
          ref={scrollContainerRef}
        >
          {/* Loading indicator for previous messages */}
          {isLoadingMore && (
            <div className="flex justify-center mb-3">
              <Spinner size='1' className='text-center'></Spinner>
            </div>
          )}
          
          {/* Pagination info - optional */}
          {currentPage < totalPages && !isLoadingMore && (
            <div className="flex justify-center mb-3">
              <div className="bg-gray-800 text-xs text-gray-400 px-2 py-1 rounded-full">
                Scroll to load more messages
              </div>
            </div>
          )}
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
      </div>

      <div className='flex-grow'>
        <div>
          <WhatsAppGroupDropdown></WhatsAppGroupDropdown>
        </div>

        <div className={`${styles['whatsapp-cont']} p-2`}>
          {/* <BreakingNewaChatBot></BreakingNewaChatBot> */}
        </div>
      </div>
    </div>
  );
}