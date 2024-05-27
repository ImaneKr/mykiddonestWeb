import { Button, Dialog, DialogActions, DialogContent, IconButton, Slider, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridCellParams, GridColDef } from '@mui/x-data-grid';
import React, { useState, useRef, useEffect } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import Image from 'next/image';
import { RiDeleteBin6Line } from 'react-icons/ri';
import ImagePicker from './imagePicker';
import { HiOutlineClipboardList } from 'react-icons/hi';
import axios from 'axios';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;


interface Row {
  id: number;
  acc_pic: string;
  name: string;
  age: string;
  guardian: any; // Change from guardian_id to guardian name
  category: any; // Change from category_id to category name
  RegestratedDate: string
  firstname: string;
  lastname: string;
  gender: string;
  dateOfbirth: string;
  hobbies: string;
  allergies: string;
  authorizedpickups: string;
  relationTochild: string;
  syndromes: string
}
interface Evaluation {
  id: number;
  Subject: {
    subject_name: string;
    mark: number;
  };
}

interface Marks {
  letters: number;
  numbers: number;
  art: number;
  communication: number;
  physicalSkills: number;
}

// Define the props for EditUserActionItem
interface EditKidActionItemProps {
  row: Row;
  deleteKid: () => void;
  scrollToEvaluation: () => void;
}

