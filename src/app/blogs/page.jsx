'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import Autocomplete from '@mui/material/Autocomplete';
import { ref, push, set, get } from 'firebase/database';
import database from '../component/FirebaseConfig/FirebaseConfig';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Button from '@mui/material/Button';
  
 
  function Blogs (){
      let [title, setTitle] = useState('');
      let [description, setDescription] = useState('');
      let [categories, setCategories] = useState([]);
      let [selectedCategory, setSelectedCategory] = useState(null);
      let [blogs, setBlogs] = useState([]);

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
      }
    
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
  

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > :not(style)': {
          margin: 10,
        },
      }}
    >
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

      <Button
        variant="contained"
        style={{
          alignSelf: 'flex-end',
          marginTop: '20px',
        }}
        endIcon={<SendIcon />}
        onClick={SubmitData}
      >
        Send
      </Button>
    </Box>
  );
}

export default Blogs;