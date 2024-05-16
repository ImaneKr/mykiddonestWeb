import React, { useEffect, useState } from 'react';
import announcementsList from '@/models/announcementsList'; // Assuming you have a type/interface for Announcement
import Image from 'next/image';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { FiEdit3 } from 'react-icons/fi';
import { TbTrash } from 'react-icons/tb';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import ContentField from './contentField';
import ImagePicker from './ui/imagePicker';
import axios from 'axios';
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Announcement {
  announcement_id: number;
  announcement_title: string;
  announcement_image: string;
  announcement_desc: string;
}

interface Props {
  onDelete: () => void;
  onEdit: () => void;
}

const AnnouncementActions: React.FC<Props> = ({ onDelete, onEdit }) => {
  return (
    <div className="grid grid-rows-2 bg-white w-fit gap-2">
      <button onClick={onEdit} className='flex'><FiEdit3 className='mt-1 mr-1' /> Edit</button>
      <button onClick={onDelete} className='flex'><TbTrash className='mt-1 mr-1' /> Delete</button>
    </div>
  );
};

const ListingAnnouncements: React.FC = () => {
  const [showActions, setShowActions] = useState<boolean[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [announcements, setAnnouncement] = useState<Announcement[]>([]);

  const [selectedImagePath, setSelectedImagePath] = useState<string>(''); // State to hold selected image path

  const toggleActions = (index: number) => {
    setShowActions((prev) => prev.map((value, i) => (i === index ? !value : false)));
  };

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const response = await axios.get(`${backendURL}/announcement`);
      setAnnouncement(response.data);
      setShowActions(new Array(response.data.length).fill(false));
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const deleteAnnouncement = async (index: number) => {
    try {
      const announcementIdToDelete = announcements[index].announcement_id; // Get the announcement ID from the announcements array
      const response = await axios.delete(`${backendURL}/announcement/${announcementIdToDelete}`);
      console.log('announcement deleted:', response.data);
      // Remove the deleted announcement from the announcements array
      const updatedannouncements = announcements.filter((announcement, i) => i !== index);
      setAnnouncement(updatedannouncements);
      setShowActions((prev) => prev.map((value, i) => (i === index ? false : value)));
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const editAnnouncement = async (index: number, announcementData: any) => {
    try {
      const response = await axios.put(`${backendURL}/announcement/${announcements[index].announcement_id}`, announcementData);
      console.log('announcement edited:', response.data);
      // Update the announcements array with the edited announcement
      const updatedannouncements = [...announcements];
      updatedannouncements[index] = response.data;
      setAnnouncement(updatedannouncements);
      setOpen(false); // Close the dialog after successful edit
    } catch (error) {
      console.error('Error editing announcement:', error);
    }
  };

  const handleSubmit = async () => {
    if (selectedIndex !== null) {
      const announcementData = {
        announcement_id: announcements[selectedIndex].announcement_id,
        announcement_title: announcements[selectedIndex].announcement_title, // Replace with the actual updated the actual updated data from the form fields
        announcement_image: announcements[selectedIndex].announcement_image, // Replace with the actual updated data from the form fields
        published: true // Replace with the actual updated data from the form fields
      };
      await editAnnouncement(selectedIndex, announcementData);
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

  return (
    <div className='flex flex-col pt-5 gap-2'>
      {announcements.map((announcement: Announcement, index: number) => (
        <div key={index} className='relative w-[95%] h-24 border py-1 border-gray-15 mt-1 pr-1 rounded-md flex items-center shadow'>
          {announcement.announcement_image ? (
            <Image src={announcement.announcement_image} width={80} height={80} alt={`announcement ${index + 1}`} className='p-0.5 h-full m-1 rounded-md border border-gray-15 shadow' />
          ) : (
            <Image src='/defaultAnnouncement.jpg' width={80} height={80} alt={`Default announcement Image`} className='p-0.5 h-full m-1 rounded-md border border-gray-15 shadow' />
          )}
          <div className='flex flex-col items-start justify-center pl-3'>
            <label>{announcement.announcement_title}</label>
            <label className='regular-12'>{announcement.announcement_desc}</label>
          </div>
          <div className='absolute top-1 right-0 pr-1'>
            <BiDotsVerticalRounded onClick={() => toggleActions(index)} />
            {showActions[index] && (
              <div className='absolute top-4 border border-gray-300 shadow-2xl right-2 bg-white p-2 rounded-md' style={{ zIndex: 999 }}>
                <AnnouncementActions onDelete={() => deleteAnnouncement(index)} onEdit={() => handleEdit(index)} />
              </div>
            )}
          </div>
        </div>
      ))}
      <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" className='flex w-full justify-center items-center ' >
          <DialogContent className='w-full h-full  p-3 '>
            {selectedIndex != null && (
              <div className='flex flex-col w-full h-full rounded-md border border-dashed border-blue-600 p-3 gap-3'>
                <ImagePicker isContentPic={true} onImageSelected={setSelectedImagePath} disabled={false} contentPicPath={announcementsList[selectedIndex].imgPath ? announcementsList[selectedIndex].imgPath : '/defaultAnnouncement.jpg'} />
                <div className='flex flex-col justify-center items-start gap-2'>
                  <ContentField initialValue={announcementsList[selectedIndex].title} label='Title:' />
                  <ContentField initialValue={announcementsList[selectedIndex].description} label='Description:' />
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions className='flex flex-row justify-end pr-1'>
            <div className='flex flex-row gap-3'>
              <Button onClick={() => setOpen(false)} className='bg-slate-100 text-blue-600 border border-blue-600'>Cancel</Button>
              <Button className='bg-blue-700 text-white px-2 py-0.5 regular-12 mr-4' onClick={handleSubmit}> Save changes </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ListingAnnouncements;
