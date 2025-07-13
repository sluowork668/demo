// src/pages/Register.tsx

// Register Page

import React from "react";
import AuthForm from "../components/AuthForm";

const Register: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        paddingTop: 100,
      }}
    >
      {/* Use AuthForm in register mode */}
      <AuthForm type="register" />
    </div>
  );
};

export default Register;
