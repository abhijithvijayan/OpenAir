import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <div>
      <h2>OpenAir</h2>
      <div>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/features">
          <a>Devices</a>
        </Link>
      </div>
    </div>
  );
};

export default Header;
