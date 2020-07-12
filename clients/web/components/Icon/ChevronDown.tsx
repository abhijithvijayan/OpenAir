import React from 'react';

const ChevronDown: React.FC = () => {
  return (
    <>
      <svg
        width={20}
        height={20}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="chevron-down_svg__feather chevron-down_svg__feather-chevron-down"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </>
  );
};

export default React.memo(ChevronDown);
