import React from 'react';

const ArrowRight: React.FC = () => {
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
        className="arrow-right_svg__feather arrow-right_svg__feather-arrow-right"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </>
  );
};

export default React.memo(ArrowRight);
