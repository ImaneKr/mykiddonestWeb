import React, { useEffect, useState } from 'react';
import { Slider } from '@mui/material';
import axios from 'axios';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

type EvaluationProps = {
    id: number;
};

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

const Evaluation: React.FC<EvaluationProps> = ({ id }) => {
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
                const response = await axios.get(`${backendURL}/evaluation/${id}`);
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
    }, [id]);

    return (
        <div>
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
                    step={10}
                    min={0}
                    max={100}
                />
            </div>
        </div>
    );
};

export default Evaluation;
