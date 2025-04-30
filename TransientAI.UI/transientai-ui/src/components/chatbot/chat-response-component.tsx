import {useEffect, useState} from "react";
import {formatDecimal} from "@/lib/utility-functions";
import {ChevronDownIcon} from "@radix-ui/react-icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {ChatMessage} from "@/services/chatbot-data";
import {PROCESSING_VALUE} from "@/services/chatbot-data/chatbot-data-store";
import styles from "@/components/chatbot/chatbot-response.module.scss";
import {DancingDots} from "@/components/dancing-dots/dancing-dots";

export interface ChatResponseProps {
    message: ChatMessage;
}

export function ChatResponseComponent({message}: ChatResponseProps) {
    const [open, setOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(true);

    useEffect(() => {
        setIsProcessing(message.reasoning === PROCESSING_VALUE);
    }, [message.reasoning])

    function handleClick() {
        if (isProcessing) {
            return;
        }
        setOpen(!open);
    }

    return (
        <div className={`${styles['chat-message']}}`}>
            <div className={styles['assistant']}>
                <div className={`${styles['status']} prevent-text-selection`}
                     onClick={handleClick}
                >
                    {isProcessing
                        ? (<DancingDots />)
                        : (!message.response_time
                            ? message.response_time === 0 ? `Thought for 0 seconds` : ''
                            : `Thought for ${formatDecimal(message.response_time)} seconds`)}
                    {!isProcessing && message.reasoning && <ChevronDownIcon
                        className={`${styles['expander-button' + (open ? '-open' : '')]}`}
                        />}
                </div>
                <div>
                    {open &&
                        (
                            <div className={styles['status-message']}>
                                <ReactMarkdown
                                    className='markdown'
                                    remarkPlugins={[remarkGfm]}
                                >{message.reasoning}
                                </ReactMarkdown>
                            </div>
                        )
                    }
                    <ReactMarkdown
                        className='markdown'
                        remarkPlugins={[remarkGfm]}
                    >{message.content}</ReactMarkdown>
                </div>
            </div>
            {message.reasoning !== PROCESSING_VALUE &&
            <div className={`${styles['assistant-message-time']}`}>{message.timestamp?.toLocaleString()}</div>}
        </div>
    );
}