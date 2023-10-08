import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import EmotionSlider from './EmotionSlider';
import { FieldArray } from 'formik'; 

import MoodBoard from './MoodBoard';

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f4f4f8;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: auto;
    margin-top: 50px;
`;


const AddButton = styled.button`
    background-color: #0070f3;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    margin-top: 10px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0050b3;
    }
`;


const Title = styled.h2`
    text-align: center;
    margin-bottom: 30px;
    font-size: 28px;
    font-weight: 500;
    color: #333;
`;

const SubmitButton = styled.button`
    display: block;
    background-color: #0070f3;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    margin-top: 20px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0050b3;
    }
`;

const SoundCloudFrame = styled.iframe`
    margin-top: 20px;
    border: 0;
    width: 100%;
    height: 166px;
`;


const TabMenu = styled.div`
    display: flex;
    margin-bottom: 20px;
`;

const Tab = styled.button`
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    background-color: ${props => (props.$active ? '#0070f3' : '#f4f4f8')};
    color: ${props => (props.$active ? 'white' : '#333')};
    transition: background-color 0.3s;

    &:hover {
        background-color: ${props => (!props.active ? '#e0e0e0' : '#0050b3')};
    }
`;

function EmotionForm() {
    const [songs, setSongs] = useState([]); 
    const [activeTab, setActiveTab] = useState('sliders');
    const moodBoardRef = useRef(null);

    const handleMoodBoardSubmit = () => {
        const canvas = moodBoardRef.current;
        const imageData = canvas.toDataURL("image/png");
    
        fetch('http://127.0.0.1:5000/save_moodboard_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fetchPlaylist();
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
    };
    
    const fetchPlaylist = () => {
        fetch('http://127.0.0.1:5000/get_playlist', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(playlistData => {
            if (playlistData.error) {
                console.error(playlistData.error);
                return;
            }
            setSongs(playlistData);
            console.log(playlistData);
        })
        .catch(error => {
            console.error('Error fetching playlist:', error);
        });
    };
    

    return (
        <FormWrapper>
            <Title>Select Your Emotions</Title>

            <TabMenu>
            <Tab $active={activeTab === 'sliders'} onClick={() => setActiveTab('sliders')}>Emotion Sliders</Tab>
            <Tab $active={activeTab === 'moodBoard'} onClick={() => setActiveTab('moodBoard')}>Mood Board</Tab>

            </TabMenu>
            {activeTab === 'sliders' ? (
            <Formik
            initialValues={{
                emotions: [
                    { name: '', value: 50 }
                ],
            }}

                onSubmit={(values) => {
                    console.log('Submitted Emotions:', values.emotions);
                
                    fetch('http://127.0.0.1:5000/save_emotions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(values.emotions),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        fetchPlaylist();
                    })
                    .catch(error => {
                        console.error('Error sending data:', error);
                    });
                }}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        {values.emotions.map((emotion, index) => (
                            <EmotionSlider key={index} index={index} />
                        ))}
                        <AddButton
                            type="button"
                            onClick={() => {
                                const newEmotions = [...values.emotions, { name: '', value: 50 }];
                                setFieldValue('emotions', newEmotions);
                            }}
                        >
                            + Add Emotion
                        </AddButton>
                        <SubmitButton type="submit">Generate Playlist</SubmitButton>
                    </Form>
                )}
            </Formik>
            ): (
                <>
                   <MoodBoard ref={moodBoardRef} />
                    <SubmitButton onClick={handleMoodBoardSubmit}>
                        Generate Playlist from Mood Board
                    </SubmitButton>
                </>
            )}

            
            {songs.map(song => (
                <SoundCloudFrame
                    key={song.title}
                    src={`https://w.soundcloud.com/player/?url=https://soundcloud.com/${extractSoundCloudId(song.url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                    title={song.title}
                ></SoundCloudFrame>
            ))}
        </FormWrapper>
    );
}

function extractSoundCloudId(url) {
    const regex = /https:\/\/soundcloud\.com\/([\w\-\/]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}


export default EmotionForm;
