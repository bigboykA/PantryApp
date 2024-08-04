'use client';
import { Box, Stack, Typography, Button, Modal, TextField, IconButton } from '@mui/material';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase'; 
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#e6ddd6', 
  border: 'none',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  const [itemName, setItemName] = useState('');
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    try {
      const snapshot = query(collection(firestore, 'pantry'));
      const docs = await getDocs(snapshot);
      const pantryList = [];
      docs.forEach(doc => {
        pantryList.push({ name: doc.id, count: doc.data().count });
      });
      setPantry(pantryList);
      console.log(pantryList);
    } catch (error) {
      console.error('Error fetching pantry items: ', error);
    }
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      await updateDoc(docRef, {
        count: docSnapshot.data().count + 1
      });
    } else {
      await setDoc(docRef, { count: 1 });
    }

    updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item.name);
    await deleteDoc(docRef);
    updatePantry();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      position="relative"
      bgcolor="#000000"
    >
      <Modal 
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id='modal-modal-title'
            variant='h6'
            component='h2'
            mb={2}
            sx={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}
          >
            Add Item
          </Typography>
          <Stack
            width="100%"
            direction={'row'}
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#bd2e95',
                '&:hover': { bgcolor: '#a3287d' } 
              }}
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box
        width="800px"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        position="absolute"
        top="20px"
        right="20px"
      >
        <Button 
          variant="contained"
          sx={{
            backgroundColor: '#9575CD',
            '&:hover': {
              backgroundColor: '#7E57C2'
            }
          }} onClick={handleOpen}
        >
          Add
        </Button>
      </Box>
      <Box 
        width="800px" 
        height="100px" 
        bgcolor="#7E57C2"
        display="flex"
        justifyContent="center"
        alignItems="center"
        border="none"
        borderRadius="10px"
        boxShadow="0 4px 12px rgba(0,0,0,0.5)"
        mt="80px"
        p={2}
      >
        <Typography 
          variant="h4" 
          color="#fff"
          textAlign="center"
          sx={{ fontWeight: '500', fontFamily: 'Roboto, sans-serif' }}
        >
          Pantry Items
        </Typography>
      </Box>
      <Box 
        width="800px"
        height="500px"
        sx={{ overflowY: 'auto', mt: 2 }}
      >
        <Stack 
          spacing={2}
        >
          {pantry.map((item) => (
            <Box
              key={item.name}
              width="100%"
              height="100px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#505050"
              color="#ffffff"
              border="none"
              borderRadius="10px"
              boxShadow="0 2px 4px rgba(0,0,0,0.5)"
              p={2}
              position="relative"
            >
              <Typography
                variant="h6"
                color="#ffffff"
                textAlign="center"
                sx={{ fontWeight: '400', fontFamily: 'Roboto, sans-serif' }}
              >
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              {item.count > 1 && (
                <Typography
                  variant="body2"
                  color="#ffffff"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}
                >
                  Quantity: {item.count}
                </Typography>
              )}
              <IconButton 
                onClick={() => removeItem(item)} 
                sx={{ 
                  color: '#d2e95', 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.2)' 
                  },
                  marginRight: 0
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
