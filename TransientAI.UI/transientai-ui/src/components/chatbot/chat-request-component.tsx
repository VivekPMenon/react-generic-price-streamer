import styles from "@/components/chatbot/chatbot-response.module.scss";
import {Spinner} from "@radix-ui/themes";
import {ChatMessage} from "@/services/chatbot-data";

export interface ChatRequestProps {
    message: ChatMessage;
    isLoading: boolean;
}

export function ChatRequestComponent({message, isLoading}: ChatRequestProps) {
    return (
        <div className={styles['chat-message']}>
            <div className={styles['message-content']}>
                <div className={styles['message-header'] + ' profile-pic'}>
                    <img src="/images/ProfilePicAI.png"></img>
                </div>
                <p>
                    {message.content}
                    {isLoading ? <Spinner size='3' className='ml-2'></Spinner> : <></>}
                </p>
            </div>

            <div className={styles['message-time']}>{message.timestamp?.toLocaleString()}</div>
        </div>
    );
}