import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import CustomButton from "./CustomButton";

interface CardItemProps {
  title: string;
  description: string;
}

const CardItem: React.FC<CardItemProps> = ({ title, description }) => {
  return (
    <Card>
      <CardMedia
        component="div"
        sx={{
          height: 140,
          backgroundColor: (theme) => theme.palette.grey[300],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Imagen
        </Typography>
      </CardMedia>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box>
          <CustomButton label="Ver más" variant="contained" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardItem;
