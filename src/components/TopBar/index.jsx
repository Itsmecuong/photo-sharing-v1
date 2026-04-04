import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar () {
    const location = useLocation();
    const [contextText, setContextText] = useState("");

    useEffect(() => {
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
    }, [location.pathname]);

    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h5" color="inherit">
                Hi, Vu Thanh Cuong
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5" color="inherit">
                {contextText}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
}

export default TopBar;
