// pages/page.js
'use client';
import React, { useEffect, useState } from 'react';
import CategorySelect from '@/components/ui/categorySelect';
import MyTimeTable from '@/components/ui/MyTimeTable';
import { MdOutlineEditCalendar } from 'react-icons/md';

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState('A');
  const [editButtonState, setEditButtonState] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleSelectChange = (value: any) => {
    setSelectedCategory(value);
  };

  const handleButtonPress = () => {
    setEditButtonState(!editButtonState);
  };
  useEffect(() => {
    const userole = localStorage.getItem('userRole');
    setUserRole(userole);
  }, []);
  return (
    <div className="flex flex-col h-full lg:pl-10 lg:pr-10 pl-5 pr-5 pb-4 pt-2 gap-2 bg-white rounded-md mt-1 ml-1 mr-2">
      <div className="flex flex-row justify-between pt-3">
        <h1 className='inline-block bold-32 '> Time Tables</h1>
        <div className='w-auto flex flew-row gap-5  '>
          {(userRole === 'admin' || userRole === 'secretary') && (<button onClick={handleButtonPress} disabled={editButtonState}>
            <div className='w-7'>
              <MdOutlineEditCalendar className={`w-full h-full ${editButtonState ? 'opacity-20' : ''}`} /></div></button>)}<CategorySelect onSelectChange={handleSelectChange} /></div>
      </div>
      {selectedCategory === 'A' ? (
        <div className='flex  p-2 pt-4'><MyTimeTable category={'A'} isEditPressed={editButtonState} role={userRole} /></div>
      ) : selectedCategory === 'B' ? (
        <div className='flex p-2'><MyTimeTable category={'B'} isEditPressed={editButtonState} role={userRole} /></div>
      ) : null}
    </div>
  );
};

export default Page;
