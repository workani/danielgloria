import React, { useState, useEffect } from 'react';
import Lightbox from 'react-image-lightbox'; 
import 'react-image-lightbox/style.css'; 

export default function Component() {
  // States for Photo Gallery
  const [images, setImages] = useState([
    '/IMG_8624.JPG', 
    '/IMG_8612.JPG', 
    '/IMG_8604.JPG', 
    '/IMG_8595.JPG', 
    '/IMG_8588.JPG', 
    '/IMG_8583.JPG', 
    '/IMG_8560.JPG', 
    '/IMG_8545.JPG'
  ]); // Add your image pathss
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // State for audio playback and song time
  const [audio, setAudio] = useState(null);
  const [songTime, setSongTime] = useState({ currentTime: 0, duration: 0 });

  // State for relationship duration
  const [relationshipDuration, setRelationshipDuration] = useState({ months: 0, days: 0 });

  // Initialize audio on the client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newAudio = new Audio('/audio/love-song.mp3');
      setAudio(newAudio);
    }
  }, []);

  // Effect for managing audio playback
  useEffect(() => {
    if (audio) {
      audio.play().catch(error => console.log("Audio play error:", error));
      const updateTime = () => {
        setSongTime({ currentTime: audio.currentTime, duration: audio.duration });
      };
      audio.addEventListener('timeupdate', updateTime);
      return () => audio.removeEventListener('timeupdate', updateTime);
    }
  }, [audio]);

  // Calculate relationship duration
  useEffect(() => {
    const calculateDuration = () => {
      // Add your start date
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

  // Utility function to format time in mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
            src="/SongCover.jpg" // Replace with your album cover image path
            style={{ aspectRatio: "1 / 1", objectFit: "cover" }}

          />
       <div className="ml-4">
          <h5 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Anne-Marie &James Arthur</h5>
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
