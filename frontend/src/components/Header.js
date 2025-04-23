import React from 'react';
import logo from '../../public/Chariots.png';

export default function Header() {
  return (
    <header className="flex items-center justify-center px-4 py-2 bg-primary">
      <img
        src={logo}
        alt="Chariots Await"
        className="h-12 sm:h-16 mx-auto"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
      <h1 className="sr-only">Chariots Await</h1>
    </header>
  );
}
