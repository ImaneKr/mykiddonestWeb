import { Button, Dialog, DialogActions, DialogContent, IconButton, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridCellParams, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import Image from 'next/image';
import { RiDeleteBin6Line } from 'react-icons/ri';
import ImagePicker from './imagePicker';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import axios from 'axios';
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Row {
  id: number;
  acc_pic: string;
  firstname: string;
  lastname: string;
  guardian_pwd: string;
  gender: string;
  name: string;
  phone_number: string;
  acc_time_creation: string;
  email: string;
  civilState: string;
  address: string;
  username: string;
}

// Define the props for EditUserActionItem
interface EditUserActionItemProps {
  row: Row;
  deleteUser: () => void;
}

// EditUserActionItem component
const EditUserActionItem: React.FC<EditUserActionItemProps> = ({ row, deleteUser }) => {
  const [open, setOpen] = React.useState(false);
  const handleEdit = () => {
    setOpen(true);
  };
  ////// deleting the guardian


  const handleClose = () => {
    setOpen(false);
  };

  const [selectedImagePath, setSelectedImagePath] = useState<string>('');

  // fetching the guardian 
  const [fetchedGuardian, setFetchedGuardian] = React.useState<Row | null>(null);

  useEffect(() => {
    const fetchGuardianByID = async () => {
      try {
        const response = await axios.get(`${backendURL}/guardian/${row.id}`);
        setFetchedGuardian(response.data);
      } catch (error) {
        console.error('Error fetching guardian by ID:', error);
      }
    };

    if (open) {
      fetchGuardianByID();
    }
  }, [open, row.id]);

  const [formValues, setFormValues] = useState({
    firstname: '', lastname: '', gender: '', email: '', phone_number: '', username: '', acc_pic: '', guardian_pwd: '', civilState: '', address: ''
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value); // Add this line for debugging
    setFormValues({ ...formValues, [name]: value });
  };

  //edit submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let guardian_id = row.id
    try {
      const response = await axios.put(`${backendURL}/guardian/${guardian_id}`, {
        firstname: formValues.firstname.split(' ')[0], // Split name into first and last name
        lastname: formValues.firstname.split(' ')[1], // Split name into first and last name
        gender: formValues.gender,
        username: formValues.username,
        guardian_pwd: formValues.guardian_pwd,
        civilstate: formValues.civilState,
        email: formValues.email,
        phone_number: formValues.phone_number,
        address: formValues.address,
        acc_pic: selectedImagePath,
      });
      console.log('Guardian updated:', response.data);
      // You can add additional logic here, such as updating the UI or showing a success message
    } catch (error) {
      console.error('Error updating guardian:', error);
      // Handle error, such as displaying an error message to the user
    }
    setOpen(false);

  };
  useEffect(() => {
    if (fetchedGuardian) {
      setFormValues({
        firstname: fetchedGuardian.firstname,
        lastname: fetchedGuardian.lastname,
        gender: fetchedGuardian.gender,
        email: fetchedGuardian.email,
        phone_number: fetchedGuardian.phone_number,
        username: fetchedGuardian.username,
        acc_pic: fetchedGuardian.acc_pic,
        guardian_pwd: fetchedGuardian.guardian_pwd,
        civilState: fetchedGuardian.civilState,
        address: fetchedGuardian.address
      });
    }
  }, [fetchedGuardian]);

  const [isChangingAllowed, setIsChangingAllowed] = useState(false);
  const allowChanges = () => {
    setIsChangingAllowed(!isChangingAllowed);
  };

  let name = `${formValues.firstname} ${formValues.lastname}`

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }
  return (
    <>
      <IconButton onClick={handleEdit}>
        <FiEdit3 />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='sm'
        fullWidth={true}
      >
        <DialogContent >
          <div className='flex flex-row justify-between items-center lg:pr-10 lg:pl-5'>
            <div className='flex h-30 w-30'>
              <ImagePicker onImageSelected={setSelectedImagePath} disabled={!isChangingAllowed} isProfilePic={true} profilePic='/dfprofile.jpg' />
            </div>
            <div className='flex flex-row justify-start lg:gap-10 gap-4 lg:pr-28 items-center'> <p className='text-3xl font-semibold font-sans'>{formValues.firstname} {formValues.lastname}</p>
              <Button className='flex w-8 h-8 pt-1 text-slate-600' onClick={allowChanges}><FiEdit3 className='w-full h-full ' /></Button>   </div>
          </div>
          <hr className={`m-2.5`} />
          <div className='block justify-center items-center  mb-4 px-8'>

            <TextField type='text' className=' w-[99%]' name='firstname' size='small' label='Full Name' value={name} onChange={handleInputChange} />
          </div>

          <div className='flex   justify-between items-center gap-20 mb-4 px-8'>
            <TextField size='small' className=' w-[99%]' name='phone_number' type='text' label='Phone Number' value={formValues.phone_number} onChange={handleInputChange}
              inputProps={{
                pattern: '^\\+213(7|5|6)[0-9]{8}$', // Regular expression pattern for Algerian phone number
                title: 'Please enter a valid Algerian phone number (e.g., +213xxxxxxxxx)', // Error message
              }}
            />
          </div>
          <div className='flex   justify-between  items-center gap-20 mb-4 px-8'>
            <TextField size='small' className=' w-[99%]' name='email' type='email' label='Email' value={formValues.email} onChange={handleInputChange} />
          </div>
          <div className='flex   justify-between  items-center gap-20 mb-4 px-8'>
            <TextField size='small' className=' w-[99%]' name='username' type='text' label='Username' value={formValues.username} onChange={handleInputChange} />
          </div>
          <div className='flex   justify-between items-center gap-20 mb-4 px-8'>
            <TextField size='small' className=' w-[99%]' name='guardian_pwd' type={showPassword ? 'text' : 'password'} label='Password' value={formValues.guardian_pwd} onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                ),
              }} />

          </div>
          <div className='flex   justify-between items-center gap-20 mb-4 px-8'>
            <label className='regular-14 pl-2  pb-1'>Gender</label>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={formValues.gender}
              name="gender"

            >
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />

            </RadioGroup>
          </div>
          <div className='flex   justify-between  items-center gap-20 mb-4 px-8'>
            <TextField size='small' className=' w-[99%]' name='civilState' type='text' label='Civil State' value={formValues.civilState} onChange={handleInputChange} />
          </div>
          <div className='flex   justify-between  items-center gap-20 mb-4 px-8'>
            <TextField type='text' className=' w-[99%]' name='address' size='small' label='Address' value={formValues.address} onChange={handleInputChange} />

          </div>

        </DialogContent>
        <DialogActions  >
          <Button className='flex flex-row gap-2 justify-center items-center bg-red-10' onClick={() => {
            setOpen(false);
            deleteUser();
          }} >
            <RiDeleteBin6Line className='text-red-90 m-1' />
            <label className='text-red-90 text-sm'>Delete</label>
          </Button>
          <div className='flex flex-row gap-3'><Button className='bg-slate-100 text-blue-600 border border-blue-600' onClick={handleClose}>Cancel</Button>
            <Button className='bg-blue-700 text-white px-2  regular-12 mr-7' onClick={handleSubmit}> Save changes </Button></div>
        </DialogActions>
      </Dialog>
    </>
  );
};
//// this is the list
const GuardianList = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB');

  //// get the guardians list from the database
  const [rows, setRows] = React.useState<Row[]>([]);
  useEffect(() => {
    const fetchGuardians = async () => {
      try {
        const response = await axios.get(`${backendURL}/guardian`);
        // Map fetched data to include id property
        const updatedRows = response.data.map((row: any) => ({
          id: row.guardian_id,
          acc_pic: row.acc_pic,
          name: `${row.firstname} ${row.lastname}`, // Combine firstname and lastname as name
          phone: row.phone_number,
          rdate: new Date(row.acc_time_creation).toLocaleDateString(), // Format acc_time_creation as a date string
          email: row.email,
          /* civilState: row.civilState,
           address: row.address,
           userName: row.username,*/
        }));
        setRows(updatedRows);
      } catch (error) {
        console.error('Error fetching guardians:', error);
      }
    };


    fetchGuardians();
  }, []);


  const deleteUser = async (id: number) => {

    try {
      const response = await axios.delete(`${backendURL}/guardian/${id}`);
      console.log('Guardian deleted:', response.data);
      // Remove the deleted row from the state
      setRows(prevRows => prevRows.filter(row => row.id !== id));
    } catch (error) {
      console.error('Error deleting guardian:', error);
      // Handle error, such as displaying an error message to the user
    }
  }

  const columns = React.useMemo<GridColDef<Row>[]>(
    () => [
      {
        field: 'acc_profile',
        headerName: '',
        headerClassName: ' hidden justify-center bold-20',
        width: 60,
        filterable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => (
          <Image src='/dfprofile.jpg' alt="Profile" width={45} height={45} className='rounded-full' />
        ),
      },
      {
        field: 'name',
        headerName: 'Name',
        headerClassName: ' justify-center bold-20 ',
        flex: 1,
      },
      {
        field: 'phone',
        headerName: 'Phone',

        headerClassName: ' justify-center bold-20 ',
        flex: 1,
      },
      {
        field: 'email',
        headerName: 'email',
        headerClassName: ' justify-center bold-20',

        flex: 1,
      },
      {
        field: 'rdate',
        headerName: 'Regestrated Date',
        headerClassName: ' justify-center bold-20 ',

        flex: 1,
      },
      {
        field: 'Action',
        type: 'actions',
        headerClassName: '',
        getActions: (params: GridCellParams<Row>) => [
          <EditUserActionItem key={1} row={params.row} deleteUser={() => deleteUser(Number(params.id))} />,
        ]
      }
    ],
    [deleteUser],
  )

  return (
    <div className='w-[98%] '>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default GuardianList