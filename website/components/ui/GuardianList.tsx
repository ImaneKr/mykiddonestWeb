import { Button, Dialog, DialogActions, DialogContent, IconButton, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridCellParams, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import Image from 'next/image';
import { RiDeleteBin6Line } from 'react-icons/ri';
import ImagePicker from './imagePicker';
import { profile } from 'console';
import GuardianField from '../guardianField';
import axios from 'axios';
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Row {
  id: number;
  acc_pic: string;
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
    // You can also pass 'row' to your dialog form here.
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [selectedImagePath, setSelectedImagePath] = useState<string>('');

  const [accountInfo, setAccountInfo] = useState({ profilepic: row.acc_pic, name: row.name, phone_number: row.phone_number, password: '', email: row.email, civilState: row.civilState, address: row.address, username: row.username });
  const [isChangingAllowed, setIsChangingAllowed] = useState(false);
  const allowChanges = () => {
    setIsChangingAllowed(!isChangingAllowed);
  };
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
        <DialogContent className=' flex flex-col  '>
          <div className='flex flex-row justify-between items-center lg:pr-10 lg:pl-5'>
            <div className='flex h-30 w-30'> <ImagePicker onImageSelected={setSelectedImagePath} disabled={!isChangingAllowed} isProfilePic={true} profilePic={row.acc_pic} /></div>
            <div className='flex flex-row justify-start lg:gap-10 gap-4 lg:pr-28 items-center'> <p className='text-3xl font-semibold font-sans'>{accountInfo.name}</p>
              <Button className='flex w-8 h-8 pt-1 text-slate-600' onClick={allowChanges}><FiEdit3 className='w-full h-full ' /></Button>   </div>
          </div>
          <hr className={`m-2.5`} />
          <div className='flex justify-between mb-3 px-8'>

            <GuardianField initialValue={accountInfo.name} label='Full name' disabled={!isChangingAllowed} />
          </div>

          <div className='flex   justify-between items-center gap-20 mb-3 px-8'>
            <GuardianField initialValue={accountInfo.phone_number} label='Phone number ' disabled={!isChangingAllowed} />
          </div>
          <div className='flex   justify-between  items-center gap-20 mb-3 px-8'>
            <GuardianField initialValue={accountInfo.email} label='Email address' disabled={!isChangingAllowed} />
          </div>
          <div className='flex   justify-between  items-center gap-20 mb-3 px-8'>
            <GuardianField initialValue={row.username} label='Username' disabled={!isChangingAllowed} />
          </div>
          <div className='flex   justify-between items-center gap-20 mb-3 px-8'>
            <GuardianField initialValue={accountInfo.password} label='Password' isPassword={true} disabled={!isChangingAllowed} />
          </div>
          <div className='flex   justify-between items-center gap-20 mb-3 px-8'>
            <label className='regular-14 pl-2  pb-1'>Gender</label>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              className=' flex flex-row justify-start'
            >
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />

            </RadioGroup>
          </div>
          <div className='flex   justify-between  items-center gap-20 mb-3 px-8'>
            <GuardianField initialValue={accountInfo.civilState} label='Civil state' disabled={!isChangingAllowed} />
          </div>
          <div className='flex   justify-between  items-center gap-20 mb-3 px-8'>
            <GuardianField initialValue={accountInfo.address} label='Address' disabled={!isChangingAllowed} />
          </div>

        </DialogContent>
        <DialogActions className='flex flex-row justify-between pl-7 pr-3' >
          <Button className='flex flex-row gap-2 justify-center items-center bg-red-10' onClick={() => {
            setOpen(false);
            deleteUser();
          }} >
            <RiDeleteBin6Line className='text-red-90 m-1' />
            <label className='text-red-90 text-sm'>Delete</label>
          </Button>
          <div className='flex flex-row gap-3'><Button onClick={async () => {
            try {
              const response = await axios.put(`${backendURL}/guardian/${row.id}`, {
                firstname: accountInfo.name.split(' ')[0], // Split name into first and last name
                lastname: accountInfo.name.split(' ')[1], // Split name into first and last name
                gender: '', // Add gender if needed
                username: accountInfo.username,
                guardian_pwd: accountInfo.password,
                civilstate: accountInfo.civilState,
                email: accountInfo.email,
                phone_number: accountInfo.phone_number,
                address: accountInfo.address,
                acc_pic: selectedImagePath,
              });
              console.log('Guardian updated:', response.data);
              // You can add additional logic here, such as updating the UI or showing a success message
            } catch (error) {
              console.error('Error updating guardian:', error);
              // Handle error, such as displaying an error message to the user
            }
            setOpen(false);
          }} className='bg-slate-100 text-blue-600 border border-blue-600'>Cancel</Button>
            <Button className='bg-blue-700 text-white px-2  regular-12 mr-7'> Save changes </Button></div>
        </DialogActions>
      </Dialog>
    </>
  );
};

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


  const deleteUser = React.useCallback(
    (id: number) => () => {
      setTimeout(() => {
        setRows(prevRows => prevRows.filter(row => row.id !== id));
      });
    },
    [],
  );

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
          <Image src={params.row.profile as string} alt="Profile" width={45} height={45} className='rounded-full' />
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
          <EditUserActionItem key={1} row={params.row} deleteUser={deleteUser(Number(params.id))} />,
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