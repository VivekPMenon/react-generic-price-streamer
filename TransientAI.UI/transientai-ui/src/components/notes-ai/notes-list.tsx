'use client'

import { formatDateToReadable } from '@/lib/utility-functions/date-operations'
import { Skeleton } from '@radix-ui/themes'
import { useEffect } from 'react'
import styles from './notes-ai.module.scss'
import { notesAIDataService, useNotesAIDataStore } from '@/services/notes-ai'

const NotesList = () => {
  const {
    transcriptsList,
    setTranscriptList,
    setSelectedTranscript,
    setTranscriptOriginalSummary,
    selectedTranscript
  } = useNotesAIDataStore()

  useEffect(() => {
    async function getTranscriptList () {
      
      try {
        const res = await notesAIDataService.getTranscriptsList();
        setTranscriptList(res.transcripts || []);
      } catch {}
    }

    async function getTranscripOriginalSummary () {
      
      try {
        const res = await notesAIDataService.getTranscriptOriginalDetails();
        setTranscriptOriginalSummary(res.transcripts || []);
      } catch {}
    }
    getTranscriptList();
    getTranscripOriginalSummary();
  }, [setTranscriptList,setTranscriptOriginalSummary]);

  return (
    <div className='w-full flex flex-col'>
      <div className='p-4 flex justify-between items-center'>
        <h2 className='text-lg font-medium flex-1 text-center'>All Notes</h2>
        <button className='p-2 text-2xl text-gray-400 hover:text-white'>
          <i className='fa-regular fa-pen-to-square'></i>
        </button>
      </div>

      <div className='px-4 py-3'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Ask notes AI'
            className='w-full bg-gray-700 rounded py-2 px-4 text-sm'
          />
          <div className='mt-2 min-h-[150px] bg-gray-700 rounded p-3 text-sm text-gray-400'>
            prompt results here...
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-auto'>
        {transcriptsList.length > 0 ? (
          transcriptsList.map(note => (
            <div
              key={note.blob_name}
              className={`p-2 my-2 flex items-center cursor-pointer rounded-lg bg-gray-800 ${
                note.blob_name == selectedTranscript?.blob_name
                  ? `${styles['active']}`
                  : ''
              }`}
              onClick={() => setSelectedTranscript(note)}
            >
              <div className='mr-3 text-gray-400 text-lg'>
                <i className='fa-regular fa-pen-to-square'></i>
              </div>
              <div className='flex-1'>
                <div className='text-sm font-medium ellipsis max-w-[80%]'>
                  {note.blob_name}
                </div>
                <div className='text-xs text-gray-400'>
                  {formatDateToReadable(note.created_at)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='w-full gap-2 grid grid-cols-1 justify-center p-4'>
            <Skeleton height={"45px"} width={"100%"}/>
            <Skeleton height={"45px"} width={"100%"}/>
            <Skeleton height={"45px"} width={"100%"}/>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotesList
