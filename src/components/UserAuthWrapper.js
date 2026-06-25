/*import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { Paper } from "@material-ui/core";

const UserAuthWrapper = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <Paper style={{ padding: 30, maxWidth: 400, margin: "50px auto" }}>
      {isRegister ? (
        <Register switchToLogin={() => setIsRegister(false)} />
      ) : (
        <Login switchToRegister={() => setIsRegister(true)} />
      )}
    </Paper>
  );
};

export default UserAuthWrapper;
*/
// UserAuthWrapper.js
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { Paper } from "@material-ui/core";

const UserAuthWrapper = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <Paper style={{ padding: 30, maxWidth: 400, margin: "50px auto" }}>
      {isRegister ? (
        <Register switchToLogin={() => setIsRegister(false)} />
      ) : (
        <Login switchToRegister={() => setIsRegister(true)} />
      )}
    </Paper>
  );
};

export default UserAuthWrapper;
