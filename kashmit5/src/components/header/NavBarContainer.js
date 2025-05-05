import React, { useState, useEffect } from 'react';
import TopNavBar from './top-navbar/TopNavBar';
import SecondNavBar from './second-navbar/SecondNavbar';

const NavBarContainer = ({ configData }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showTopNav, setShowTopNav] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
      
      // Hide top navbar when scrolling down, show when scrolling up
      if (currentPosition > 50) {
        setShowTopNav(false);
      } else {
        setShowTopNav(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {showTopNav && <TopNavBar />}
      <SecondNavBar 
        configData={configData} 
        scrollPosition={scrollPosition} 
      />
    </>
  );
};

export default NavBarContainer;