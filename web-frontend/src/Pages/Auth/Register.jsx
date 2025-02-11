import React from "react";
import Logo from "../../assets/images/pathfinder.png";
import TextField from "@mui/material/TextField";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa6";
import { Divider } from "@mui/material";
import FloatingIcon from "../../Components/FloatingIcon";
import PrimeBtn from "../../Components/PrimeBtn";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <section className="full-section flex justify-center items-center">
      <div className="login-card flex flex-col justify-center items-center">
        <div className="w-3/4 h-1/4 flex items-center -mt-10">
          <Link to="/">
            <img src={Logo} />
          </Link>
        </div>
        <div className="w-full px-10">
          <div className="my-2 flex gap-2">
            <TextField
              id="outlined-basic"
              label="First Name"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="outlined-basic"
              label="Last Name"
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="my-2">
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="my-2">
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="my-4 flex justify-center gap-4">
            <PrimeBtn text="Register" type="primary" />
            <PrimeBtn
              text="Sign In"
              type="secondary"
              onClick={() => navigate("/login")}
            />
          </div>
          <Divider className="text-gray-500 text-xs" textAlign="center">
            or continue with
          </Divider>
          <div className="flex justify-center gap-2 mt-2">
            <FloatingIcon icon={FaGoogle} />
            <FloatingIcon icon={FaFacebookF} />
            <FloatingIcon icon={FaGithub} />
          </div>
          <div className="mt-5"></div>
        </div>
      </div>
    </section>
  );
};

export default Register;
