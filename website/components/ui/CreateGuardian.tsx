import { Button, Dialog, DialogActions, DialogContent, FormControlLabel, Radio, RadioGroup, TextField, colors } from '@mui/material';
import { useState } from 'react'
import ImagePicker from './imagePicker';
import React from 'react';
import axios from 'axios';
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface FormDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}
const CreateGuardianAccount: React.FC<FormDialogProps> = ({ open, setOpen }) => {


  const [formValues, setFormValues] = useState({
    firstname: '', lastname: '', gender: '', email: '', phone_number: '', username: '', acc_pic: '', guardian_pwd: '', civilState: '', address: ''
  });
  const { firstname, lastname, gender, username, guardian_pwd, civilState, email, phone_number, address, acc_pic } = formValues;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value); // Add this line for debugging
    setFormValues({ ...formValues, [name]: value });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendURL}/guardian`, formValues);
      console.log(response.data);
      setOpen(false); // Close dialog after successful submission
    } catch (error: any) {
      console.error('Error:', error.response);
    }


  };

  const [selectedImagePath, setSelectedImagePath] = useState<string>('');
  const handleImageSelected = (selectedImagePath: string) => {
    setFormValues({ ...formValues, acc_pic: selectedImagePath });
  };
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
        <DialogContent className=' flex flex-col '>

          <div className='pb-2'>
            <ImagePicker onImageSelected={handleImageSelected} disabled={false} isGuardianPic={true} />
          </div>
          <hr className='pb-7' />
          <div className='flex justify-between lg:flex-row items-center flex-col  mb-5 px-8  '>
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
              className=' lg:w-56 w-[99%]'
            />
          </div>
          <div className='flex justify-between items-center lg:flex-row flex-col mb-5 px-8'>
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
              className=' lg:w-56 w-[99%]'
            />
          </div>
          <div className='flex justify-between items-center mb-3 px-8'>
            <p className='lg:regular-18 regular-16 pr-4'>
              Gender:
            </p>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              value={formValues.gender}
              onChange={handleInputChange}
              name="gender"
              className=' flex flex-row '
            >
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />

            </RadioGroup>

          </div>
          <div className='flex lg:flex-row flex-col  justify-between items-center lg:gap-20 mb-5 px-8'>
            <p className='lg:regular-18 regular-16'>
              Username
            </p>
            <TextField
              type='text'
              name='username'
              placeholder='username'
              autoFocus
              size='small'
              className=' lg:w-56 w-[99%]'
              onChange={handleInputChange}
              value={formValues.username}
            />
          </div>
          <div className='flex  lg:flex-row flex-col justify-between items-center lg:gap-20 mb-5 px-8'>
            <p className='lg:regular-18 regular-16'>
              Email Address
            </p>
            <TextField
              type='email'
              name='email'
              placeholder='email'
              autoFocus
              size='small'
              className=' lg:w-56 w-[99%]'
              onChange={handleInputChange}
              value={formValues.email}
            />
          </div>
          <div className='flex  lg:flex-row flex-col justify-between items-center lg:gap-20 mb-5 px-8'>
            <p className='lg:regular-18 regular-16'>
              Phone Number
            </p>
            <TextField
              type='text'
              name='phone_number'
              placeholder='phone number'
              autoFocus
              size='small'
              className=' lg:w-56 w-[99%]'
              value={formValues.phone_number}
              onChange={handleInputChange}

            />
          </div>
          <div className='flex  lg:flex-row flex-col justify-between items-center lg:gap-20 mb-5 px-8'>
            <p className='lg:regular-18 regular-16'>
              Civil state
            </p>
            <TextField
              type='text'
              name='civilState'
              placeholder='civil state '
              autoFocus
              size='small'
              className=' lg:w-56 w-[99%]'
              value={formValues.civilState}
              onChange={handleInputChange}
            />
          </div>
          <div className='flex  lg:flex-row flex-col justify-between items-center lg:gap-20 mb-5 px-8'>
            <p className='lg:regular-18 regular-16'>
              Address
            </p>
            <TextField
              type='text'
              name='address'
              placeholder='address'
              autoFocus
              size='small'
              className=' lg:w-56 w-[99%]'
              value={formValues.address}
              onChange={handleInputChange}

            />
          </div>

          <div className='flex lg:flex-row flex-col  justify-between items-center lg:gap-20 mb-5  px-8'>
            <p className='lg:regular-18 regular-16'>
              Password
            </p>
            <TextField
              type='password'
              name='guardian_pwd'
              placeholder='password'
              autoFocus
              size='small'
              className=' lg:w-56 w-[99%]'
              value={formValues.guardian_pwd}
              onChange={handleInputChange}
            />
          </div>

        </DialogContent>
        <DialogActions>
          <Button className='bg-slate-100 text-blue-600 border border-blue-600' onClick={handleClose}>Cancel</Button>
          <Button type='submit' onClick={handleSubmit} className='bg-blue-600 text-white inline-block px-2 rounded-lg mr-10  '> Submit </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default CreateGuardianAccount
