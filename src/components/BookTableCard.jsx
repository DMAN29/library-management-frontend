import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import UpdateBook from "./UpdateBook";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function BookTableCard({ books, setBooks }) {
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState(null);

  const handleUpdate = (id) => {
    axios
      .get(`http://localhost:8080/api/books/${id}`)
      .then((response) => setBook(response.data))
      .catch(() => alert("Error fetching book"));
    handleOpen();
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setBook(null);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/books/delete/${id}`)
      .then(() => {
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks);
      })
      .catch(() => alert("Error deleting book"));
  };

  const handleBookUpdate = (updatedBook) => {
    const updatedBooks = books.map((book) =>
      book.id === updatedBook.id ? updatedBook : book
    );
    setBooks(updatedBooks);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Book Name</StyledTableCell>
              <StyledTableCell>Total Quantity</StyledTableCell>
              <StyledTableCell>Update / Delete</StyledTableCell>
              <StyledTableCell>Quantity in Use</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.bookName}
                </StyledTableCell>
                <StyledTableCell>{row.total}</StyledTableCell>
                <StyledTableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleUpdate(row.id)}
                  >
                    UPDATE
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ mx: 2 }}
                    onClick={() => handleDelete(row.id)}
                  >
                    DELETE
                  </Button>
                </StyledTableCell>
                <StyledTableCell>{row.quantity}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {book && (
        <UpdateBook
          open={open}
          handleClose={handleClose}
          data={book}
          handleBookUpdate={handleBookUpdate}
        />
      )}
    </>
  );
}
