import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      const response = await axios.post(
        `${document.URL}wp-json/shopzi/v1/login`,
        {
          username: userName,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Ensure this is included Include this to allow WordPress cookies
        }
      );

      // If using JWT, you'd save the token like this:
      // localStorage.setItem('token', response.data.token);

      console.log(response.data);

      // If WordPress is handling the session, the browser should manage the session cookie automatically.
      // You don't need to manually store the cookie.
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className='flex flex-col items-center '>
      <input
        type='text'
        placeholder='Enter username'
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type='password'
        placeholder='Enter password'
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={submit}
        className='bg-purple-400 text-white text-xl font-medium'
      >
        Submit
      </button>
    </div>
  );
}
