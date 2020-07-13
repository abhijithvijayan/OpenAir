import React from 'react';

const Activity: React.FC = () => {
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
        className="activity_svg__feather activity_svg__feather-activity"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    </>
  );
};

export default React.memo(Activity);
