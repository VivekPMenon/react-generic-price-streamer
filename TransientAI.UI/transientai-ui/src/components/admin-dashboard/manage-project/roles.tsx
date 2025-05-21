'use client'

import { useState } from 'react'
import { Checkbox, TextArea } from '@radix-ui/themes'
import { Tooltip } from 'react-tooltip'
import { CollapseContainer } from '@/components/shared/ta-collapse/ta-collapse'

interface IScreenList {
  id: number
  screen: string
  is_selected: boolean
}

interface IPnLList {
  id: number
  screen: string
  is_selected: boolean
}

const Roles = () => {
  const [screens, setScreens] = useState<IScreenList[]>([
    { id: 1, screen: 'Macro Panel', is_selected: true },
    { id: 2, screen: 'Reasearch Panel', is_selected: true },
    { id: 3, screen: 'News panel', is_selected: true },
    { id: 4, screen: 'Corporate Actions', is_selected: true },
    { id: 5, screen: 'Corporate Actions', is_selected: true },
    { id: 6, screen: 'Corporate Actions', is_selected: true },
    { id: 7, screen: 'Corporate Actions', is_selected: true },
    { id: 8, screen: '561516', is_selected: true },
    { id: 9, screen: '4854', is_selected: true },
    { id: 10, screen: '595656', is_selected: true }
  ])

  const [pnLList, setPnLList] = useState<IPnLList[]>([
    { id: 1, screen: 'Manager', is_selected: true },
    { id: 2, screen: 'Day Pnl', is_selected: true },
    { id: 3, screen: 'MTD Pnl', is_selected: true },
    { id: 4, screen: 'YTD Pnl', is_selected: true }
  ])

  return (
    <div>
      <CollapseContainer
        title={
          <div className='flex items-center'>
            <Checkbox
              checked={screens.every(screen => screen.is_selected)}
              onCheckedChange={checked =>
                setScreens(screens.map(s => ({ ...s, is_selected: !!checked })))
              }
              className='mr-3'
            />
            <span>Screens</span>
          </div>
        }
      >
        <section className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
          {screens.map((item, ind) => (
            <div
              key={ind}
              className='flex items-center bg-[#1F2937] p-4 rounded-sm'
            >
              <Checkbox
                checked={item.is_selected}
                onCheckedChange={checked =>
                  setScreens(
                    screens.map((s, i) =>
                      i === ind ? { ...s, is_selected: !!checked } : s
                    )
                  )
                }
                className='mr-3'
              />
              <span className='truncate'>{item.screen}</span>
            </div>
          ))}
        </section>
      </CollapseContainer>
      <br></br>
      <CollapseContainer
        title={
          <div className='flex items-center'>
            <Checkbox
              checked={pnLList.every(screen => screen.is_selected)}
              onCheckedChange={checked =>
                setPnLList(pnLList.map(s => ({ ...s, is_selected: !!checked })))
              }
              className='mr-3'
            />
            <span>P&L</span>
          </div>
        }
      >
        <section className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
          {pnLList.map((item, ind) => (
            <div
              key={ind}
              className='flex items-center bg-[#1F2937] p-4 rounded-sm'
            >
              <Checkbox
                checked={item.is_selected}
                onCheckedChange={checked =>
                  setPnLList(
                    pnLList.map((s, i) =>
                      i === ind ? { ...s, is_selected: !!checked } : s
                    )
                  )
                }
                className='mr-3'
              />
              <span className='truncate'>{item.screen}</span>
            </div>
          ))}
        </section>
      </CollapseContainer>
    </div>
  )
}

export default Roles
