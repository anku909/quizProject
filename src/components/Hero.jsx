import React, { useEffect, useRef, useState } from "react";
import Quiz from "./Quiz";

function Hero() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const fullscreenRef = useRef(null);



  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const requestFullScreen = () => {
    if (document.documentElement.requestFullscreen){
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    }else if(document.exitFullscreen){
      document.exitFullscreen();
      setIsFullScreen(false)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      requestFullScreen();
    } else {
      document.exitFullscreen();
      setIsFullScreen(false); // Update state when exiting fullscreen
    }
  };

  const handleKeyDown = (e) => {
    e.preventDefault()
    if(e.key === "F11"){
      toggleFullscreen()
    }
  }



  return (
    <div  ref={fullscreenRef} onKeyDown={handleKeyDown} tabIndex="0" className="hero w-full h-screen px-20 py-10">
       
      <section  className="quiz-section w-full h-full px-16 py-10 bg-[#9797c7] border-4 border-[#9c9a9a] rounded-lg">
        {isFullScreen ? <>
        <section className="heading-section w-full h-20 border-4 broder-white rounded-lg flex items-center justify-center">
          <h2 className="text-3xl font-semibold text-zinc-100">Quiz Test</h2>
        </section>
      <Quiz /> 
        </> : <div className="w-full h-full bg-[#d5cce6] rounded-lg flex flex-col  items-center justify-center">
          <h2 className="text-2xl text-zinc-800 font-semibold">To take the test, please enter fullscreen mode</h2>
      <button onClick={requestFullScreen} className="px-16 py-2 bg-[#3393ca] text-white text-xl font-semibold mt-4 rounded-lg">
        Enter Fullscreen
      </button>
        </div>
    }
      </section> 
    </div>
  );
}

export default Hero;
