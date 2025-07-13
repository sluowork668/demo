// src/pages/Login.tsx

// Login Page

import React from "react";
import AuthForm from "../components/AuthForm";

const Login: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        paddingTop: 100,
      }}
    >
      {/* Use AuthForm in login mode */}
      <AuthForm type="login" />
    </div>
  );
};

export default Login;