// EditUserActionItem component
const EditKidActionItem: React.FC<EditKidActionItemProps> = ({ row, deleteKid, scrollToEvaluation }) => {
  const evaluationRef = useRef<HTMLHeadingElement>(null);

  const handleSwipeToEvaluation = () => {
    if (evaluationRef.current) {
      evaluationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const [open, setOpen] = React.useState(false);


  ///evaluationnn
  ;
  // fetch the kid mark 
  const colors: string[] = ['text-orange-400', 'text-blue-400', 'text-green-90'];
  const [mark, setMark] = useState<Marks>({ letters: 0, numbers: 0, art: 0, communication: 0, physicalSkills: 0 });

  const handleSliderChange = (name: keyof Marks) => (event: Event, value: number | number[]) => {
    setMark((prevMarks) => ({
      ...prevMarks,
      [name]: value as number,
    }));
    console.log(mark);
  };

  useEffect(() => {
    // Fetch the evaluation data for the kid when the component mounts
    const fetchEvaluationData = async () => {
      try {
        const response = await axios.get(`${backendURL}/evaluation/${row.id}`);
        const evaluations: Evaluation[] = response.data;
        console.log(response.data)
        // Transform the evaluations data to match the state structure
        const marks = evaluations.reduce((acc: Marks, evaluation: Evaluation) => {
          const { subject_name, mark } = evaluation.Subject;
          if (subject_name === 'Arabic Letters') acc.letters = mark;
          if (subject_name === 'Numbers') acc.numbers = mark;
          if (subject_name === 'Art and Crafts') acc.art = mark;
          if (subject_name === 'Communication') acc.communication = mark;
          if (subject_name === 'Physical Skills') acc.physicalSkills = mark;
          return acc;
        }, {
          letters: 0,
          numbers: 0,
          art: 0,
          communication: 0,
          physicalSkills: 0,
        });

        setMark(marks);
      } catch (error) {
        console.error('Error fetching evaluation data:', error);
      }
    };

    fetchEvaluationData();
  }, [row.id]);


  //ediiiit kid profile
  const handleEdit = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [selectedImagePath, setSelectedImagePath] = useState<string>('');

  const [isChangingAllowed, setIsChangingAllowed] = useState(false);


  const [fetchedKid, setFetchedKid] = React.useState<Row | null>(null);

  useEffect(() => {
    const fetchKidByID = async () => {
      try {
        const response = await axios.get(`${backendURL}/kid/${row.id}`);
        setFetchedKid(response.data);
      } catch (error) {
        console.error('Error fetching guardian by ID:', error);
      }
    };

    if (open) {
      fetchKidByID();
    }
  }, [open, row.id]);

  const [formValues, setFormValues] = useState({
    firstname: '', lastname: '', gender: '', hobbies: '', dateOfbirth: '', allergies: '', acc_pic: '', syndroms: '', authorizedpickups: '', relationTochild: ''
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value); // Add this line for debugging
    setFormValues({ ...formValues, [name]: value });
  };

  //edit submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let Kid_id = row.id
    try {
      /*const response = await axios.put(`${backendURL}/kid/${Kid_id}`, {
        firstname: formValues.firstname.split(' ')[0], // Split name into first and last name
        lastname: formValues.firstname.split(' ')[1], // Split name into first and last name
        dateOfbirth: formValues.dateOfbirth,
        allergies: formValues.allergies,
        hobbies: formValues.hobbies,
        syndromes: formValues.syndroms,
        authorizedpickups: formValues.authorizedpickups,
        relationTochild: formValues.relationTochild,
        acc_pic: selectedImagePath,
      });*/
      //console.log('Guardian updated:', response.data);
      // You can add additional logic here, such as updating the UI or showing a success message

      const response = await axios.put(`${backendURL}/evaluation`, {
        kid_id: row.id,
        evaluations: [
          { subject_id: 1, mark: mark.letters }, // Replace 1 with the actual subject_id for Arabic Letters
          { subject_id: 2, mark: mark.numbers }, // Replace 2 with the actual subject_id for Numbers
          { subject_id: 3, mark: mark.art }, // Replace 2 with the actual subject_id for Numbers
          { subject_id: 4, mark: mark.communication }, // Replace 2 with the actual subject_id for Numbers
          { subject_id: 5, mark: mark.physicalSkills }, // Replace 2 with the actual subject_id for Numbers
          // Repeat this for all subjects
        ]
      });
      console.log('Evaluation marks updated:', response.data);
    } catch (error) {
      console.error('Error updating evaluation marks:', error);
      //console.error('Error updating guardian:', error);
      // Handle error, such as displaying an error message to the user
    }
    setOpen(false);

  };
  useEffect(() => {
    if (fetchedKid) {
      setFormValues({
        firstname: fetchedKid.firstname,
        lastname: fetchedKid.lastname,
        gender: fetchedKid.gender,
        hobbies: fetchedKid.hobbies, // Provide default or fetched value for hobbies
        dateOfbirth: fetchedKid.dateOfbirth, // Provide default or fetched value for dateOfbirth
        allergies: fetchedKid.allergies, // Provide default or fetched value for allergies
        acc_pic: fetchedKid.acc_pic,
        syndroms: fetchedKid.syndromes, // Provide default or fetched value for syndromes
        authorizedpickups: fetchedKid.authorizedpickups, // Provide default or fetched value for authorizedpickups
        relationTochild: fetchedKid.relationTochild
      });
    }
  }, [fetchedKid]);
  let name = `${formValues.firstname} ${formValues.lastname}`


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
          <div className='flex flex-row justify-between w-full  items-center lg:pr-10 lg:pl-5'>
            <div className='flex h-30 w-30'><ImagePicker onImageSelected={setSelectedImagePath} disabled={!isChangingAllowed} isProfilePic={true} profilePic={row.acc_pic} /></div>
            <div className='flex flex-row  justify-between lg:pr-20  items-center'> <p className='text- disabled3xl font-semibold font-sans'>{formValues.firstname} {formValues.lastname}</p>
              <div className='flex flex-row w-full justify-end pl-10'>
                <Button onClick={handleSwipeToEvaluation} className='flex w-8 h-8 pt-1 text- disabledslate-600'><HiOutlineClipboardList className='w-full h-full' /></Button></div>
            </div>
          </div>
          <hr className={`m-2.5`} />
          <div className='block justify-center items-center  mb-4 px-8'>
            <TextField type='text' disabled className='  w-[99%]' name='firstname' size='small' label='Full Name' value={name} />
          </div>
          <div className='block justify-center items-center  mb-4 px-8'>

            <TextField type='date' disabled className='  w-[99%]' name='dateOfbirth' size='small' label='Date Of Birth' value={formValues.dateOfbirth} />
          </div>
          <div className='block justify-center items-center  mb-4 px-8'>

            <TextField type='text' disabled autoFocus className='  w-[99%]' name='allergies' size='small' label=' Allergies' value={formValues.allergies} />
          </div>
          <div className='block justify-center items-center  mb-4 px-8'>

            <TextField type='text' disabled className='  w-[99%]' name='syndroms' size='small' label='Syndromes' value={formValues.syndroms} />
          </div>
          <div className='block justify-center items-center  mb-4 px-8'>

            <TextField type='text' disabled className='  w-[99%]' name='hobbies' size='small' label='Hobbies' value={formValues.hobbies} />
          </div>
          <div className='block justify-center items-center  mb-4 px-8'>

            <TextField type='text' disabled className='  w-[99%]' name='relationTochild' size='small' label='Relation To child' value={formValues.relationTochild} />
          </div>
          <div className='block justify-center items-center  mb-4 px-8'>

            <TextField type='text' disabled className='  w-[99%]' name='authorizedpickups' size='small' label='Authorized Pickups ' value={formValues.authorizedpickups} />
          </div>
          <hr className={`m-2.5`} />

          <h1 ref={evaluationRef} id='evaluation' className='pl-5 medium-18 pt-4 pb-3'>Kid&apos;s evaluation</h1>
          <div className='flex justify-between mb-3 mx-4'>
            <p className='regular-16 flex w-1/2 from-neutral-950'> Arabic Letters </p>
            <Slider
              name='letters'
              onChange={handleSliderChange('letters')}
              sx={{
                color: '#8BC62A', // Color of the slider track and thumb
                '& .MuiSlider-thumb': {
                  backgroundColor: '#8BC62A', // Color of the thumb
                },
              }}
              valueLabelDisplay="auto"

              value={mark.letters}
              step={10}
              min={0}
              max={100}
            />
          </div>
          <div className='flex justify-between mb-3 mx-4'>
            <p className='regular-16 flex w-1/2 from-neutral-950'> Numbers </p>
            <Slider
              name='numbers'
              onChange={handleSliderChange('numbers')}
              sx={{
                color: '#379AE6', // Color of the slider track and thumb
                '& .MuiSlider-thumb': {
                  backgroundColor: '#379AE6', // Color of the thumb
                },
              }}
              valueLabelDisplay="auto"
              value={mark.numbers}
              step={10}
              min={0}
              max={100}
            />
          </div>
          <div className='flex justify-between mb-3 mx-4'>
            <p className='regular-16 flex w-1/2 from-neutral-950'> Art and Crafts </p>
            <Slider
              name='art'
              onChange={handleSliderChange('art')}
              sx={{
                color: '#FEC601', // Color of the slider track and thumb
                '& .MuiSlider-thumb': {
                  backgroundColor: '#FEC601', // Color of the thumb
                },
              }}
              valueLabelDisplay="auto"
              value={mark.art}
              step={10}
              min={0}
              max={100}
            />
          </div>
          <div className='flex justify-between mb-3 mx-4'>
            <p className='regular-16 flex w-1/2 from-neutral-950'> Communication </p>
            <Slider
              name='communication'
              onChange={handleSliderChange('communication')}
              sx={{
                color: '#f76e05', // Color of the slider track and thumb
                '& .MuiSlider-thumb': {
                  backgroundColor: '#f76e05', // Color of the thumb
                },
              }}
              valueLabelDisplay="auto"
              value={mark.communication}
              step={10}
              min={0}
              max={100}
            />
          </div>
          <div className='flex justify-between mb-3 mx-4'>
            <p className='regular-16 flex w-1/2 from-neutral-950'> Physical skills </p>
            <Slider
              name='physicalSkills'
              onChange={handleSliderChange('physicalSkills')}
              sx={{
                color: '#9004e0', // Color of the slider track and thumb
                '& .MuiSlider-thumb': {
                  backgroundColor: '#9004e0', // Color of the thumb
                },
              }}
              value={mark.physicalSkills}
              valueLabelDisplay="auto"
              step={10}
              min={0}
              max={100}
            />
          </div>
        </DialogContent>
        <DialogActions >
          <Button className='flex flex-row gap-2 justify-center items-center bg-red-10' onClick={() => {
            setOpen(false);
            deleteKid();
          }} >
            <RiDeleteBin6Line className='text- disabledred-90 m-1' />
            <label className='text- disabledred-90 text- disabledsm'>Delete</label>
          </Button>
          <div className='flex flex-row gap-3'><Button onClick={() => setOpen(false)} className='bg-slate-100 text- disabledblue-600 border border-blue-600'>Cancel</Button>
            <Button className='bg-blue-700 text- disabledwhite px-2  regular-12 mr-7' onClick={handleSubmit}> Save changes </Button></div>
        </DialogActions>
      </Dialog>
    </>
  );
};

