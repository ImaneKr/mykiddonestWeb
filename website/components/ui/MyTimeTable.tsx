import React, { useState } from 'react';
import { TimeTableA, TimingA, TimingB, TimeTableB } from '@/models/timeTable';
import { styled } from '@mui/material';

type TimeTableProps = {
  category: String;
  isEditPressed: boolean;
};

const MyTimeTable = ({ category, isEditPressed }: TimeTableProps) => {
  // Define state variable to hold modified subject values
  const [modifiedSubjects, setModifiedSubjects] = useState(() => {
    let initialTable;
    if (category === 'A') {
      initialTable = TimeTableA;
    } else if (category === 'B') {
      initialTable = TimeTableB;
    } else {
      // Handle invalid category
      throw new Error('Invalid category');
    }
    return initialTable.days.map(day => day.subjects.map(subject => subject.name));
  });

  // Event handler to update state when a subject value changes
  const handleSubjectChange = (dayIndex: number, subjectIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSubjects = [...modifiedSubjects];
    updatedSubjects[dayIndex][subjectIndex] = event.target.value;
    setModifiedSubjects(updatedSubjects);
  };

  let currentTable;
  let currentTiming;
  if (category === 'A') {
    currentTable = TimeTableA;
    currentTiming = TimingA;
  } else if (category === 'B') {
    currentTable = TimeTableB;
    currentTiming = TimingB;
  } else {
    // Handle invalid category
    return <div>Invalid category</div>;
  }

  return (
    <div className="flex flex-col h-auto overflow-x-scroll">
      <div className='pl-24 flex flex-row gap-36'>{currentTiming.map((timing, index) => (<div key={index} className='text-black font-serif text-sm font-medium w-4 '>{timing}</div>))}</div>
      {currentTable.days.map((day, dayIndex) => (
        <div className='flex flex-row p-2 gap-3' key={dayIndex}>
          <div className='flex w-28 items-center rounded-md bg-green-400 p-2 text-ms font-sans font-medium text-white'><p className='items-center justify-center flex w-28'>{day.day}</p> </div>
          {day.subjects.map((subject, subjectIndex) => (
            <div key={subjectIndex}>
              <div>
                <input
                  type='text'
                  value={modifiedSubjects[dayIndex][subjectIndex]}
                  onChange={(event) => handleSubjectChange(dayIndex, subjectIndex, event)}
                  className={`flex w-36 pt-2 pb-2 border border-gray-300 bg-gray-10 rounded-md px-2 text-gray-90 font-sans group focus:outline-none ${isEditPressed ? 'border-2 border-dashed border-green-400' : ''} `}
                  disabled={!isEditPressed}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyTimeTable;
