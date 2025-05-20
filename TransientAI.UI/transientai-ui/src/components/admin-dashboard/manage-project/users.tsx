import { CollapseContainer } from '@/components/shared/ta-collapse/ta-collapse'
import { Checkbox, TextArea } from '@radix-ui/themes'
import React, { useState, useRef } from 'react'

enum ScreenDataType {
  AC_Number = 'AC Number',
  Margin_Cols = 'Margin Cols'
}

const Users = () => {
  const [accountNumbers, setAccountNumbers] = useState([
    { id: 1, number: '5166', selected: true },
    { id: 2, number: '561516', selected: true },
    { id: 3, number: '4854', selected: true },
    { id: 4, number: '595656', selected: true }
  ])

  const [marginCols, setMarginCols] = useState([
    { id: 1, number: 'IBIS_ALL*', selected: true },
    { id: 2, number: 'Andy Goldman', selected: true }
  ])

  const [accountTags, setAccountTags] = useState([
    '3746453',
    '3553344',
    '45454'
  ])
  const [marginTags, setMarginTags] = useState(['col1', 'col2', 'col3'])

  // Refs for text areas
  const accountTextAreaRef = useRef<HTMLTextAreaElement>(null)
  const marginTextAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleDelete = () => {
    setAccountNumbers(accountNumbers.filter(a => !a.selected))
  }

  const handleDeleteMargin = () => {
    setMarginCols(marginCols.filter(a => !a.selected))
  }

  const processTagInput = (value: string, type: ScreenDataType) => {
    if (value.trim() !== '') {
      const newTags = value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')

      if (newTags.length > 0) {
        if (type === ScreenDataType.AC_Number) {
          setAccountTags(prev => [...prev, ...newTags])
          if (accountTextAreaRef.current) {
            accountTextAreaRef.current.value = ''
          }
        } else if (type === ScreenDataType.Margin_Cols) {
          setMarginTags(prev => [...prev, ...newTags])
          if (marginTextAreaRef.current) {
            marginTextAreaRef.current.value = ''
          }
        }
      }
    }
  }

  const handleTagChange = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    type: ScreenDataType
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      processTagInput(e.currentTarget.value, type)
    }
  }

  const handleAddButtonClick = (type: ScreenDataType) => {
    const textAreaRef =
      type === ScreenDataType.AC_Number ? accountTextAreaRef : marginTextAreaRef
    if (textAreaRef.current) {
      processTagInput(textAreaRef.current.value, type)
    }
  }

  return (
    <>
      <CollapseContainer title={<span>Corporate Action</span>}>
        <div className='flex gap-8 mt-3 lg:flex-row flex-col'>
          <section className='lg:w-1/2 rounded-md'>
            <div className='flex items-center justify-between p-4 bg-gray-800'>
              <div className='flex items-center'>
                <Checkbox
                  checked={accountNumbers.every(a => a.selected)}
                  onCheckedChange={checked => {
                    setAccountNumbers(
                      accountNumbers.map(a => ({ ...a, selected: !!checked }))
                    )
                  }}
                  className='mr-3'
                />
                <span className='font-medium text-sm'>Account Numbers</span>
              </div>
              {accountNumbers.some(a => a.selected) && (
                <button
                  type='button'
                  aria-label='Delete icon'
                  className='text-red-500 cursor-pointer'
                  onClick={handleDelete}
                >
                  <i className='fa-solid fa-trash'></i>
                </button>
              )}
            </div>

            {/* Account List */}
            <div className='scrollable-div max-h-52'>
              {accountNumbers.map((account, ind) => (
                <div
                  key={account.id}
                  className='flex items-center p-4 border border-[#353b49]'
                >
                  <Checkbox
                    checked={account.selected}
                    onCheckedChange={checked => {
                      setAccountNumbers(
                        accountNumbers.map((a, i) =>
                          i === ind ? { ...a, selected: !!checked } : a
                        )
                      )
                    }}
                    className='mr-3'
                  />
                  <span>{account.number}</span>
                </div>
              ))}
            </div>
          </section>

          <section className='border border-[#353b49] rounded-sm p-4 lg:w-1/2'>
            <div className='mb-2 relative'>
              <TextArea
                ref={accountTextAreaRef}
                className='bg-transparent w-full pr-10'
                placeholder='Type and enter or give values in comma separated'
                onKeyDown={e => handleTagChange(e, ScreenDataType.AC_Number)}
              />
              <button
                type='button'
                onClick={() => handleAddButtonClick(ScreenDataType.AC_Number)}
                className='absolute w-7 h-7 flex top-2 right-2 justify-center items-center text-md rounded-full hover:bg-gray-700 text-blue-400'
                title='Add tags'
              >
                <i className='fa-light fa-plus'></i>
              </button>
            </div>
            <div className='flex flex-wrap gap-2 mt-2'>
              {accountTags.map((tag, index) => (
                <div
                  key={index}
                  className='py-1 px-2 text-sm rounded-md flex items-center bg-gray-800 border border-white/10 hover:bg-gray-700 transition-all'
                >
                  {tag}
                  <button
                    type='button'
                    className='ml-2 cursor-pointer hover:text-gray-500'
                    onClick={() =>
                      setAccountTags(accountTags.filter(t => t !== tag))
                    }
                    aria-label='close'
                  >
                    <i className='fa-solid fa-xmark'></i>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </CollapseContainer>
      <br></br>
      <CollapseContainer title={<span>Margin</span>}>
        <div className='flex gap-8 mt-3 lg:flex-row flex-col'>
          <section className='lg:w-1/2 rounded-md'>
            <div className='flex items-center justify-between p-4 bg-gray-800'>
              <div className='flex items-center'>
                <Checkbox
                  checked={marginCols.every(a => a.selected)}
                  onCheckedChange={checked => {
                    setMarginCols(
                      marginCols.map(a => ({ ...a, selected: !!checked }))
                    )
                  }}
                  className='mr-3'
                />
                <span className='font-medium text-sm'>Values</span>
              </div>
              {marginCols.some(a => a.selected) && (
                <button
                  type='button'
                  aria-label='Delete icon'
                  className='text-red-500 cursor-pointer'
                  onClick={handleDeleteMargin}
                >
                  <i className='fa-solid fa-trash'></i>
                </button>
              )}
            </div>

            {/* Account List */}
            <div className='scrollable-div max-h-52'>
              {marginCols.map((account, ind) => (
                <div
                  key={account.id}
                  className='flex items-center p-4 border border-[#353b49]'
                >
                  <Checkbox
                    checked={account.selected}
                    onCheckedChange={checked => {
                      setMarginCols(
                        marginCols.map((a, i) =>
                          i === ind ? { ...a, selected: !!checked } : a
                        )
                      )
                    }}
                    className='mr-3'
                  />
                  <span>{account.number}</span>
                </div>
              ))}
            </div>
          </section>

          <section className='border border-[#353b49] rounded-sm p-4 lg:w-1/2'>
            <div className='mb-2 relative'>
              <TextArea
                ref={marginTextAreaRef}
                className='bg-transparent w-full pr-10'
                placeholder='Type and enter or give values in comma separated'
                onKeyDown={e => handleTagChange(e, ScreenDataType.Margin_Cols)}
              />
              <button
                type='button'
                onClick={() => handleAddButtonClick(ScreenDataType.Margin_Cols)}
                className='absolute w-7 h-7 flex top-2 right-2 justify-center items-center text-md rounded-full hover:bg-gray-700 text-blue-400'
                title='Add tags'
              >
                <i className='fa-light fa-plus'></i>
              </button>
            </div>
            <div className='flex flex-wrap gap-2 mt-2'>
              {marginTags.map((tag, index) => (
                <div
                  key={index}
                  className='py-1 px-2 text-sm rounded-md flex items-center bg-gray-800 border border-white/10 hover:bg-gray-700 transition-all'
                >
                  {tag}
                  <button
                    type='button'
                    className='ml-2 cursor-pointer hover:text-gray-500'
                    onClick={() =>
                      setMarginTags(marginTags.filter(t => t !== tag))
                    }
                    aria-label='close'
                  >
                    <i className='fa-solid fa-xmark'></i>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </CollapseContainer>
    </>
  )
}

export default Users
