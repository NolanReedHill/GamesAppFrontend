import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import { Box } from "@mui/material";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{ marginTop: "10%", height: "fit-content", width: "100%", marginBottom: "0%", backgroundColor: "#036627" }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={5} justifyContent="center">
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            About
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            My game website. Have fun!
                        </Typography>
                    </Grid>
                </Grid>
                <Box mt={5}>
                    <Typography variant="body2" color="text.secondary" align="center" >
                        {"Nolan Hill "}
                        {new Date().getFullYear()}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}