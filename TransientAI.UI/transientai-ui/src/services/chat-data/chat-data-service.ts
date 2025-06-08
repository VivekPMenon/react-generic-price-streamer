import {webApihandler} from "../web-api-handler";
import {AgentType} from "./model";
import {fromStreamedResponse} from "@/lib/utility-functions/observables";
import {mergeMap} from "rxjs";
import {ChatResponse, ChatResponseType} from "@/services/chatbot-data";

const THREAD_ID_MATCHER = /"thread_id"\s*:\s*"([^"]+)"[^}]*/g;
const TYPE_TEXT_MATCHER = /{[^}]*"type"\s*:\s*"([^"]+)"[^}]*"text"\s*:\s*"([^"]+)"[^}]*}/g;
const NEWLINE_MATCHER = /\\n/g;

class ChatDataService {
    private readonly finSightServiceName = 'fin-sight-api';
    private readonly companyServiceName = 'sell-side-api';

    async sendChatRequest(request: string, user_id: string, agent: AgentType = AgentType.FMP): Promise<string> {
        try {
            switch (agent) {
                case AgentType.FMP: {
                    const response = await webApihandler.post(
                        'analyze', {
                            query: request,
                            user_id
                        },
                        undefined, {
                            serviceName: this.finSightServiceName
                        }
                    );
                    return response?.result;
                }
                case AgentType.Company: {
                    const response = webApihandler.execute(
                        'finsight',
                        'POST', {
                            query: request,
                        },
                        undefined,
                        {'Content-Type': 'application/json'},
                        this.companyServiceName
                    );

                    const textDecoder = new TextDecoder();
                    const stream = fromStreamedResponse(response).pipe(
                        mergeMap(data => {
                            const chunk = textDecoder.decode(data);
                            const match = chunk.match(THREAD_ID_MATCHER);
                            const thread_id = (match && match.length) ? match[1] : null;
                            return Array.from(
                                chunk.matchAll(TYPE_TEXT_MATCHER),
                                ([, type, text]) => ({
                                    type,
                                    text: text.replace(NEWLINE_MATCHER, '\n'),
                                    thread_id
                                } as ChatResponse))
                                .filter(result => result.type === ChatResponseType.Log || ChatResponseType.Final);
                        })
                    );

                    const promise = new Promise<string>((resolve) => {
                        stream.subscribe({
                            next: (response) => {
                                switch (response.type) {
                                    // case ChatResponseType.Log:
                                    //     if (message.reasoning === PROCESSING_VALUE) {
                                    //         message.reasoning = response.text;
                                    //     } else {
                                    //         message.reasoning += response.text;
                                    //     }
                                    //     break;
                                    case ChatResponseType.Final:
                                        // if (endTime === null) {
                                        //     endTime = Date.now();
                                        //     message.response_time = (endTime - startTime) / 1000;
                                        // }
                                        resolve(response.text);
                                        break;
                                }
                            },
                            error: () => {
                                resolve('There was an error processing your request');
                            },
                            complete: () => {
                            }
                        });
                    });
                    return await promise;
                }
            }
        } catch (e: any) {
            return '';
        }
    }
}

export const chatDataService = new ChatDataService();