import React from 'react';

const CrossCircle: React.FC = () => {
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
        className="x-circle_svg__feather x-circle_svg__feather-x-circle"
      >
        <circle cx={12} cy={12} r={10} />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    </>
  );
};

export default React.memo(CrossCircle);
