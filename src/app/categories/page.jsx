'use client'
import React, { useState, useEffect } from "react";
import { ref, push, set, get, update, remove } from "firebase/database";
import database from '../component/FirebaseConfig/FirebaseConfig';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Categories() {
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const categoriesRef = ref(database, 'category');
    get(categoriesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const categoryData = snapshot.val();
          const categoriesArray = Object.keys(categoryData).map((key) => ({
            id: key,
            description: categoryData[key].description,
          }));
          setCategories(categoriesArray);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const isNullOrWhiteSpaces = (value) => {
    value = value.toString();
    return value == null || value.replaceAll(' ', '').length < 1;
  };

  const submitCategory = () => {
    if (isNullOrWhiteSpaces(description)) {
      alert("Description cannot be empty");
      return;
    }

    const newCategoryRef = push(ref(database, 'category'));
    const newCategoryId = newCategoryRef.key;

    set(newCategoryRef, {
      description: description,
    });

    setCategories((prevCategories) => [
      ...prevCategories,
      {
        id: newCategoryId,
        description: description,
      },
    ]);

    setDescription('');
    handleClose();
  };

  const deleteCategory = (index, categoryId) => {
    const categoryRef = ref(database, `category/${categoryId}`);
    remove(categoryRef);

    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories.splice(index, 1);
      return updatedCategories;
    });
  };

  const startEditing = (index, initialDescription) => {
    setEditingIndex(index);
    setEditedDescription(initialDescription);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditedDescription('');
  };

  const updateDescription = (index, categoryId) => {
    if (isNullOrWhiteSpaces(editedDescription)) {
      alert("Description cannot be empty");
      return;
    }

    const categoryRef = ref(database, `category/${categoryId}`);
    update(categoryRef, {
      description: editedDescription,
    });

    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories[index].description = editedDescription;
      return updatedCategories;
    });

    setEditingIndex(null);
    setEditedDescription("");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" style={{ "margin": "20px" }} onClick={handleClickOpen}>
        Add Category
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            submitCategory();
          },
        }}
      >
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Category Name"
            type="text"
            fullWidth
            variant="standard"
            multiline
            rows={5}
            style={{ width: '300px' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit">Submit</Button>
          <Button onClick={handleClose} color='error'>Cancel</Button>
        </DialogActions>
      </Dialog>

      {categories.map((category, i) => (
        <Accordion key={i} style={{ "margin-left": "20px", "margin-right": "20px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {editingIndex === i ? (
              <div>
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
              </div>
            ) : (
              <Typography>{category.description}</Typography>
            )}
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              dangerouslySetInnerHTML={{
                __html: editingIndex === i ? editedDescription : category.description,
              }}
            />
          </AccordionDetails>
          <AccordionActions>
            {editingIndex === i ? (
              <>
                <Button onClick={() => updateDescription(i, category.id)}>Save</Button>
                <Button onClick={cancelEditing}>Cancel</Button>
              </>
            ) : (
              <>
                <Button onClick={() => startEditing(i, category.description)}>Edit</Button>
                <Button onClick={() => deleteCategory(i, category.id)} color="error">Delete</Button>
              </>
            )}
          </AccordionActions>
        </Accordion>
      ))}
    </React.Fragment>
  );
}

export default Categories;
