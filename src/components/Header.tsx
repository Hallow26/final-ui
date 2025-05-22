import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-left">
        <img
          src="https://scontent.fcrk1-3.fna.fbcdn.net/v/t39.30808-6/470212727_27927727996872654_373015429479732428_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=fIMZHu7TC3sQ7kNvwGuth1V&_nc_oc=AdnQ94evITJZ_MuD4pYDGncHjJw6Z1E4jjWH8Na4ewsyO33fb3TYbGAK3H9W9Ec7VRQ&_nc_zt=23&_nc_ht=scontent.fcrk1-3.fna&_nc_gid=ivoTDmBG3t6N-6RReB1b_A&oh=00_AfLcG3j3KmovLPGf3MdJJlo04_RkLzcYLulcJ16iUzJTKg&oe=683404E5"
          alt="Profile"
          className="profile-pic"
        />
        <span className="profile-name">Lawrence Manuel M. Baluyut</span>
      </div>
      <h1 className="header-title">SoMeSphere</h1>
      <div className="header-right"></div>
    </header>
  );
};

export default Header;