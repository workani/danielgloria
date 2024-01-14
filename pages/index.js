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
  const [relationshipDuration, setRelationshipDuration] = useState({ months: 0, days: 0 });

 
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
      const playAudio = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Audio play error:", error);
        }
      };

      const updateTime = () => {
        setSongTime({ currentTime: audio.currentTime, duration: audio.duration });
      };

      const handleAudioEnd = () => setIsPlaying(false);

      audio.addEventListener('canplaythrough', playAudio);
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('ended', handleAudioEnd);

      return () => {
        audio.removeEventListener('canplaythrough', playAudio);
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('ended', handleAudioEnd);
      }
    }
  }, [audio]);

  useEffect(() => {
    const calculateDuration = () => {
      const startDate = new Date('2020-01-01');
      const currentDate = new Date();
      const differenceInTime = currentDate.getTime() - startDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      return {
        months: Math.floor(differenceInDays / 30),
        days: Math.floor(differenceInDays % 30)
      };
    };

    setRelationshipDuration(calculateDuration());
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const togglePlay = () => {
    if (audio) {
      if (audio.paused) {
        audio.play().catch((error) => console.error("Error playing audio:", error));
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };

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
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Relationship Timeline</h2>
          <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-red-500">Together for:</h3>
            <p className="text-xl text-gray-700">{relationshipDuration.months} Months and {relationshipDuration.days} Days</p>
          </div>
        </div>
      </section>
    </main>
  );
}