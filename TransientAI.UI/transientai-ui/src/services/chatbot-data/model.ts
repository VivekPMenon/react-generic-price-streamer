

export interface ChatbotRequestType {
  query?: string;
  timestamp?: string;
  user_id?: string;
  conversation_id?: string;
  stream?: boolean;
  response_type?: string;
  isLoading?: boolean;
}

export interface ChatbotResponseType {
  responseText?: string;
  timestamp?: string;
}

export interface ChatHistory {
  request?: ChatbotRequestType;
  response?: ChatbotResponseType;
  title?: string;
  conversation_id?: string;
}

export interface ChatConversation {
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