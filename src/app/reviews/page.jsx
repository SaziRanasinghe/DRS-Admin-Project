'use client'
import {ref, set, get, update,remove, child} from "firebase/database";
import { useEffect, useState } from 'react';
import database from '../component/FirebaseConfig/FirebaseConfig';
import Button from '@mui/material/Button';
import React from 'react'
// import { Accordion } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
 
const Reviews = () => {
  
    const [approvedReviews, setApprovedReviews] = useState([]);
    const [pendingReviews, setPendingReviews] = useState([]);
    
    useEffect(() => {
      const usersRef = ref(database, 'reviews');
      get(usersRef).then((snapshot) => {
        if(snapshot.exists()){
          const reviewsArray = Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...data,
          }));
  
    const approved = reviewsArray.filter((review) => review.isTrue);
    const pending = reviewsArray.filter((review) => !review.isTrue);
          setApprovedReviews(approved);
          setPendingReviews(pending);
   
        } else {
          console.log('no data ');
  
        }
      }).catch((error) => {
        console.error(error);
      });
    }, []);

    const deletePendingReview = (index, reviewId) => {
      // Check if reviewId is valid
      if (!reviewId || typeof reviewId !== 'string' || reviewId.trim() === "") {
        console.error("Invalid reviewId:", reviewId);
        return;
      }
    
      console.log("ReviewId before deletion:", reviewId);
    
      // Sanitize the reviewId to remove invalid characters
      const sanitizedReviewId = reviewId.replace(/[.#$/[\]]/g, '');
    
      // Check if sanitized reviewId is empty after removing invalid characters
      if (sanitizedReviewId.trim() === "") {
        console.error("Sanitized reviewId is empty after removing invalid characters");
        return;
      }
    
      const reviewRef = ref(database, `reviews/${sanitizedReviewId}`);
    
      // Remove the review from the database
    remove(reviewRef)
    .then(() => {
      console.log("Review deleted successfully");

      // If the database operation is successful, update the state
      setPendingReviews((prevPendingReviews) => {
        const updatedPendingReviews = [...prevPendingReviews];
        updatedPendingReviews.splice(index, 1);
        return updatedPendingReviews;
      });
    })
    .catch((error) => {
      console.error("Error deleting review from database:", error);
    });
};
    
     
      const acceptReview = (index, reviewId) => {
      const reviewRef = ref(database, `reviews/${reviewId}`);
      update(reviewRef, { isTrue: true });
  
      setPendingReviews((prevPendingReviews) => {
        const updatedPendingReviews = [...prevPendingReviews];
          updatedPendingReviews.splice(index, 1);
        return updatedPendingReviews;
      });
  
      setApprovedReviews((prevApprovedReviews) => [
        ...prevApprovedReviews,
        { ...pendingReviews[index], isTrue: true },
      ]);
    };



  return (
    <main className='container mx-auto'>
       {/* <Button variant="outlined" onClick={handleClickOpen}>
        user reviews
      </Button> */}

<h1 className="text-4xl font-bold text-center my-10" style = {{"margin" : "10px"}}>Pending Reviews</h1>
      <div className="grid grid-cols-3 gap-4">
        {pendingReviews.map((user, index) => (

          <Accordion key={user.id} style = {{"margin-left" : "20px", "margin-right" : "20px"}}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`Title - ${user.title}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{`Username - ${user.name}`}</Typography>
            <Typography>{`Description - ${user.description }`}</Typography>
          </AccordionDetails>
          <AccordionActions>
            <Button color="error" onClick={() => deletePendingReview(index, user.id)}>
              Decline
            </Button>
            <Button onClick={() => acceptReview(index, user.id)}>Accept</Button>
          </AccordionActions>
        </Accordion>
      ))}
    </div>

    <h1 className='text-4xl font-bold text-center my-10' style = {{"margin" : "10px"}}>Approved Reviews</h1>
    <div className='grid grid-cols-3 gap-4'>
      {approvedReviews.map((user) => (
        <Accordion key={user.id} style = {{"margin-left" : "20px", "margin-right" : "20px"}}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`Title - ${user.title}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{`Username - ${user.name}`}</Typography>
            <Typography>{`Description - ${user.description}`}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  </main>
     
  )
}

export default Reviews;