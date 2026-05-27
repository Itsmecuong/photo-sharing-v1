import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchModel(`/user/${userId}`)
            .then((data) => {
                setUser(data);
            })
            .catch((error) => console.log(error));
    }, [userId]);

    if (!user) {
        return <Typography>Loading user...</Typography>;
    }

    return (
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body1">
              <strong>Location:</strong> {user.location}
            </Typography>
            <Typography variant="body1">
              <strong>Occupation:</strong> {user.occupation}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Description:</strong> <span dangerouslySetInnerHTML={{ __html: user.description }} />
            </Typography>
            
            <Button 
              component={Link} 
              to={`/photos/${user._id}`} 
              variant="contained" 
              color="primary"
            >
              See Photos
            </Button>
          </CardContent>
        </Card>
    );
}

export default UserDetail;
