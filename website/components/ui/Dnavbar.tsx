"use client";
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect } from 'react';
import { RiNotification3Fill } from 'react-icons/ri';
import NotificationContainer from './notif_container';
import { MdKeyboardArrowDown } from 'react-icons/md';

const Dnavbar = () => {



  return (
    <nav className='pl-5 lg:pl-0 ml-2  w-[98%] bg-blue-90 justify-between rounded-md mb-2'>
      <div className=' flex   flex-row justify-between  pl-5 pr-5 pt-1 pb-1'>
        <div className='flex  flex-row p-0 justify-start w-full'>
          <div className='flex flex-row  items-center justify-start'>
            <Image src='/icons/line-md--search.svg' alt='search' width={25} height={25} />
            <input name='search' type='text' value='' placeholder='Search here ....'
              className=' block m-2 rounded-lg  pl-5 bg-gray-20 
            border-2 focus:border-sky-200 focus:outline-none' /></div>
        </div>
        <div className='flex  justify-end  w-[25%] gap-[12%] text-white '>
          <NotificationContainer />
          <Link href='/dashboard/settings'>
            <Image src='/person-3.png' alt='search' width={48} height={20} className=' rounded-full ' />
          </Link>
        </div>

      </div>
    </nav>
  )
}

export default Dnavbar

