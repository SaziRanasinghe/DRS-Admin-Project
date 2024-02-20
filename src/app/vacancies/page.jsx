
 "use client"
 import { ref, push, set, get, update, remove } from "firebase/database";
 import { useState, useEffect } from "react";
 import React from 'react'
 import database from '../component/FirebaseConfig/FirebaseConfig';
 import Button from '@mui/material/Button';
 import { styled } from '@mui/material/styles';
 import Dialog from '@mui/material/Dialog';
 import DialogTitle from '@mui/material/DialogTitle';
 import DialogContent from '@mui/material/DialogContent';
 import DialogActions from '@mui/material/DialogActions';
 import IconButton from '@mui/material/IconButton';
 import CloseIcon from '@mui/icons-material/Close';
 import Typography from '@mui/material/Typography';
 import Accordion from '@mui/material/Accordion';
 import AccordionActions from '@mui/material/AccordionActions';
 import AccordionSummary from '@mui/material/AccordionSummary';
 import AccordionDetails from '@mui/material/AccordionDetails';
 import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
 import { CKEditor } from '@ckeditor/ckeditor5-react';
 import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
 import TextField from '@mui/material/TextField';
 
 
 const BootstrapDialog = styled(Dialog)(({ theme }) => ({
     '& .MuiDialogContent-root': {
       padding: theme.spacing(2),
     },
     '& .MuiDialogActions-root': {
       padding: theme.spacing(1),
     },
   }));
 
   
 
 function vacancies(){
     let [title, setTitle] = useState('');
     let [description, setDescription] = useState('');
     let [vacancies, setVacancies] = useState([]);
     let [editingIndex, setEditingIndex] = useState(null);
     const [editedTitle, setEditedTitle] = useState("");
     let [editedDescription, setEditedDescription] = useState('');
   
     useEffect(() => {
       const vacanciesRef = ref(database, 'vacancy');
       get(vacanciesRef)
         .then((snapshot) => {
           if (snapshot.exists()) {
             const vacancyData = snapshot.val();
             const vacanciesArray = Object.entries(vacancyData).map(([key, value]) => ({
               id: key,
               title: vacancyData[key].title,
               description: vacancyData[key].description,
             }));
             setVacancies(vacanciesArray);
           }
          
              
         })
         .catch((error) => {
           console.error("Error fetching vacancies:", error);
         });
     }, []);
   
     let isNullorWhiteSpaces = value => {
       value = value.toString();
       return (value == null || value.replaceAll(' ','').length < 1);
     }
   
   //add vacancies
   const SubmitData = () => {
    if (isNullorWhiteSpaces(title) || isNullorWhiteSpaces(description) || selectedCategory === null) {
      alert("Fill all the fields");
      return;
    }
  
    const newBlogRef = push(ref(database, 'blog'));  
    const newBlogKey = newBlogRef.key; 
  
    const blogData = {
      title: title,
      description: description,
      category: selectedCategory.name // Assuming you want to save the category name
    };
  
    set(newBlogRef, blogData);
  
    setBlogs((prevBlogs) => [
      ...prevBlogs,
      {
        id: newBlogKey,
        title: title,
        description: description,
        category: selectedCategory.name
      },
    ]);
  
    setTitle('');
    setDescription('');
    setSelectedCategory(null); // Clear selected category after submission
  };
 
   const [open, setOpen] = React.useState(false);
 
   const handleClickOpen = () => {
     setOpen(true);
   };
 
   const handleClose = () => {
     setOpen(false);
   };
 
     return(
        <React.Fragment>
 
       {/* add vacancy button  */}
       <Button variant="outlined" style={{"margin":"30px"}} onClick={handleClickOpen}>
         Add Vacancy
       </Button>
 
     {/* Display added vacancies */}
     
 
 {vacancies.map((vacancy, i) => (
   <Accordion key={i} style = {{"margin-left" : "20px", "margin-right" : "20px"}}>
     <AccordionSummary expandIcon={<ExpandMoreIcon />}>
       {editingIndex === i ? (
         <div>
           <input
             type="text"
             value={editedTitle}
             onChange={(e) => setEditedTitle(e.target.value)}
             
           />
           <input
             type="text"
             value={editedDescription}
             onChange={(e) => setEditedDescription(e.target.value)}
           />
         </div>
       ) : (
         <Typography>{vacancy.title}</Typography>
       )}
     </AccordionSummary>
     <AccordionDetails>
       {/* Display the vacancy description */}
       <Typography
         dangerouslySetInnerHTML={{
           __html: editingIndex === i ? editedDescription : vacancy.description,
         }}
       />
     </AccordionDetails>
     <AccordionActions>
       {editingIndex === i ? (
         <>
           <Button onClick={() => updateTitleAndDescription(i, vacancy.id)}>Save</Button>
           <Button onClick={cancelEditing}>Cancel</Button>
         </>
       ) : (
         <>
           <Button onClick={() => startEditing(i, vacancy.title, vacancy.description)}>Edit</Button>
           <Button onClick={() => deleteVacancy(i, vacancy.id)} color="error">Delete</Button>
         </>
       )}
     </AccordionActions>
   </Accordion>
 ))}
 
 
     
  
       {/*vacancy title*/}
       <BootstrapDialog
         onClose={handleClose}
         aria-labelledby="customized-dialog-title"
         open={open}>
         <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
           Add Your Vacancy
         </DialogTitle>

         <TextField id="outlined-basic" label="Title" variant="outlined" value={title} style = {{"margin-left" : "20px", "margin-right" : "20px"}} onChange={e=>setTitle(e.target.value)}/>

         {/* <input type="text" value={title} onChange={e=>setTitle(e.target.value)}/> */}
         <IconButton
           aria-label="close"
           onClick={handleClose}
           sx={{
             position: 'absolute',
             right: 8,
             top: 8,
             color: (theme) => theme.palette.grey[500],
           }}>
           <CloseIcon />
         </IconButton>
 
         
 
         {/* description */}
         <DialogContent dividers>
           <Typography gutterBottom>Add description here
 
            
           </Typography>
           <CKEditor
             editor={ClassicEditor}
             data={description}
             onChange={(event, editor) => {
               const data = editor.getData();
               setDescription(data);
             }}
             
           />
         </DialogContent>
  
       
         
         {/* submit button */}
         <DialogActions>
           <Button autoFocus onClick={SubmitData}>
             Add
           </Button>
          
         </DialogActions>
       </BootstrapDialog>
       </React.Fragment>
     
     )
   
         }
 export default vacancies;