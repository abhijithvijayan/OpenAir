import React from 'react';

const AlertCircle: React.FC = () => {
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
        className="alert-circle_svg__feather alert-circle_svg__feather-alert-circle"
      >
        <circle cx={12} cy={12} r={10} />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    </>
  );
};

export default React.memo(AlertCircle);
