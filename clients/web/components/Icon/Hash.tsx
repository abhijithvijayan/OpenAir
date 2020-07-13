import React from 'react';

const Hash: React.FC = () => {
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
        className="hash_svg__feather hash_svg__feather-hash"
      >
        <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
      </svg>
    </>
  );
};

export default React.memo(Hash);
