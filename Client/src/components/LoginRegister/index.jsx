import React, { useState } from "react";
import { Typography, Button, TextField, Box, Paper, Grid } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";
import { useNavigate } from "react-router-dom";

function LoginRegister(props) {
  const [isLoginView, setIsLoginView] = useState(true);

  // Login State
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Register State
  const [regLoginName, setRegLoginName] = useState("");
  const [regPassword1, setRegPassword1] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [regDescription, setRegDescription] = useState("");
  const [regOccupation, setRegOccupation] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await fetchModel("/api/users/login", {
        method: "POST",
        body: JSON.stringify({ login_name: loginUsername, password: loginPassword }),
      });

      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      
      if (props.onLogin) {
        props.onLogin(data.user);
      }
      navigate(`/users/${data.user._id}`);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleRegister = async () => {
    setRegError("");
    setRegSuccess("");
    if (regPassword1 !== regPassword2) {
      setRegError("Passwords do not match");
      return;
    }

    try {
      const response = await fetchModel("/user", {
        method: "POST",
        body: JSON.stringify({
          login_name: regLoginName,
          password: regPassword1,
          first_name: regFirstName,
          last_name: regLastName,
          location: regLocation,
          description: regDescription,
          occupation: regOccupation,
        }),
      });

      setRegSuccess(`User ${response.login_name} registered successfully! Please login.`);
      setRegLoginName("");
      setRegPassword1("");
      setRegPassword2("");
      setRegFirstName("");
      setRegLastName("");
      setRegLocation("");
      setRegDescription("");
      setRegOccupation("");
      
      // Automatically switch to login view after 2 seconds
      setTimeout(() => {
        setIsLoginView(true);
      }, 2000);

    } catch (err) {
      setRegError(err.message);
    }
  };

  return (
    <Box p={4} bgcolor="#f5f5f5" minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
      <Grid container spacing={4} justifyContent="center">
        {isLoginView ? (
          /* L O G I N   S E C T I O N */
          <Grid item xs={12} sm={8} md={5}>
            <Paper elevation={3} sx={{ padding: 4 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Sign In
              </Typography>

              {loginError && (
                <Typography color="error" align="center" gutterBottom>
                  {loginError}
                </Typography>
              )}
              {regSuccess && (
                <Typography color="primary" align="center" gutterBottom>
                  {regSuccess}
                </Typography>
              )}

              <Box display="flex" flexDirection="column" gap={2} mt={2}>
                <TextField
                  label="Login Name"
                  variant="outlined"
                  fullWidth
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" size="large" onClick={handleLogin}>
                  Login
                </Button>
                
                <Box textAlign="center" mt={2}>
                  <Typography variant="body2">
                    Bạn chưa có tài khoản?{" "}
                    <Button color="secondary" onClick={() => setIsLoginView(false)} style={{textTransform: 'none', fontWeight: 'bold'}}>
                      Đăng ký
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ) : (
          /* R E G I S T E R   S E C T I O N */
          <Grid item xs={12} sm={8} md={5}>
            <Paper elevation={3} sx={{ padding: 4 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Register
              </Typography>

              {regError && (
                <Typography color="error" align="center" gutterBottom>
                  {regError}
                </Typography>
              )}

              <Box display="flex" flexDirection="column" gap={2} mt={2}>
                <TextField
                  label="Login Name *"
                  variant="outlined"
                  value={regLoginName}
                  onChange={(e) => setRegLoginName(e.target.value)}
                />
                <TextField
                  label="First Name *"
                  variant="outlined"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                />
                <TextField
                  label="Last Name *"
                  variant="outlined"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                />
                <TextField
                  label="Password *"
                  type="password"
                  variant="outlined"
                  value={regPassword1}
                  onChange={(e) => setRegPassword1(e.target.value)}
                />
                <TextField
                  label="Verify Password *"
                  type="password"
                  variant="outlined"
                  value={regPassword2}
                  onChange={(e) => setRegPassword2(e.target.value)}
                />
                <TextField
                  label="Location"
                  variant="outlined"
                  value={regLocation}
                  onChange={(e) => setRegLocation(e.target.value)}
                />
                <TextField
                  label="Occupation"
                  variant="outlined"
                  value={regOccupation}
                  onChange={(e) => setRegOccupation(e.target.value)}
                />
                <TextField
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={regDescription}
                  onChange={(e) => setRegDescription(e.target.value)}
                />
                <Button variant="contained" color="secondary" size="large" onClick={handleRegister}>
                  Register Me
                </Button>
                
                <Box textAlign="center" mt={2}>
                  <Typography variant="body2">
                    Đã có tài khoản?{" "}
                    <Button color="primary" onClick={() => setIsLoginView(true)} style={{textTransform: 'none', fontWeight: 'bold'}}>
                      Đăng nhập
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default LoginRegister;
