import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Chip, Stack } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import axios from "axios";
import UpdateUser from "./UpdateUser";

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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function UserTableCard({ users, setUsers }) {
  const [books, setBooks] = useState([]);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/books")
      .then((response) => setBooks(response.data))
      .catch(() => alert("Error fetching books"));
  }, []);

  const handleUpdate = (id) => {
    axios
      .get(`http://localhost:8080/api/users/${id}`)
      .then((response) => {
        setUserToUpdate(response.data);
        setOpen(true);
      })
      .catch(() => alert("Error fetching user"));
  };

  const handleClose = () => {
    setOpen(false);
    setUserToUpdate(null);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/users/delete/${id}`)
      .then(() => {
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
      })
      .catch(() => alert("Error deleting user"));
  };

  const handleUserUpdate = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
  };

  const handleChange = (e, id) => {
    const selectedBook = e.target.value;
    const user = users.find((user) => user.id === id);
    const hasBook = user.books.some((book) => book.id === selectedBook.id);

    if (hasBook) {
      // Remove the book if already present
      axios
        .put(
          `http://localhost:8080/api/users/update/${id}/book/${selectedBook.id}`
        )
        .then(() => {
          setUsers((prevUsers) =>
            prevUsers.map((user) => {
              if (user.id === id) {
                return {
                  ...user,
                  books: user.books.filter(
                    (book) => book.id !== selectedBook.id
                  ), // Remove the selected book
                };
              }
              return user;
            })
          );
        })
        .catch((error) => alert(error.response.data.message));
    } else {
      // Add the book if not present
      axios
        .put(
          `http://localhost:8080/api/users/update/${id}/book/${selectedBook.id}`
        )
        .then(() => {
          setUsers((prevUsers) =>
            prevUsers.map((user) => {
              if (user.id === id) {
                return {
                  ...user,
                  books: [...user.books, selectedBook], // Add the selected book
                };
              }
              return user;
            })
          );
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Books</StyledTableCell>
              <StyledTableCell>Update / Delete</StyledTableCell>
              <StyledTableCell>Add/Remove Books</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.firstName + " " + row.lastName}
                </StyledTableCell>
                <StyledTableCell>
                  <Stack direction="row" spacing={1}>
                    {row.books?.map((item) => (
                      <Chip key={item.id} label={item.bookName} size="small" />
                    ))}
                  </Stack>
                </StyledTableCell>
                <StyledTableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleUpdate(row.id)}
                  >
                    UPDATE
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleDelete(row.id)}
                    color="error"
                    sx={{ mx: 2 }}
                  >
                    DELETE
                  </Button>
                </StyledTableCell>
                <StyledTableCell>
                  <FormControl fullWidth>
                    <InputLabel id={`demo-simple-select-label-${row.id}`}>
                      Books
                    </InputLabel>
                    <Select
                      labelId={`demo-simple-select-label-${row.id}`}
                      id={`demo-simple-select-${row.id}`}
                      value={selectedBook[row.id] || ""}
                      label="Available Books"
                      onChange={(e) => handleChange(e, row.id)}
                    >
                      {books.map((item) => (
                        <MenuItem key={item.id} value={item}>
                          {item.bookName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {userToUpdate && (
        <UpdateUser
          open={open}
          handleClose={handleClose}
          data={userToUpdate}
          setUsers={setUsers}
          users={users}
        />
      )}
    </>
  );
}
