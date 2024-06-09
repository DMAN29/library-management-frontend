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

export default function UpdateBook({
  open,
  handleClose,
  data,
  handleBookUpdate,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedBook = new FormData(e.currentTarget);
    const book = {
      id: data.id,
      bookName: updatedBook.get("bookName"),
      total: updatedBook.get("total"),
    };
    console.log("updated book", book);

    axios
      .put(`http://localhost:8080/api/books/update/${book.id}`, book)
      .then((response) => {
        handleBookUpdate(response.data);
      })
      .catch(() => alert("Error updating book"));

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
                  id="bookName"
                  name="bookName"
                  label="Book Name"
                  defaultValue={data.bookName}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="total"
                  name="total"
                  label="Total Quantity"
                  defaultValue={data.total}
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
