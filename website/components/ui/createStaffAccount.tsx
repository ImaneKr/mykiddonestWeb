import { Button, Dialog, DialogActions, DialogContent, FormControlLabel, IconButton, Radio, RadioGroup, TextField, colors } from '@mui/material';
import { useState } from 'react'
import ImagePicker from './imagePicker';
import React from 'react';
import axios from 'axios';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface FormDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}
const CreateStaffAccount: React.FC<FormDialogProps> = ({ open, setOpen }) => {

  const [formValues, setFormValues] = useState({ firstname: '', lastname: '', email: '', phone_number: '', username: '', staff_pic: '', staff_pwd: '', role: '' });
  const { firstname, lastname, username, role, email, phone_number, staff_pic, staff_pwd } = formValues;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value); // Add this line for debugging
    setFormValues({ ...formValues, [name]: value });
  };
  const handleImageSelected = (selectedImagePath: string) => {
    setFormValues({ ...formValues, staff_pic: selectedImagePath });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendURL}/staff`, formValues);
      console.log(response.data);
      setOpen(false);
    } catch (error: any) {
      console.error('Error:', error.response);
    }
  };

  const [selectedImagePath, setSelectedImagePath] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }
  return (
    <React.Fragment>
      <button className='inline-block px-2 py-1 text-white bg-blue-90 rounded-md '
        onClick={() => setOpen(true)}
      >
        + New Profile
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"

        maxWidth='sm'
        fullWidth={true}
      >
        <DialogContent className=' flex flex-col mb-8'>
          <div className=''>
            <ImagePicker onImageSelected={handleImageSelected} disabled={false} isProfilePic={true} profilePic='' />
          </div>
          <hr className='m-2.5' />
          <div className='flex justify-between lg:flex-row flex-col mb-3 px-8'>
            <p className='lg:regular-18 regular-16'>
              First Name
            </p>
            <TextField
              type='text'
              name='firstname'
              placeholder='First Name'
              autoFocus
              size='small'
              value={formValues.firstname}
              onChange={handleInputChange}
              className='  w-[99%]'
            />
          </div>
          <div className='flex justify-between lg:flex-row flex-col mb-3 px-8'>
            <p className='lg:regular-18 regular-16'>
              Last Name
            </p>
            <TextField
              type='text'
              name='lastname'
              placeholder='Last Name'
              autoFocus
              size='small'
              value={formValues.lastname}
              onChange={handleInputChange}
              className='  w-[99%]'
            />
          </div>


          <div className='flex justify-between  lg:flex-row flex-col mb-3 px-8'>
            <p className='lg:regular-18 regular-16'>
              Role
            </p>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="Teacher"
              name="role"
              value={formValues.role}
              onChange={handleInputChange}
              className=' flex flex-row 
           justify-between'
            >
              <FormControlLabel value="secretary" control={<Radio />} label="Sacretary" />
              <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
            </RadioGroup>

          </div>

          <div className='flex   justify-between lg:flex-row flex-col mb-3 px-8'>
            <p className='lg:regular-18 regular-16'>
              Username
            </p>
            <TextField
              type='text'
              name='username'
              placeholder='username'
              autoFocus
              size='small'
              className='  w-[99%]'
              value={formValues.username}
              onChange={handleInputChange}

            />
          </div>
          <div className='flex   justify-between lg:flex-row flex-col mb-3 px-8'>
            <p className='lg:regular-18 regular-16'>
              Email Address
            </p>
            <TextField
              type='email'
              name='email'
              helperText
              autoFocus
              size='small'
              className='  w-[99%]'
              value={formValues.email}
              onChange={handleInputChange}

            />
          </div>
          <div className='flex   justify-between lg:flex-row flex-col mb-3 px-8'>
            <p className='lg:regular-18 regular-16'>
              Phone Number
            </p>
            <TextField
              type='text'
              name='phone_number'
              helperText
              autoFocus
              size='small'
              className='  w-[99%]'
              value={formValues.phone_number}
              onChange={handleInputChange}
              inputProps={{
                pattern: '^\\+213(7|5|6)[0-9]{8}$', // Regular expression pattern for Algerian phone number
                title: 'Please enter a valid Algerian phone number (e.g., +213xxxxxxxxx)', // Error message
              }}
              error={!formValues.phone_number.match(/^\+213(7|5|6)[0-9]{8}$/)}

            />
          </div>
          <div className='flex   justify-between lg:flex-row flex-col mb-3 px-8'>
            <p className='lg:regular-18 regular-16'>
              Password
            </p>
            <TextField
              type={showPassword ? 'text' : 'password'}
              name='staff_pwd'
              autoFocus
              size='small'
              className='  w-[99%]'
              value={formValues.staff_pwd}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                ),
              }}
            />
          </div>

        </DialogContent>
        <DialogActions className='pr-10'>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} type='submit' className='bg-blue-600 text-white inline-block px-2 rounded-lg'> Submit </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default CreateStaffAccount
