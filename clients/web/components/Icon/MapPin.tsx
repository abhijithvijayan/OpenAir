import React from 'react';

const MapPin: React.FC = () => {
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
        className="map-pin__svg__feather map-pin__svg__feather-map-pin"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx={12} cy={10} r={3} />
      </svg>
    </>
  );
};

export default React.memo(MapPin);
