import React, { useState, useEffect } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { FaPlay, FaStop } from 'react-icons/fa';

export default function Component() {
  const [images, setImages] = useState([
    '/IMG_8624.JPG',
    '/IMG_8612.JPG',
    '/IMG_8588.JPG',
    'IMG_8604.JPG',
    '/IMG_8583.JPG',
    '/IMG_8545.JPG',
    '/IMG_8560.JPG',
    '/IMG_8548.JPG',
  ]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songTime, setSongTime] = useState({ currentTime: 0, duration: 0 });

  useEffect(() => {
    const newAudio = new Audio('https://danielgloria.vercel.app/song.aac');
    newAudio.addEventListener('loadeddata', () => {
      setAudio(newAudio);
      setSongTime({ ...songTime, duration: newAudio.duration });
    });

    newAudio.addEventListener('error', (e) => {
      console.error("Error with audio playback:", e);
      console.error("Error code:", e.target.error.code);
    });

    return () => {
      newAudio.removeEventListener('loadeddata', () => {});
      newAudio.removeEventListener('error', () => {});
    };
  }, []);

  useEffect(() => {
    if (audio) {
      const updateTime = () => {
        setSongTime({ currentTime: audio.currentTime, duration: audio.duration });
      };

      const handleAudioEnd = () => setIsPlaying(false);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('ended', handleAudioEnd);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('ended', handleAudioEnd);
      }
    }
  }, [audio]);



  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const togglePlay = () => {
    if (audio) {
      if (audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Playback was prevented:", error);
          // Handle the error, show message to user, etc.
        });
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };
  
 

  // Define the state to hold the relationship duration
  const [relationshipDuration, setRelationshipDuration] = useState({
    days: 'XX',
    hours: 'XX',
    minutes: 'XX',
  });

  // Function to calculate the time difference
  const calculateTimeLeft = () => {
    const startDate = new Date('2023-09-29'); // Replace with your relationship start date
    const currentDate = new Date();
    const differenceInTime = currentDate - startDate;

    return {
      days: Math.floor(differenceInTime / (1000 * 60 * 60 * 24)),
      hours: Math.floor((differenceInTime / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((differenceInTime / 1000 / 60) % 60),
    };
  };

  // Effect hook to update the relationship duration
  useEffect(() => {
    const timer = setInterval(() => {
      setRelationshipDuration(calculateTimeLeft());
    }, 60000); // Update every minute

    // Set the initial duration immediately on component mount
    setRelationshipDuration(calculateTimeLeft());

    return () => clearInterval(timer);
  }, []);



  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-red-500 to-yellow-500">
      {/* Photo Gallery Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Image ${index + 1}`}
                className="rounded-lg"
                height="200"
                style={{ aspectRatio: "200/200", objectFit: "cover" }}
                width="200"
                onClick={() => {
                  setPhotoIndex(index);
                  setIsOpen(true);
                }}
              />
            ))}
          </div>
          {isOpen && (
            <Lightbox
              mainSrc={images[photoIndex]}
              nextSrc={images[(photoIndex + 1) % images.length]}
              prevSrc={images[(photoIndex + images.length - 1) % images.length]}
              onCloseRequest={() => setIsOpen(false)}
              onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
              onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
            />
          )}
        </div>
      </section>
      
      {/* Love Song Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Love Song</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-red-500 mb-4">Rewrite the stars</h3>
              <div className="flex items-center mb-4">
                <img
                  alt="Album cover"
                  className="rounded-full"
                  height="60"
                  width="60"
                  src="/SongCover.jpg"
                  style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                />
                <div className="ml-4">
                  <h5 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Anne-Marie & James Arthur</h5>
                  <p className=" font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-900">
                    The Greatest Showman: Reimagined
                  </p>
                </div>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 rounded-full h-2"
                  style={{ width: `${(songTime.currentTime / songTime.duration) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-gray-500">{formatTime(songTime.currentTime)}</p>
                <p className="text-gray-500">{formatTime(songTime.duration)}</p>
              </div>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300 mt-4 flex items-center justify-center"
                onClick={togglePlay}
              >
                {isPlaying ? <FaStop size={20} /> : <FaPlay size={20} />}
                <span className="ml-2">{isPlaying ? 'Stop' : 'Play'} Song</span>
              </button>
            </div>
          </div>
        </div>
      </section>

        {/* Relationship Timeline Section */}
      
        <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-8">We are together for:</h2>
      
          <main className="flex flex-col items-center justify-center space-y-5 sm:space-y-10">
            <div className="countdown-container grid grid-cols-2 sm:grid-cols-3 text-center gap-4 justify-center">
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4">
              <p className="text-5xl sm:text-7xl font-bold text-white mb-2">{relationshipDuration.days}</p>
                <p className="text-xl sm:text-2xl text-gray-300">Days</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4">
                <p className="text-5xl sm:text-7xl font-bold text-white mb-2">{relationshipDuration.hours}</p>
                <p className="text-xl sm:text-2xl text-gray-300">Hours</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4">
                <p className="text-5xl sm:text-7xl font-bold text-white mb-2">{relationshipDuration.minutes}</p>
                <p className="text-xl sm:text-2xl text-gray-300">Minutes</p>
              </div>
            </div>
          </main>
        </div>
      </section>
    </main>
  );
}