import React from 'react';

const ChevronUp: React.FC = () => {
  return (
    <>
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="chevron-up_svg__feather chevron-up_svg__feather-chevron-up"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </>
  );
};

export default React.memo(ChevronUp);
