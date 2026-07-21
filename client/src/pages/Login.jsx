import React, { useState } from "react";
import deliveryboy from "../assets/deliberyboy.png";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [validateError, setValidateError] = useState();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateLoginData = (data) => {
    const { email, password } = data;

    let errorMessage = {};

    if (email.length < 8) {
      errorMessage.emailError = "Email too Short";
    }
    if (password.length < 6) {
      errorMessage.passwordError = "Password too Short";
    }

    return Object.keys(errorMessage).length > 0 ? false : errorMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here, e.g., send loginData to the server
    //Validate loginData

    const validateResult = validateLoginData(loginData);
    if (!validateResult) {
      setValidateError(validateResult);
      return;
    }

    console.log("Login data submitted:", loginData);

    const payload = {
      email: loginData.email.toLowerCase(),
      password: loginData.password,
    };
  };

  return (
    <>
      <div className="h-[90vh] bg-linear-to-r from-(--secondary) to-(--primary) grid grid-cols-2 p-10 ">
        <div className="hidden md:block">
          <img src={deliveryboy} alt="" className="rotate-y-180" />
        </div>
        <div className="w-md bg-(--background) rounded shadow p-10 flex flex-col justify-center">
          <div>Welocome Back!</div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-(--accent)"
              />
              {
                validateError?.emailError && (
                  <span className="text-red-500 text-sm">
                    {validateError.emailError}
                  </span>
                )
              }
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-(--accent)"
              />
              {
                validateError?.passwordError && (
                  <span className="text-red-500 text-sm">
                    {validateError.passwordError}
                  </span>
                )
              }
            </div>
            <button
              type="submit"
              className="mt-6 bg-(--primary) text-white py-2 px-4 rounded hover:bg-(--accent)"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
