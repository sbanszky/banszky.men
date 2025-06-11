import React from 'react';

const QuestionBox = () => {
  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      <a 
        href="mailto:s@banszky.men" 
        className="flex items-center justify-center w-12 h-12 bg-black/50 rounded-full text-white text-2xl font-mono hover:bg-black/70 transition-colors duration-300"
      >
        ?
      </a>
    </div>
  );
};

export default QuestionBox;
