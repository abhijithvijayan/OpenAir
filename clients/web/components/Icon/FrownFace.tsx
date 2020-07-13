import React from 'react';

const FrownFace: React.FC = () => {
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
        className="frown_svg__feather frown_svg__feather-frown"
      >
        <circle cx={12} cy={12} r={10} />
        <path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01" />
      </svg>
    </>
  );
};

export default React.memo(FrownFace);
