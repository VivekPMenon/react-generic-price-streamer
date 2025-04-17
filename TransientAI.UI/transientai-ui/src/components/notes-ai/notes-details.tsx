'use client'

import Toggle from 'react-toggle'
import { useEffect, useState } from 'react'
import { Accordion } from '../accordion/accordion'
import {
  formatDateToReadable,
  formatTime
} from '@/lib/utility-functions/date-operations'
import { Spinner } from '@radix-ui/themes'
import { IOriginalTranscripts } from '@/services/notes-ai/model'
import { notesAIDataService, useNotesAIDataStore } from '@/services/notes-ai'

enum ESUMMARY {
  AI = 'AI SUMMARY',
  ORIGINAL = 'ORIGINAL'
}

const NotesDetail = () => {
  const [commentSummary, setCommentSummary] = useState<ESUMMARY>(ESUMMARY.AI)
  const [summary, setSummary] = useState<ESUMMARY>(ESUMMARY.AI)
  const [transcriptAISummaryDetails, setTranscriptAISummaryDetails] =
    useState<any>(null)
  const [transcriptOriginalDetails, setTranscriptOriginalDetails] = useState<
    IOriginalTranscripts[]
  >([])
  const [accordionItems, setAccordionItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { selectedTranscript, transcriptOriginalSummary } =
    useNotesAIDataStore()

  useEffect(() => {
    async function fetchTranscriptsAISummaryDetails () {
      if (!selectedTranscript?.blob_name) {
        return
      }
      try {
        setIsLoading(true)
        setTranscriptAISummaryDetails(null)
        setAccordionItems([]);
        const res = await notesAIDataService.getTranscriptDetails(
          selectedTranscript?.blob_name
        )
        setTranscriptAISummaryDetails(res?.data);
        setSummary(ESUMMARY.AI);

        // Process the meeting data to create accordion items
        if (res?.data?.outline) {
          const items = processMeetingData(res.data.outline)
          setAccordionItems(items)
        }
      } catch {
      } finally {
        setIsLoading(false)
      }
    }
    fetchTranscriptsAISummaryDetails()
  }, [selectedTranscript])

  useEffect(() => {
    // Function moved inside useEffect
    const handleSetOriginalSummary = () => {
      if (transcriptOriginalSummary?.length > 0) {
        const originalSummary = parseTranscript(
          transcriptOriginalSummary[0]?.content
        )
        setTranscriptOriginalDetails(originalSummary || [])
      }
    }

    handleSetOriginalSummary()
  }, [transcriptOriginalSummary, setTranscriptOriginalDetails])

  // Function to process meeting data and convert to accordion items
  const processMeetingData = meetingData => {
    if (!meetingData || !Array.isArray(meetingData)) return []

    return meetingData.map((topic, index) => {
      return {
        value: `topic-${index}`,
        title: topic.topic,
        titleTextStyle: 'text-gray-400 !text-xs',
        content: (
          <div className='ml-4'>
            <div className='text-sm mb-2 text-blue-400'>
              Speaker: {topic.speaker || 'Unknown'}
            </div>
            {topic.bullet_points && topic.bullet_points.length > 0 && (
              <div className='mb-3'>
                <ul className='list-disc pl-6 off-white-color-alt'>
                  {topic.bullet_points.map((point, i) => (
                    <li key={i} className='text-sm mb-1'>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {topic.subtopics && topic.subtopics.length > 0 && (
              <div className='ml-3'>
                <Accordion
                  type='single'
                  items={topic.subtopics.map((subtopic, subIndex) => ({
                    value: `subtopic-${index}-${subIndex}`,
                    title: subtopic.topic,
                    titleTextStyle: 'text-gray-400',
                    content: (
                      <div className='ml-4'>
                        {subtopic.speaker && (
                          <div className='text-sm mb-2 text-blue-400'>
                            Speaker: {subtopic.speaker}
                          </div>
                        )}

                        {subtopic.bullet_points &&
                          subtopic.bullet_points.length > 0 && (
                            <ul className='list-disc pl-6 off-white-color-alt'>
                              {subtopic.bullet_points.map((point, i) => (
                                <li key={i} className='text-sm mb-1'>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          )}

                        {subtopic.subtopics && subtopic.subtopics.length > 0 && (
                          <div className='mt-3'>
                            <Accordion
                              type='single'
                              items={subtopic.subtopics.map(
                                (nestedSubtopic, nestedIndex) => ({
                                  value: `nested-subtopic-${index}-${subIndex}-${nestedIndex}`,
                                  title: nestedSubtopic.topic,
                                  titleTextStyle: 'text-gray-400',
                                  content: (
                                    <div className='ml-4'>
                                      {nestedSubtopic.bullet_points &&
                                        nestedSubtopic.bullet_points.length >
                                          0 && (
                                          <ul className='list-disc pl-6 off-white-color-alt'>
                                            {nestedSubtopic.bullet_points.map(
                                              (point, i) => (
                                                <li
                                                  key={i}
                                                  className='text-sm mb-1'
                                                >
                                                  {point}
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        )}
                                    </div>
                                  )
                                })
                              )}
                            />
                          </div>
                        )}
                      </div>
                    )
                  }))}
                />
              </div>
            )}
          </div>
        )
      }
    })
  }

  function formatTimeToAmPm(timeStr: string): string { //'input value : 0:30,etc'
    // If these are actual times of day (assuming 24-hour format)
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Option 1: Convert to 12-hour format with AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const twelveHour = hours % 12 || 12; // Convert 0 to 12
    return `${twelveHour}:${minutes.toString().padStart(2, '0')} ${period}`;
    
    // Option 2: If these are just minutes:seconds of a recording
    // return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  const showAISummaryView = () => {
    return (
      <>
        <div className='grid grid-cols-1 gap-4 mt-2'>
          <div>
            <span className='text-base font-medium'>Overview :</span>
            <p className='text-sm ml-4'>
              {transcriptAISummaryDetails?.overview}
            </p>
          </div>
          <div>
            <span className='text-base font-medium'>Meeting Points :</span>
            <ul className='list-disc pl-8 off-white-color-alt'>
              {transcriptAISummaryDetails?.action_items?.map(
                (item: string, index: number) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>
          </div>

          <div>
            <span className='text-base font-medium'>Details View :</span>
            <div className='ml-4 max-h-[calc(100vh-550px)] overflow-y-auto scrollable-div'>
              <Accordion type='single' items={accordionItems} />
            </div>
          </div>
        </div>
      </>
    )
  }

  const showOriginalSummaryView = () => {
    return (
      <>
        {/* Chat Messages Container */}
        <div className='flex-1 p-4 overflow-y-auto max-h-[calc(100vh-175px)] scrollable-div'>
          {transcriptOriginalDetails.map((item, index) => (
            <div key={index} className='mb-6'>
              <div className='flex items-start'>
                <div className='flex-1'>
                  <div className='flex items-baseline text-teal-400'>
                    <span className='text-base font-medium'>{item.speaker}</span>
                    <span className='ml-2 text-xs'>{formatTimeToAmPm(item.time)}</span>
                  </div>

                  <div className='text-sm'>{item.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  function parseTranscript (rawText: string): IOriginalTranscripts[] {
    const lines = rawText
      .replace(/\r\n/g, '\n') // Normalize line endings
      .split('\n')
      .filter(line => line.trim() !== '')

    const parsed: IOriginalTranscripts[] = []
    let currentSpeaker: string = ''
    let currentTime: string = ''
    let currentText: string[] = []

    const speakerRegex = /^(.+?)\s+(\d+:\d{2})$/

    lines.forEach(line => {
      const match = line.match(speakerRegex)
      if (match) {
        // Save previous speaker's data if it exists
        if (currentSpeaker && currentText.length) {
          parsed.push({
            speaker: currentSpeaker,
            time: currentTime,
            text: currentText.join(' ').trim()
          })
        }
        currentSpeaker = match[1].trim()
        currentTime = match[2]
        currentText = []
      } else {
        currentText.push(line.trim())
      }
    })

    // Push the final segment
    if (currentSpeaker && currentText.length) {
      parsed.push({
        speaker: currentSpeaker,
        time: currentTime,
        text: currentText.join(' ').trim()
      })
    }

    return parsed
  }

  return (
    <>
      {selectedTranscript ? (
        <div className='w-full flex flex-col'>
          {/* <div className='grid grid-cols-3 items-start mb-4'>
            <div className='col-span-2 grid grid-cols-1 text-xs gap-1 text-white'>
              <span>Yesterday</span>
              <span>Originator: David Kim</span>
              <span>Commented by: Manju R</span>
              <span>Read by: Ashok, Chris N, David K, Manju R, Rob</span>
            </div>
            <div className='flex items-center justify-end gap-2 p-3'>
              <Toggle
                onChange={value =>
                  setCommentSummary(
                    value.target.checked ? ESUMMARY.AI : ESUMMARY.ORIGINAL
                  )
                }
                checked={commentSummary == ESUMMARY.AI}
                className={'switch-summary'}
                icons={false}
                id='Summary'
              />
              <span className='min-w-[100px] text-blue-400 font-medium'>
                {commentSummary}
              </span>
            </div>
          </div>

          <div className='border-b border-gray-700'>
            <span className='text-xs text-teal-400'>
              Yesterday, 15:05 | Commented by: Manju R
            </span>
            <div className='mt-1 bg-yellow-900 bg-opacity-40 p-2 rounded'>
              <p className='text-yellow-100'>Comment content here</p>
            </div>
          </div> */}

          <div className='grid grid-cols-3 items-start'>
            <div className='col-span-2 p-4 grid grid-cols-1'>
              <span className='text-xs text-gray-400'>
                {formatDateToReadable(selectedTranscript?.created_at)},{' '}
                {formatTime(selectedTranscript?.created_at)} 
                {/* | Original Message: David Kim */}
              </span>

              <span className='text-base font-medium flex-1'>
                {selectedTranscript?.blob_name}
              </span>
            </div>
            <div className='flex items-center justify-end gap-2 p-3'>
              <Toggle
                // disabled
                onChange={value =>
                  setSummary(
                    value.target.checked ? ESUMMARY.AI : ESUMMARY.ORIGINAL
                  )
                }
                checked={summary == ESUMMARY.AI}
                className={'switch-summary'}
                icons={false}
                id='Summary'
              />
              <span className='min-w-[100px] text-blue-400 font-medium'>
                {summary}
              </span>
            </div>
          </div>
          {transcriptAISummaryDetails && (
            <>
              {summary === ESUMMARY.AI
                ? showAISummaryView()
                : showOriginalSummaryView()}
            </>
          )}
          {isLoading && (
            <div className='flex w-full justify-center'>
              <Spinner />
            </div>
          )}
        </div>
      ) : (
        <div className='flex flex-col w-full h-full justify-center items-center p-6'>
          <div className='max-w-md w-full bg-slate-800 rounded-lg shadow-xl p-8 text-center border border-slate-700'>
            <div className='flex justify-center mb-4'>
              <i className='fas fa-file-alt text-blue-400 text-4xl'></i>
            </div>
            <h2 className='text-xl font-semibold mb-2'>
              No Transcripts Selected
            </h2>
            <p className='text-slate-300'>
              Please select a transcript file to view its contents
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default NotesDetail
