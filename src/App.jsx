import React, { useEffect, useState } from "react";
import UserCard from "./components/UserCard";
import { Button } from "@mui/material";
import BookCard from "./components/BookCard";
import "./App.css";
import UserTableCard from "./components/UserTableCard";
import BookTableCard from "./components/BookTableCard";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import axios from "axios";

const App = () => {
  const [openUserModel, setOpenUserModel] = React.useState(false);
  const handleOpenUserModel = () => setOpenUserModel(true);
  const handleCloseUserModel = () => setOpenUserModel(false);

  const [openBookModel, setOpenBookModel] = React.useState(false);
  const handleOpenBookModel = () => setOpenBookModel(true);
  const handleCloseBookModel = () => setOpenBookModel(false);

  const [selectedValue, setSelectedValue] = useState("user");
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const [users, setUsers] = useState([]);

  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch(() => alert("Error fetching users"));

    axios
      .get("http://localhost:8080/api/books")
      .then((response) => setBooks(response.data))
      .catch(() => alert("error fetching data"));
  }, []);

  return (
    <div>
      <Button onClick={handleOpenUserModel} sx={{ m: 2 }} variant="contained">
        Add New User
      </Button>
      <Button onClick={handleOpenBookModel} sx={{ m: 2 }} variant="contained">
        Add new Book
      </Button>
      <div>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            row
            onChange={handleChange}
            value={selectedValue}
          >
            <FormControlLabel
              value="user"
              control={<Radio />}
              label="User Table"
            />
            <FormControlLabel
              value="book"
              control={<Radio />}
              label="Book Table"
            />
          </RadioGroup>
        </FormControl>
      </div>

      {selectedValue === "user" ? (
        <UserTableCard users={users} setUsers={setUsers} />
      ) : (
        <BookTableCard books={books} setBooks={setBooks} />
      )}
      <UserCard
        open={openUserModel}
        handleClose={handleCloseUserModel}
        setUsers={setUsers}
      />
      <BookCard
        open={openBookModel}
        handleClose={handleCloseBookModel}
        setBooks={setBooks}
      />
    </div>
  );
};

export default App;
