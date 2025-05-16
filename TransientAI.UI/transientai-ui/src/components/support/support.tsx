// SupportWidget.jsx
'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Tooltip } from 'react-tooltip'

const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleWidget = () => {
    setIsOpen(!isOpen)
  }

  const phoneNumber = '+1 (786) 893-8777';
  const emailAddress = 'support@hurricanecap.com';
  const whatsAppLink = 'https://wa.me/message/TC637VJOUXSHB1';
  const whatsAppQRImg = '/images/whats_app_qr.png';
  const whatsappCallLink = `https://wa.me/+1(786)893-8777?call=true`;


  // Modal Component for displaying the image in full size
  const modalComponent = isModalOpen ? (
    <div
      className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'
      onClick={() => setIsModalOpen(false)}
    >
      <button
        className={`fixed top-16 right-5 text-white text-3xl font-bold bg-gray-800 hover:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center`}
        onClick={() => setIsModalOpen(false)}
      >
        &times;
      </button>
      <div className='relative w-3/4 h-3/4'>
        <Image
          src={whatsAppQRImg}
          alt='WhatsApp QR Code Full Size'
          fill
          sizes='(max-width: 768px) 16rem, 20rem'
          className='object-contain'
          priority
        />
      </div>
    </div>
  ) : null

  

  return (
    <div className='fixed bottom-4 right-4 z-[200]'>
      {/* Support tab button */}
      <div className='flex mb-2'>
        <button
          onClick={toggleWidget}
          className='ml-auto bg-gray-800 text-white p-2 w-8 h-8 justify-center text-lg rounded-full flex items-center gap-2'
        >
          {isOpen ? (
            <i
              className='fa-solid fa-xmark'
              data-tooltip-id='my-tooltip'
              data-tooltip-content='Close'
            ></i>
          ) : (
            <i
              className='fa-solid fa-headset'
              data-tooltip-id='my-tooltip'
              data-tooltip-content='Support'
            ></i>
          )}
          {/* <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ↑
          </span> */}
        </button>
      </div>

      {/* Main support widget */}
      {isOpen && (
        <div className='bg-gray-900 rounded-2xl p-5 shadow-lg w-80 border border-gray-700'>
          <div className='grid grid-cols-2 gap-4'>
            {/* WhatsApp QR */}
            <div className='bg-gray-800 rounded-lg p-3 flex flex-col items-center'>
              <div className='text-green-500 text-xl mb-1 flex gap-1 items-center'>
                <i className='fa-brands fa-whatsapp'></i>
                <span className='text-white text-xs'>WhatsApp</span>
              </div>
              <div className='bg-white p-2 rounded-md'>
                <div className='relative w-16 h-16'>
                  <Image
                    onClick={() => setIsModalOpen(true)}
                    src='/images/whats_app_qr.png'
                    alt='WhatsApp QR Code'
                    layout='fill'
                    className='rounded-md'
                  />
                </div>
              </div>
              <span className='text-gray-400 text-xs mt-1 text-center'>
                Click to scan for WhatsApp support
              </span>
            </div>

            {/* WhatsApp Link */}
            <div className='bg-gray-800 rounded-lg p-3 flex flex-col items-center'>
              <div className='text-green-500 text-xl mb-1 flex gap-1 items-center'>
                <i className='fa-brands fa-whatsapp'></i>
                <span className='text-white text-xs'>WhatsApp</span>
              </div>
              <a
                href={whatsAppLink}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-gray-700 p-2 rounded-md'
              >
                <div className='w-16 h-16 flex items-center justify-center'>
                 <i className="fa-regular fa-message  text-2xl"></i>
                </div>
              </a>
              <span className='text-gray-400 text-xs mt-1 text-center'>
                Click to start WhatsApp chat
              </span>
            </div>

            {/* WhatsApp Text */}
            <div className='bg-gray-800 rounded-lg p-3 flex flex-col items-center'>
              <div className='text-green-500 text-xl mb-1 flex gap-1 items-center'>
                <i className='fa-brands fa-whatsapp'></i>
                <span className='text-white text-xs'>WhatsApp</span>
              </div>
              <a
                href={whatsappCallLink}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-gray-700 p-2 rounded-md'
              >
                <div className='w-16 h-16 flex items-center justify-center'>
                  <i className='fa-regular fa-phone text-2xl'></i>
                </div>
              </a>
              <span className='text-gray-400 text-xs mt-1 text-center'>
                {phoneNumber}
              </span>
            </div>

            {/* Email support */}
            <div className='bg-gray-800 rounded-lg p-3 flex flex-col items-center'>
              <div className='text-green-500 mb-1 text-xl flex gap-1 items-center'>
                <i className="fa-light fa-envelope"></i>
                <span className='text-white text-xs'>Email</span>
              </div>
              <a
                href={`mailto:${emailAddress}`}
                className='bg-gray-700 p-2 rounded-md'
              >
                <div className='w-16 h-16 flex items-center justify-center'>
                 <i className="fa-light fa-envelope text-2xl"></i>
                </div>
              </a>
              <span className='text-gray-400 text-xs mt-1 text-center max-w-full'>
                {emailAddress}
              </span>
            </div>
          </div>

          {/* Scan QR instructions */}
          <div className='mt-4 text-center'>
            <p className='text-gray-400 text-xs'>
              Scan QR or Click link for WhatsApp support
            </p>
          </div>
        </div>
      )}
      <Tooltip id='my-tooltip' />
      {modalComponent}
    </div>
  )
}

export default SupportWidget