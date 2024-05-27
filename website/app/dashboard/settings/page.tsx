'use client';
import React from 'react';
import SettingPage from '@/components/ui/settingPage';

const Page = () => {
  return (
    <div className='flex flex-col w-full justify-center items-center'>
      <div className='bg-white mt-1 ml-1 p-3 flex flex-col w-[99%] rounded-md'>
        <p className='text-2xl bold-32'>Settings</p>
        <p className='regular-16 text-gray-99'>Customize until it matches your workflow</p>
        <SettingPage />
      </div>
    </div>
  );
};

export default Page;