const KidList = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB');
  const [rows, setRows] = React.useState<Row[]>([]);

  /// fetch the guardian name and the category name
  useEffect(() => {
    const fetchGuardianName = async (guardianId: number) => {
      try {
        const response = await axios.get(`${backendURL}/guardian/${guardianId}`);
        return response.data.firstname + ' ' + response.data.lastname;
      } catch (error) {
        console.error(`Error fetching guardian name for guardian ID ${guardianId}:`, error);
        return 'Unknown Guardian';
      }
    };

    const fetchCategoryName = async (categoryId: number) => {
      try {
        const response = await axios.get(`${backendURL}/category/${categoryId}`);
        return response.data.category_name;
      } catch (error) {
        console.error(`Error fetching category name for category ID ${categoryId}:`, error);
        return 'Unknown Category';
      }
    };
    const fetchKids = async () => {
      try {
        const response = await axios.get(`${backendURL}/kid`);
        const data = response.data;
        console.log(data);
        const formattedRows = await Promise.all(data.map(async (row: any) => {
          const guardianName = await fetchGuardianName(row.guardian_id);
          const categoryName = await fetchCategoryName(row.category_id);
          return {
            id: row.kid_id,
            prof_pic: row.prof_pic,
            name: `${row.firstname} ${row.lastname}`,
            age: row.age,
            gender: row.gender,
            guardian: guardianName,
            category: categoryName,
            RegestratedDate: new Date(row.prof_time_creation).toLocaleDateString(),
          };
        }));
        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching kid profiles:', error);
      }
    };

    fetchKids();
  }, []);


  const deleteUser = async (id: number) => {
    try {
      const response = await axios.delete(`${backendURL}/kid/${id}`);
      console.log('kid deleted:', response.data);
      // Remove the deleted row from the state
      setRows(prevRows => prevRows.filter(row => row.id !== id));
    } catch (error) {
      console.error('Error deleting kid:', error);
      // Handle error, such as displaying an error message to the user
    }
  }

  const columns = React.useMemo<GridColDef<Row>[]>(
    () => [
      {
        field: 'acc_pic',
        headerName: '',
        headerClassName: ' hidden justify-center bold-20',
        width: 60,
        filterable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => {
          const { prof_pic, gender } = params.row;

          let profileSrc =  '';
          if (!profileSrc) {
            if (gender === 'male') {
              profileSrc = '/boy.jpg';
            } else if (gender === 'female') {
              profileSrc = '/girl.jpg';
            } else {
              profileSrc = '/girl.jpg'; // Optional: a generic default image for unspecified gender
            }
          }

          return <Image src={profileSrc} alt="Profile" width={45} height={45} className="rounded-full" />;
        }
      },
      {
        field: 'name',
        headerName: 'Name',
        headerClassName: ' justify-center bold-20 ',
        flex: 1,
      },
      {
        field: 'age',
        headerName: 'Age',
        headerClassName: ' justify-center bold-20 ',
        flex: 1,
      },
      {
        field: 'guardian',
        headerName: 'Guardian',
        headerClassName: ' justify-center bold-20',
        flex: 1,
      },
      {
        field: 'category',
        headerName: 'Category',
        headerClassName: ' justify-center bold-20',
        flex: 1,
      },
      {
        field: 'RegestratedDate',
        headerName: 'Registered Date',
        headerClassName: ' justify-center bold-20 ',
        flex: 1,
      },
      {
        field: 'Action',
        type: 'actions',
        headerClassName: '',
        getActions: (params: GridCellParams<Row>) => [
          <EditKidActionItem key={1} row={params.row} deleteKid={() => deleteUser(Number(params.id))} scrollToEvaluation={function (): void {
            throw new Error('Function not implemented.');
          }} />,
        ]
      }
    ],
    [deleteUser],
  );

  return (
    <div className='w-[98%] '>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default KidList;
