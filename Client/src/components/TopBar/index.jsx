import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Grid, Button } from "@mui/material";
import { useLocation } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar(props) {
  const location = useLocation();
  const [contextText, setContextText] = useState("");

  useEffect(() => {
    if (!props.user) {
      setContextText("");
      return;
    }

    const pathParts = location.pathname.split('/');
    if (pathParts.length === 3) {
      const type = pathParts[1];
      const userId = pathParts[2];

      fetchModel(`/user/${userId}`)
        .then((user) => {
          if (type === 'users') {
            setContextText(`Details of ${user.first_name} ${user.last_name}`);
          } else if (type === 'photos') {
            setContextText(`Photos of ${user.first_name} ${user.last_name}`);
          }
        })
        .catch(err => {
          console.log(err);
          setContextText("");
        });
    } else {
      setContextText("");
    }
  }, [location.pathname, props.user]);

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("http://localhost:8081/photos/new", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }

      alert("Photo uploaded successfully!");
      // Note: Realistically, if we are on the user's own photos page, we should refresh it,
      // but for now an alert is sufficient to indicate success.
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5" color="inherit">
              {props.user ? `Hi, ${props.user.first_name}` : "Please Login"}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" color="inherit">
              {contextText}
            </Typography>
          </Grid>
          <Grid item>
            {props.user && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button variant="contained" component="label" color="secondary">
                  Add Photo
                  <input type="file" hidden accept="image/*" onChange={handleUploadPhoto} />
                </Button>
                <Button color="inherit" onClick={props.onLogout} variant="outlined">
                  Logout
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
