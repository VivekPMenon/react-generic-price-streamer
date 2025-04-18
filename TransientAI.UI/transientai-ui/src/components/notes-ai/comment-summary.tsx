'use client'

import { useEffect, useRef, useState } from 'react';
import Toggle from 'react-toggle';
import Quill from 'quill'; 
import 'react-quill/dist/quill.snow.css';

const CommentSummary = () => {
    const [addComment, setAddComment] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');
    const quillRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (quillRef.current) {
            const quill = new Quill(quillRef.current, {
                theme: 'snow',
                placeholder: 'Add your comment...',
                modules: {
                    toolbar: [
                        [{ 'bold': true }, { 'italic': true }, { 'underline': true }]
                    ]
                }
            });
            // Sync the content of Quill with state
            quill.on('text-change', () => {
                setComment(quill.root.innerHTML); // Save the content of the editor in state
            });
        }
    }, [addComment]);

    return (
        <div>
            <div className="grid grid-cols-3 items-start mb-4">
                <div className="col-span-2 grid grid-cols-1 text-xs gap-1 text-white">
                    <span>Yesterday</span>
                    <span>Originator: David Kim</span>
                    <span>Commented by: Manju R</span>
                    <span>Read by: Ashok, Chris N, David K, Manju R, Rob</span>
                </div>
                <div className="flex items-center justify-end gap-2 p-3">
                    <Toggle
                        onChange={(value) => console.log(value.target.checked)}
                        checked={true}
                        className="switch-summary"
                        icons={false}
                        id="Summary"
                    />
                    <span className="min-w-[100px] text-blue-400 font-medium">
                        {"AI Summary"}
                    </span>
                </div>
            </div>

            <div className="mb-1">
                <div className="mb-1 text-end">
                    <span className='cursor-pointer' onClick={() => setAddComment(!addComment)}>
                        <i className="fa-regular fa-pen-to-square mr-1"></i>
                        Add Comment
                    </span>
                </div>
                {addComment && (
                    <div className="mb-2">
                        <div className="mb-1">
                            {/* <textarea
                                className="w-full bg-gray-800 p-2 rounded"
                                placeholder="Add your comment here"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            /> */}
                            {/* <ReactQuill
                                theme="snow"
                                value={comment}
                                onChange={setComment}
                                placeholder="Add your comment..."
                            /> */}
                            <div
                                ref={quillRef} 
                                className="w-full bg-gray-800 p-2 rounded"
                            ></div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                className="cursor-pointer bg-teal-600 text-white rounded px-4 py-1" 
                                onClick={() => ''}
                            >
                                Save
                            </button>
                            <button 
                                className="cursor-pointer bg-gray-500 text-white rounded px-4 py-1" 
                                onClick={() => setAddComment(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-b max-h-[192px] scrollable-div">
                {/* Sample comments data for loop */}
                <div className="mb-2">
                    <span className="text-xs text-teal-400 block mb-1">
                        Yesterday, 15:05 | Commented by: Manju R
                    </span>
                    <div className="mb-1">
                        <p>Comment content here</p>
                    </div>
                </div>
                <div className="mb-2">
                    <span className="text-xs text-teal-400 block mb-1">
                        Yesterday, 15:05 | Commented by: Manju R
                    </span>
                    <div className="mb-1">
                        <p>Comment content here</p>
                    </div>
                </div>
                <div className="mb-2">
                    <span className="text-xs text-teal-400 block mb-1">
                        Yesterday, 15:05 | Commented by: Manju R
                    </span>
                    <div className="mb-1">
                        <p>Comment content here</p>
                    </div>
                </div>
                <div className="mb-2">
                    <span className="text-xs text-teal-400 block mb-1">
                        Yesterday, 15:05 | Commented by: Manju R
                    </span>
                    <div className="mb-1">
                        <p>Comment content here</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentSummary;