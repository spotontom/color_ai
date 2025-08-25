import React from 'react';
import bgImage from './bg1.jpg';

export default function BackgroundImage() {
return (
    <div className="fixed top-0 left-0 w-full h-full bg-cover bg-center opacity-20 pointer-events-none" 
         style={{ backgroundImage: `url(${bgImage})` }} >
    </div>
)
}