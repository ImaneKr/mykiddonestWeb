import React, { useEffect, useState } from 'react';
import ImagePicker from '@/components/ui/imagePicker';
import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { TiDelete } from 'react-icons/ti';
import { GrAdd } from 'react-icons/gr';
import MealField from './mealField';
import axios from 'axios';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL


interface Props {
  onDelete: () => void;
  onCreate: () => void;
}
export type Meal = {
  name: string;
  image?: string; // Assuming image is a URL
}

export type DayAndItsMeals = {
  day: string;
  meals: Meal[];
}
const MealActions: React.FC<Props> = ({ onDelete, onCreate }) => {
  return (
    <div className="grid grid-rows-2 bg-white w-fit gap-2" style={{ zIndex: 999 }}>
      <button onClick={onCreate} className='flex'><GrAdd className='mt-1 mr-1' /> Create</button>
      <button onClick={onDelete} className='flex'><TiDelete className='mt-1 mr-1' /> Delete</button>
    </div>
  );
};

const ListingMeals: React.FC<{ allow: boolean }> = ({ allow }) => {
  const [lunchMenus, setLunchMenus] = useState<DayAndItsMeals[]>([]);
  //const [selectedDay, setSelectedDay] = useState<string>('');

  useEffect(() => {
    const fetchLunchMenus = async () => {
      try {
        const response = await axios.get(`${backendURL}/lunchmenu`);
        const lunchMenusData = response.data;
        const formattedLunchMenus = lunchMenusData.map((menu: any) => ({
          day: menu.day_of_week,
          meals: [
            { name: menu.item1_name, image: menu.item1_image_url },
            { name: menu.item2_name, image: menu.item2_image_url },
            { name: menu.item3_name, image: menu.item3_image_url },
            { name: menu.item4_name, image: menu.item4_image_url }
          ]
        }));
        setLunchMenus(formattedLunchMenus);
        setShowActions(new Array(formattedLunchMenus.length).fill(false));
      } catch (error) {
        console.error('Error fetching lunch menus:', error);
      }
    };

    fetchLunchMenus();
  }, []);

  const colors: string[] = ['orange-400', 'blue-400'];
  const [selectedImagePath, setSelectedImagePath] = useState<string>('');
  const [showActions, setShowActions] = useState<boolean[]>(new Array(lunchMenus.length).fill(false));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [createdMeal, setCreatedMeal] = useState<Meal | null>();

  const toggleActions = (index: number) => {
    setShowActions(prev => prev.map((value, i) => (i === index ? !value : false)));
  };

  const deleteMeal = (dayIndex: number, mealIndex: number) => {
    // Implement delete functionality here
    console.log('Delete meal at index', dayIndex, mealIndex);
  };

  const addMealItem = async () => {
    try {
      const { day } = lunchMenus[selectedIndex!]; // Assuming selectedIndex is set somewhere when selecting a day
  
      // Assuming selectedImagePath holds the image URL
      const { name: item_name, image: item_image_url } = createdMeal;
  
      const response = await axios.post(`${backendURL}/addMealItem`, {
        day,
        item_name,
        item_image_url
      });
  
      // Handle response as needed
      console.log('New meal item added:', response.data);
  
      // Reset state or perform any additional actions after successful addition
      setCreatedMeal({ name: '', image: '' });
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Error adding meal item:', error);
      // Handle error
    }
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
    setCreatedMeal(null);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCreatedMeal(prevMeal => ({
      ...prevMeal,
      [name]: value
    }));
  };

  return (
    <div className='flex flex-row gap-2 w-auto px-7 rounded-md border-2 border-green-90 bg-bgbg p-2 justify-start lg:items-start items-center '>
      <div className={`flex flex-col gap-2 p-2 `}>
        {lunchMenus.map((day: DayAndItsMeals, index: number) => (
          <div key={index} className={`relative border-2 border-${colors[index % 2]} p-2 rounded-md bg-white`}>
            <legend className="w-28 justify-center items-center regular-16 outline-none">{day.day}</legend>
            <div>
              <div className='flex lg:flex-row flex-col gap-3'>
                {day.meals.map((meal: Meal, mealIndex: number) => (
                  <div key={mealIndex} className='flex flex-col items-center justify-center'>
                    <ImagePicker disabled={!allow} onImageSelected={setSelectedImagePath} isMealPic={true} mealPic={meal.image} />
                    <MealField initialValue={meal.name} disabled={!allow} />
                  </div>
                ))}
                <div className="absolute top-1 right-1">
                  <BiDotsVerticalRounded onClick={() => toggleActions(index)} />
                  {showActions[index] && (
                    <div className="absolute top-1 right-1 bg-white p-2 rounded-md shadow" style={{ zIndex: 999 }}>
                      <MealActions onDelete={() => deleteMeal(index, 0)} onCreate={() => createMeal(index, 0)} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Create Meal Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog}>
        <DialogContent>
          <div className='flex flex-col w-full h-full rounded-md border border-solid items-center justify-center border-blue-600 p-3 gap-1'>
            <div className='flex flex-row w-full justify-center items-center'><h1 className=' text-lg font-semibold font-sans text-blue-800'>Add a new Meal</h1></div>
            <ImagePicker onImageSelected={setSelectedImagePath} disabled={false} isMealPic={true} mealPic='/dfDish.jpg' forCreation={true} />
            <div className='flex flex-col justify-center items-start gap-2'>
              <h1 className='pl-2 regular-14 text-blue-800'>-Meal&apos;s name:</h1>
              <TextField
                name='item_name'
                type='text'
                size='small'
                placeholder='Soup'
                value={createdMeal ? createdMeal.name : ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button className='bg-slate-100 text-blue-600 border border-blue-600' onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button type='submit' className='bg-blue-600 text-white inline-block px-2 rounded-lg mr-10'>Submit</Button>
        </DialogActions>

      </Dialog>
    </div>
  );
};

export default ListingMeals;
