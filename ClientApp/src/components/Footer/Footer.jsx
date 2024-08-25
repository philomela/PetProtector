import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FooterIcon from '../../utils/FooterIcon';

const Footer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#638889",
        padding: "20px",
        position: "fixed", // фиксированная позиция
        bottom: 0, // расположение внизу
       
        width: "100%", // растягивается на всю ширину экрана
        height: "auto", // автоматическая высота
        minHeight: "10vh", // минимальная высота, чтобы контент не слишком сжимался
        maxWidth: "lg"
      }}
    >
      <Typography variant="h6" color="white">
        PetProtector - QR-адресники для питомцев
      </Typography>
      <Typography variant="body2" color="white" sx={{ marginTop: "10px" }}>
        Наши QR-адресники помогут вам быстро найти вашего питомца в случае его потери.
      </Typography>
      <Link href="https://www.youtube.com/watch?v=example" target="_blank" rel="noopener" sx={{ marginTop: "10px", color: "white", display: "flex", alignItems: "center" }}>
        <YouTubeIcon sx={{ marginRight: "5px" }} />
        Видеоинструкция на YouTube
      </Link>
      <Typography variant="body2" color="white" sx={{ marginTop: "10px" }}>
        © 2024 PetProtector QR-адресники для ваших питомцев. Все права защищены.
      </Typography>
      <Typography variant="body2" color="white" sx={{ marginTop: "10px" }}>
        Design by PetProtector
      </Typography>
      <FooterIcon/>
    </Box>
  );
};

export default Footer;


