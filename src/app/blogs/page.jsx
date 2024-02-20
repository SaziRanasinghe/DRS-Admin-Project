'use client'
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import database from '../component/FirebaseConfig/FirebaseConfig';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { ref, push, set, get, update, remove } from 'firebase/database';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
 
  function Blogs (){
      let [title, setTitle] = useState('');
      let [description, setDescription] = useState('');
      let [categories, setCategories] = useState([]);
      let [selectedCategory, setSelectedCategory] = useState(null);
      let [blogs, setBlogs] = useState([]);
      let [editingIndex, setEditingIndex] = useState(null);
      const [editedDescription, setEditedDescription] = useState('');
      const [editedTitle, setEditedTitle] = useState("");

      useEffect(() => {
        const categoriesRef = ref(database, 'category');
        get(categoriesRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const categoryData = snapshot.val();
                    const categoryArray = Object.values(categoryData).map((category) => ({
                        id: category.id,
                        name: category.description,
                    }));
                    setCategories(categoryArray);
                }
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });

        const blogsRef = ref(database, 'blog');  
        get(blogsRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const blogData = snapshot.val();
              const blogsArray = Object.entries(blogData).map(([key, value]) => ({
                id: key,
                title: blogData[key].title,
                description: blogData[key].description,
              }));
              setBlogs(blogsArray);
            }
          })
          .catch((error) => {
            console.error("Error fetching categories:", error);
          });
      }, []);
    
      let isNullorWhiteSpaces = value => {
        value = value.toString();
        return (value == null || value.replaceAll(' ','').length < 1);
      };
      

     
    //add blogs
    const SubmitData = () => {
      if (isNullorWhiteSpaces(title) || isNullorWhiteSpaces(description) ) {
        alert("Fill all the fields");
        return;
      }
    
      const newBlogRef = push(ref(database, 'blog'));  
      const newBlogKey = newBlogRef.key; 
    
      const blogData = {
        title: title,
        description: description,
        category: selectedCategory.name  
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
      setSelectedCategory(null);  
    };
    
  
    const deleteBlog = (index, blogId) => {
      const blogRef = ref(database, `blog/${blogId}`);
      remove(blogRef);

      
        
  
      setBlogs((prevBlogs) => {
        const updatedBlogs = [...prevBlogs];
        updatedBlogs.splice(index, 1);
        

        return updatedBlogs;
      });
    };

    
  
    const startEditing = (index, initialTitle, initialDescription) => {
      setEditingIndex(index);
      setEditedTitle(initialTitle);
      setEditedDescription(initialDescription);
    };
  
    const cancelEditing = () => {
      setEditingIndex(null);
      setEditedDescription('');
    };
  
   
      
        const updateTitleAndDescription = (index, blogId) => {
          if (isNullorWhiteSpaces(editedTitle) || 
          isNullorWhiteSpaces(editedDescription)) {
            alert("Title and description cannot be empty");
            return;
          }
  
      const blogRef = ref(database, `blog/${blogId}`);
      update(blogRef, {
        description: editedDescription,
      });
  
      setBlogs((prevBlogs) => {
        const updatedBlogs = [...prevBlogs];
        updatedBlogs[index].description = editedDescription;
        return updatedBlogs;
      });
  
      setEditingIndex(null);
      setEditedDescription("");
      setEditedTitle("");
    };
  


  const [open, setOpen] = React.useState(false);
 
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  

  return (

   
    <React.Fragment>

  {/* add blog button  */}
  <Button variant="outlined" style={{ "margin": "20px" }} onClick={handleClickOpen}>
        Add Blogs
      </Button>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Blog Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
          <TextField
        id="outlined-basic"
        label="Add Title"
        variant="outlined"
        style={{ width: '30%' }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Autocomplete
                disablePortal
                id="combo-box-demo"
                style={{ width: '50%', marginTop: '10px' }}
                options={categories}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option) => option.id}
                value={selectedCategory}
                onChange={(event, newValue) => setSelectedCategory(newValue)}
                renderInput={(params) => <TextField {...params} label="Select Category" />}
            />

      <Typography variant="h6" style={{ margin: '20px', textAlign: 'center' }}>
        Add Description
      </Typography>

      <CKEditor
        editor={ClassicEditor}
        data={description}
        onChange={(event, editor) => {
          const data = editor.getData();
          setDescription(data);
        }}
      />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button
 
         
 onClick={SubmitData}
>
 Save
</Button>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>

        </DialogActions>
      </Dialog>

      {blogs.map((blog, i) => (
        <Accordion key={i} style={{ "margin-left": "20px", "margin-right": "20px" }}>
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
            <> 
            <Typography>{blog.title}</Typography>
             
            </>
          )}
        </AccordionSummary>
        <AccordionDetails>
       {/* Display the blog description */}
       <Typography
         dangerouslySetInnerHTML={{
           __html: editingIndex === i ? editedDescription : blog.description,
         }}
       />
     </AccordionDetails>
     
          <AccordionActions>
            {editingIndex === i ? (
              <>
                <Button onClick={() => updateTitleAndDescription(i, blog.id)}>Save</Button>
                <Button onClick={cancelEditing}>Cancel</Button>
              </>
            ) : (
              <>
                <Button onClick={() => startEditing(i, blog.title, blog.description)}>Edit</Button>
                <Button onClick={() => deleteBlog(i, blog.id)} color="error">Delete</Button>
              </>
            )}
          </AccordionActions>
        </Accordion>
      ))}
       
       

     
   </React.Fragment> 
  );
}

export default Blogs;