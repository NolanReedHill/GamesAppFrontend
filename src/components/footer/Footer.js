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
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            About Us
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            Welcome to EasyBuy, the shopping solution you've been looking for.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Contact Us
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            123 Main Street, Anytown, USA
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            Email: support.easyBuy@easyBuy.com
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            Phone: +1 234 567 8901
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Follow Us
                        </Typography>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Link href="https://www.facebook.com/" color="inherit">
                                <Facebook />
                            </Link>
                            <Link
                                href="https://www.instagram.com/"
                                color="inherit"
                                sx={{ pl: 1, pr: 1 }}
                            >
                                <Instagram />
                            </Link>
                            <Link href="https://www.twitter.com/" color="inherit">
                                <Twitter />
                            </Link>
                        </div>
                    </Grid>
                </Grid>
                <Box mt={5}>
                    <Typography variant="body2" color="text.secondary" align="center" >
                        {"Copyright © "}
                        <Link color="inherit" href="https://glittery-malasada-22e17e.netlify.app/">
                            EasyBuy
                        </Link>{" "}
                        {new Date().getFullYear()}
                        {"."}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}