

export interface ChatbotRequestType {
  query?: string;
  timestamp?: string;
  timestampDate?: Date;
  user_id?: string;
  conversation_id?: string;
  response_type?: string;
  isLoading?: boolean;
}

export interface ChatbotResponseType {
  responseText?: string;
  timestamp?: string;
  thread_id?: string;
}

// export interface ChatHistory {
//   request?: ChatbotRequestType;
//   response?: ChatbotResponseType;
//   title?: string;
//   conversation_id?: string;
// }

export interface ChatbotData {
  title?: string;
  conversationId?: string;
  conversations?: ChatbotConversation[];
  isChatbotResponseActive?: boolean;
}

export interface ChatbotConversation {
  request?: ChatbotRequestType;
  response?: ChatbotResponseType;
  status?: ChatResponseStatus;
}

export interface ChatResponseStatus {
  message: string;
  status: string;
  showLogs: boolean;
}

export interface ChatbotDataContextType {
  chatbotData: ChatbotData;
  setChatbotData: (data: ChatbotData) => void;
}

export interface ChatConversationApiResponse {
  conversation_id?: string;
  user_id?: string;
  title?: string;
  is_pinned?: string;
  is_favorite?: string;
  status?: string;
  messages?: ChatHistoryMessageType[];
}

export interface ChatHistoryMessageType {
  role?: string;
  content?: string;
}

export enum ChatResponseType {
  Log = 'log',
  Separator = 'separator',
  Final = 'final'
}

export interface ChatResponse {
  text: string;
  thread_id?: string;
  type: ChatResponseType;
}

export interface ChatThread {
  id: string;
  user_id: string;
  thread_name: string;
  messages: ChatMessage[];
  created_at: Date;
  updated_at: Date;
}

export enum ChatRole {
  USER ='user',
  ASSISTANT = 'assistant',
}

export interface ChatMessage {
  role?: ChatRole;
  content?: string;
  timestamp?: Date;
  reasoning?: string;
  response_time?: number;
}