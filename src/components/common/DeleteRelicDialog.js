import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const DeleteRelicDialog = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Borrar Reliquia</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Esta acción eliminará la reliquia de forma permanente. ¿Está seguro de que desea continuar?          
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Borrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRelicDialog;