'use client';

import React from "react";
import {enumToKeyValuePair} from "@/lib/utility-functions/enum-operations";
import { AgentType } from "@/services/chat-data";
import {chatDataStore} from "@/services/chat-data/chat-data-store";
import styles from "./chat.module.scss";
import {ChatbotResponse} from "@/components/chatbot/chatbot-response";
const Agents = enumToKeyValuePair(AgentType);

export function Chat() {
    const isLoading = chatDataStore.use.isLoading();
    const selectedThread = chatDataStore.use.selectedThread();
    const addToThread = chatDataStore.use.addToThread();
    const agent = chatDataStore.use.agent();
    const setAgent = chatDataStore.use.setAgent();

    return (
        <div className={`${styles['chat-container']} widget`}>
            <div className={`${styles['chat-agent-container']}`}>
                <select
                    id="agent"
                    value={agent}
                    onChange={(e) => setAgent(e.target.value)}
                    className={`rounded px-4 py-2 text-sm font-medium shadow-sm bg-gray-800 border-gray-600`}
                >
                    {
                        Agents.map(agent => (
                            <option key={agent.value} value={agent.value}>{agent.key}</option>)
                        )
                    }
                </select>
            </div>
            <ChatbotResponse
                showBackButton={false}
                inputHint={'Ask TransientAI anything'}
                selectedThread={selectedThread}
                isLoading={isLoading}
                addToThread={addToThread}
                setIsChatbotResponseActive={null}
                isChatbotResponseActive={true}
            />
        </div>
    );
}