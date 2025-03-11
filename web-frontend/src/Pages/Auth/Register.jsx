import React, { useState } from "react";
import Logo from "../../assets/images/pathfinder.png";
import TextField from "@mui/material/TextField";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa6";
import { Divider } from "@mui/material";
import FloatingIcon from "../../Components/FloatingIcon";
import PrimeBtn from "../../Components/PrimeBtn";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const [formstate, setFormstate] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    isAdmin: false,
  });

  const triggerRegister = async () => {
    try {
      handleRegister(formstate);
    } catch (e) {
      console.log(e);
    }
  };

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
              id="first_name"
              label="First Name"
              variant="outlined"
              onChange={(e) =>
                setFormstate((prev) => ({
                  ...prev,
                  first_name: e.target.value,
                }))
              }
              value={formstate.first_name}
              fullWidth
            />
            <TextField
              id="last_name"
              label="Last Name"
              variant="outlined"
              onChange={(e) =>
                setFormstate((prev) => ({ ...prev, last_name: e.target.value }))
              }
              value={formstate.last_name}
              fullWidth
            />
          </div>
          <div className="my-2">
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              onChange={(e) =>
                setFormstate((prev) => ({ ...prev, username: e.target.value }))
              }
              value={formstate.username}
              fullWidth
            />
          </div>
          <div className="my-2">
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              onChange={(e) =>
                setFormstate((prev) => ({ ...prev, password: e.target.value }))
              }
              value={formstate.password}
              fullWidth
            />
          </div>
          <div className="my-4 flex justify-center gap-4">
            <PrimeBtn
              text="Register"
              type="primary"
              onClick={triggerRegister}
            />
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
