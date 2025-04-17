import { create } from 'zustand'
import { ITranscriptsList } from './model'

interface INotesAIDataState {
  transcriptsList: ITranscriptsList[] | [];
  setTranscriptList: (transcriptList: ITranscriptsList[]) => void;
  selectedTranscript: ITranscriptsList | null;
  setSelectedTranscript: (transcript: ITranscriptsList) => void;
  transcriptOriginalSummary: any[];
  setTranscriptOriginalSummary: (originalSummary:any)=>void;
}

export const useNotesAIDataStore = create<INotesAIDataState>((set, get) => ({
  transcriptsList: [],
  selectedTranscript: null,
  transcriptOriginalSummary: [],

  setSelectedTranscript: transcript => set({ selectedTranscript: transcript }),
  setTranscriptList: transcriptList => set({transcriptsList : transcriptList}),
  setTranscriptOriginalSummary: originalSummary => set({transcriptOriginalSummary: originalSummary})
}))
