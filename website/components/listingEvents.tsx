import React, { useEffect, useState } from 'react';
import eventsList from '@/models/eventsList';
import Image from 'next/image';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { FiEdit3 } from 'react-icons/fi';
import { TbTrash } from 'react-icons/tb';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import ContentField from './contentField';
import ImagePicker from './ui/imagePicker';
import axios from 'axios';
import { FaListUl } from 'react-icons/fa';
import KidsListDialog from './ui/kidsList';
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Event {
  event_id: number;
  event_name: string;
  event_date: Date;
  event_image: string;
}

interface Props {
  onDelete: () => void;
  onEdit: () => void;
  onList:()=>void;
}

const EventActions: React.FC<Props> = ({ onDelete, onEdit, onList }) => {
  return (
    <div className="grid grid-rows-2 bg-white w-fit gap-2 " style={{ zIndex: 999 }}>
      <button onClick={onList} className='flex' > <FaListUl className='mt-1 mr-1' /> List</button>
      <button onClick={onEdit} className='flex'><FiEdit3 className='mt-1 mr-1' /> Edit</button>
      <button onClick={onDelete} className='flex'><TbTrash className='mt-1 mr-1' /> Delete</button>
    </div>
  );
};

const ListingEvents: React.FC = () => {
  const [showActions, setShowActions] = useState<boolean[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [openKidsListDialog, setOpenKidsListDialog] = useState(false);
  const [selectedImagePath, setSelectedImagePath] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([])
  const toggleActions = (index: number) => {
    setShowActions((prev) => prev.map((value, i) => (i === index ? !value : false)));
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${backendURL}/event`);
      setEvents(response.data);
      setShowActions(new Array(response.data.length).fill(false));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  const deleteEvent = async (index: number) => {
    try {
      const eventIdToDelete = events[index].event_id; // Get the event ID from the events array
      const response = await axios.delete(`${backendURL}/event/${eventIdToDelete}`);
      console.log('Event deleted:', response.data);
      // Remove the deleted event from the events array
      const updatedEvents = events.filter((event, i) => i !== index);
      setEvents(updatedEvents);
      setShowActions((prev) => prev.map((value, i) => (i === index ? false : value)));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const editEvent = async (index: number, eventData: any) => {
    try {
      const response = await axios.put(`${backendURL}/event/${events[index].event_id}`, eventData);
      console.log('Event edited:', response.data);
      // Update the events array with the edited event
      const updatedEvents = [...events];
      updatedEvents[index] = response.data;
      setEvents(updatedEvents);
      setOpen(false); // Close the dialog after successful edit
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };
  const handleSubmit = async () => {
    if (selectedIndex !== null) {
      const eventData = {
        event_id: events[selectedIndex].event_id,
        event_name: events[selectedIndex].event_name, // Replace with the actual updated data from the form fields
        event_date: new Date(events[selectedIndex].event_date).toLocaleDateString(), // Replace with the actual updated data from the form fields
        event_image: events[selectedIndex].event_image, // Replace with the actual updated data from the form fields
        published: true // Replace with the actual updated data from the form fields
      };
      await editEvent(selectedIndex, eventData);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedIndex(null);
  };
  const handleEdit = (index: number) => {
    setOpen(true);
    setSelectedIndex(index);
  };

  const handleList = (index: number) => {
    setOpenKidsListDialog(true);
    setSelectedIndex(index);
  };

  const handleCloseKidsListDialog = () => {
    setOpenKidsListDialog(false);
    setSelectedIndex(null);
  }
  return (
    <div className='flex flex-col pt-5 gap-2 z-0'>
      {events.map((event: Event, index: number) => (
        <div key={index} className='relative w-80 h-16 border border-gray-15 mt-1 rounded-md flex items-center shadow'>
          {event.event_image ? (
            <Image src={event.event_image} width={55} height={55} alt={`Event ${index + 1}`} className=' p-0.5 m-1 rounded-md border border-gray-15 shadow' />
          ) : (
            <Image src='/defaultEvent.jpeg' width={55} height={55} alt={`Default Event Image`} className='p-0.5 m-1 rounded-md border border-gray-15 shadow' />
          )}
          <div className='flex flex-col items-start justify-center pl-3'>
            <label>{event.event_name}</label>
            <label className='regular-12'>{new Date(event.event_date).toLocaleDateString()}</label>
          </div>
          <div className='absolute top-1 right-0 pr-1'>
            <BiDotsVerticalRounded onClick={() => toggleActions(index)} />
            {showActions[index] && (
              <div className='absolute top-1 border border-gray-300 shadow-2xl right-4 bg-white p-2 rounded-md' style={{ zIndex: 999 }}>
                <EventActions onDelete={() => deleteEvent(index)} onEdit={() => handleEdit(index)} onList={() => handleList(index)} />
              </div>
            )}
          </div>
        </div>
      ))}
      <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent >
            {selectedIndex != null && (
              <div className='flex flex-col w-full h-full rounded-md border border-dashed border-blue-600 p-3 gap-3'>
                <ImagePicker isContentPic={true} onImageSelected={setSelectedImagePath} disabled={false} contentPicPath={events[selectedIndex].event_image ? events[selectedIndex].event_image : '/defaultEvent.jpeg'} />
                <div className='flex flex-col justify-center items-start gap-2'>
                  <ContentField initialValue={events[selectedIndex].event_name} label='Title:' isEvent={true} />
                  <ContentField initialDate={new Date(events[selectedIndex].event_date)} label='Date:' isEvent={true} isDate={true} />
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions >
            <div className='flex flex-row gap-3'>
              <Button onClick={handleClose} className='bg-slate-100 text-blue-600 border border-blue-600'>Cancel</Button>
              <Button className='bg-blue-700 text-white px-2 py-0.5 regular-12 mr-4' onClick={handleSubmit}> Save changes </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
      <KidsListDialog
        open={openKidsListDialog}
        onClose={handleCloseKidsListDialog}
        eventId={selectedIndex !== null ? events[selectedIndex].event_id : null}
      />
    </div>
  );
};

export default ListingEvents;
