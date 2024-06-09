import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Grid, TextField } from "@mui/material";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function UserCard({ open, handleClose, setUsers }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const user = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
    };
    console.log("user", user);

    axios
      .post("http://localhost:8080/api/users", user)
      .then((response) => {
        setUsers((prevUsers) => [...prevUsers, response.data]);
      })
      .catch(() => alert("Error adding user"));

    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit}>
            <Grid container gap={2}>
              <Grid item xs={12}>
                <TextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  type="submit"
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
