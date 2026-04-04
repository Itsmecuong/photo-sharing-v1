import React, { useState, useEffect } from "react";
import { Typography, Card, CardHeader, CardMedia, CardContent, Divider, List, ListItem, ListItemText } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos () {
    const { userId } = useParams();
    const [photos, setPhotos] = useState(null);

    useEffect(() => {
        fetchModel(`/photosOfUser/${userId}`)
            .then((data) => {
                setPhotos(data);
            })
            .catch((err) => console.log(err));
    }, [userId]);

    if (!photos) {
        return <Typography>Loading photos...</Typography>;
    }
    
    if (photos.length === 0) {
        return <Typography>No photos found</Typography>;
    }

    return (
      <div>
        {photos.map((photo) => (
            <Card key={photo._id} sx={{ marginBottom: 4 }}>
                <CardHeader 
                  title={`Post Settings`} 
                  subheader={photo.date_time} 
                />
                <CardMedia
                    component="img"
                    image={require(`../../images/${photo.file_name}`)}
                    alt={photo.file_name}
                />
                <CardContent>
                    <Typography variant="h6" sx={{ fontSize: 16 }}>Comments</Typography>
                    {photo.comments && photo.comments.length > 0 ? (
                        <List>
                            {photo.comments.map(comment => (
                                <React.Fragment key={comment._id}>
                                    <ListItem alignItems="flex-start" sx={{ paddingLeft: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Link to={`/users/${comment.user._id}`} style={{ textDecoration: 'none', fontWeight: 'bold' }}>
                                                    {comment.user.first_name} {comment.user.last_name}
                                                </Link>
                                            }
                                            secondary={
                                                <React.Fragment>
                                                    <Typography component="span" variant="caption" color="textSecondary" display="block">
                                                        {comment.date_time}
                                                    </Typography>
                                                    <Typography component="span" variant="body2" color="textPrimary">
                                                        {comment.comment}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="textSecondary">No comments yet.</Typography>
                    )}
                </CardContent>
            </Card>
        ))}
      </div>
    );
}

export default UserPhotos;
