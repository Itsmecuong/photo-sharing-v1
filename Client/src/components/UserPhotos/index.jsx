import React, { useState, useEffect } from "react";
import { Typography, Card, CardHeader, CardMedia, CardContent, Divider, List, ListItem, ListItemText, TextField, Button, Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos () {
    const { userId } = useParams();
    const [photos, setPhotos] = useState(null);
    const [commentTexts, setCommentTexts] = useState({});

    const loadPhotos = () => {
        fetchModel(`/photosOfUser/${userId}`)
            .then((data) => {
                setPhotos(data);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        loadPhotos();
    }, [userId]);

    const handleCommentChange = (photoId, text) => {
        setCommentTexts(prev => ({ ...prev, [photoId]: text }));
    };

    const handleCommentSubmit = async (photoId) => {
        const text = commentTexts[photoId];
        if (!text || text.trim() === "") return;

        try {
            await fetchModel(`/commentsOfPhoto/${photoId}`, {
                method: "POST",
                body: JSON.stringify({ comment: text })
            });
            // Tải lại danh sách ảnh để thấy comment mới
            loadPhotos();
            // Xoá nội dung ô input
            setCommentTexts(prev => ({ ...prev, [photoId]: "" }));
        } catch (err) {
            alert(err.message);
        }
    };

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
                  subheader={new Date(photo.date_time).toLocaleString()} 
                />
                <CardMedia
                    component="img"
                    image={`http://localhost:8081/images/${photo.file_name}`}
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
                                                        {new Date(comment.date_time).toLocaleString()}
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

                    {/* Khung nhập bình luận mới */}
                    <Box display="flex" gap={2} mt={2}>
                        <TextField
                            size="small"
                            fullWidth
                            variant="outlined"
                            placeholder="Add a comment..."
                            value={commentTexts[photo._id] || ""}
                            onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleCommentSubmit(photo._id);
                                }
                            }}
                        />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => handleCommentSubmit(photo._id)}
                            disabled={!commentTexts[photo._id]?.trim()}
                        >
                            Post
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        ))}
      </div>
    );
}

export default UserPhotos;
