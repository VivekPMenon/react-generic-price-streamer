

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
}