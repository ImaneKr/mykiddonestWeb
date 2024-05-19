import React, { useEffect, useState } from 'react';
import axios from 'axios';
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

type TimeTableProps = {
  category: string;
  isEditPressed: boolean;
};

type TimetableEntry = {
  id?: number;
  category_id: number;
  subject_name: string;
  day_of_week: string;  // Note: day_of_week is a string
  start_time: string;
  end_time: string;
  duration: number;
};

const MyTimeTable = ({ category, isEditPressed }: TimeTableProps) => {
  const [modifiedSubjects, setModifiedSubjects] = useState<string[][]>([]);
  const [timetableData, setTimetableData] = useState<TimetableEntry[] | null>(null);

  // Define timing array
  const Timing: string[] = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];

  // Define days array
  const Days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  let category_id;
  if (category === 'A') {
    category_id = 1;
  } else if (category === 'B') {
    category_id = 2;
  } else {
    return <div>Invalid category</div>;
  }

  // Fetch timetable data on component mount
  useEffect(() => {
    const fetchTimetablesEntry = async (category_id: number) => {
      try {
        const response = await axios.get(`${backendURL}/timetable/${category_id}`);
        const Table = response.data;
        console.log()

        // Create an array to hold the modified subjects
        const subjectsArray = Array.from({ length: Days.length }, () => Array(Timing.length).fill(''));

        // Map fetched data to the corresponding indices
        Table.forEach((entry: TimetableEntry) => {
          const dayIndex = Days.indexOf(entry.day_of_week);
          const timeIndex = Timing.indexOf(entry.start_time.slice(0, 5));  // Adjust time format
          if (dayIndex >= 0 && dayIndex < Days.length && timeIndex >= 0 && timeIndex < Timing.length) {
            subjectsArray[dayIndex][timeIndex] = entry.subject_name;
          }
        });

        setTimetableData(Table);
        setModifiedSubjects(subjectsArray);
      } catch (error) {
        console.error('Error fetching timetables:', error);
      }
    };

    fetchTimetablesEntry(category_id);
  }, [category_id]);

  // Event handler to update state when a subject value changes
  const handleSubjectChange = (dayIndex: number, subjectIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSubjects = [...modifiedSubjects];
    updatedSubjects[dayIndex][subjectIndex] = event.target.value;
    setModifiedSubjects(updatedSubjects);
  };

  if (!timetableData) {
    return <div>Loading...</div>;
  }


  const handleButtonPress = async () => {
    try {
      const updatedEntries: TimetableEntry[] = [];
      timetableData?.forEach((entry) => {
        const dayIndex = Days.indexOf(entry.day_of_week);
        const timeIndex = Timing.indexOf(entry.start_time.slice(0, 5)); // Adjust time format
        if (dayIndex >= 0 && timeIndex >= 0) {
          updatedEntries.push({
            ...entry,
            subject_name: modifiedSubjects[dayIndex][timeIndex],
          });
        }
      });

      const response = await axios.put(`${backendURL}/timetable/update`, { entries: updatedEntries });
      console.log('Timetable updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating timetables:', error);
    }
  }

  return (
    <div className="flex flex-col h-auto overflow-x-scroll">
      <div className='pl-24 flex flex-row gap-36'>
        {Timing.map((timing, index) => (
          <div key={index} className='text-black font-serif text-sm font-medium w-4 '>{timing}</div>
        ))}
      </div>
      {modifiedSubjects.map((day, dayIndex) => (
        <div className='flex flex-row p-2 gap-3' key={dayIndex}>
          <div className='flex w-28 items-center rounded-md bg-green-400 p-2 text-ms font-sans font-medium text-white'>
            <p className='items-center justify-center flex w-28'>{Days[dayIndex]}</p>
          </div>
          {day.map((subject, subjectIndex) => (
            <div key={subjectIndex}>
              <div>
                <input
                  type='text'
                  value={subject}
                  onChange={(event) => handleSubjectChange(dayIndex, subjectIndex, event)}
                  className={`flex w-36 pt-2 pb-2 border border-gray-300 bg-gray-10 rounded-md px-2 text-gray-90 font-sans group focus:outline-none ${isEditPressed ? 'border-2 border-dashed border-green-400' : ''}`}
                  disabled={!isEditPressed}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className={`flex  w-full pt-4 pr-2 justify-end items-end font-sans font-medium text-white `}><button className='flex w-16 h-10 p-2 rounded-md bg-blue-500 justify-center' onClick={handleButtonPress} disabled={!isEditPressed}>Save</button></div>

    </div>
  );
};

export default MyTimeTable;
