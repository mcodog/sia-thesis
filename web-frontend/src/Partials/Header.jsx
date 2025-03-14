import React from "react";
import wordMark from "../assets/images/pathfinder.png";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { triggerLogout } from "../Redux/Slice/AuthSlice";
import { useAuth } from "../Hooks/useAuth";

const Header = () => {
  const user = useSelector((state) => state.auth);
  console.log(user);
  const dispatch = useDispatch();

  return (
    <>
      <div className="fixed z-50 top-0 left-0 h-20 px-14 w-full flex justify-between items-center bg-white shadow-custom">
        <div className="w-44">
          <img className="" src={wordMark} />
        </div>
        <div className="gap-5 flex justify-end items-center ">
          <Link to="/">Home</Link>
          <Link to="/quiz">Quiz</Link>
          <Link to="/about">About</Link>
          <Link to="/profile">Profile</Link>
          {user.isLoggedIn ? (
            <div
              className="cursor-pointer"
              onClick={() => dispatch(triggerLogout())}
            >
              Logout
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
