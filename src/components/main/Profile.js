import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import DeleteAccountDialog from '../common/DeleteAccountDialog';
import { useNavigate } from 'react-router-dom';
import {
  Chip,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import axios from 'axios';
import './Profile.scss';

const Profile = () => {
  const { user, logout, updateNiches } = useContext(AuthContext);
  const navigate = useNavigate();
  const [niches, setNiches] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSpecific, setSelectedSpecific] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [customSpecific, setCustomSpecific] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [error, setError] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchNiches = async () => {
      try {
        const res = await axios.get('/api/niche/niches');
        setNiches(res.data);
      } catch (err) {
        setError('Failed to fetch niches');
      }
    };
    fetchNiches();
  }, []);

  const handleAddNiche = async () => {
    if (isCustom && (!customCategory || !customSpecific)) {
      setError('Custom category and specific are required');
      return;
    }
    if (!isCustom && (!selectedCategory || !selectedSpecific)) {
      setError('Please select a category and specific niche');
      return;
    }

    const newNiche = isCustom
      ? { category: customCategory, specific: customSpecific, isCustom: true }
      : { category: selectedCategory, specific: selectedSpecific, isCustom: false };

    try {
      const updatedNiches = [...(user?.niches || []), newNiche];
      await updateNiches(updatedNiches);
      setCustomCategory('');
      setCustomSpecific('');
      setSelectedCategory('');
      setSelectedSpecific('');
      setIsCustom(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveNiche = async (index) => {
    try {
      const updatedNiches = user.niches.filter((_, i) => i !== index);
      await updateNiches(updatedNiches);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete logic
  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const sessionData = JSON.parse(sessionStorage.getItem('CURRENT_USER'));
      if (!sessionData?.refreshToken) {
        setError('No access token found');
        return;
      }

      await axios.delete(`/api/auth/users/${user._id}`, {
        headers: { Authorization: `Bearer ${sessionData.refreshToken}` },
      });

      logout();
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete account');
      console.error('Error deleting account:', error);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  return user ? (
    <Box className="profile-container" sx={{ p: 3 }}>
      <Box className="profile-header">
        <Button
          className="dashboard-back-button"
          variant="outlined"
          onClick={() => navigate('/')}
        >
          Volver
        </Button>
        <Typography variant="h4" sx={{ ml: 3 }}>
          Bienvenido, {user.username}!
        </Typography>
        <Button
          className="logout-button"
          variant="contained"
          color="secondary"
          onClick={logout}
        >
          Cerrar Sesión
        </Button>
      </Box>
      
      <Box className="profile-buttons" sx={{ display: 'flex', gap: 2, mb: 2 }}>        
        <Button
        className="view-relicario-button"
        variant="contained"        
        onClick={() => navigate('/reliquary')}        
      >
        Ver mi Relicario
      </Button>
        <Button
          className="add-relic-button"
          variant="contained"          
          onClick={() => navigate('/relic/add')}          
        >
          Agregar Reliquia
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Tus Nichos
      </Typography>
      <Box className="niches-tags" sx={{ mb: 2 }}>
        {user.niches && user.niches.length > 0 ? (
          user.niches.map((niche, index) => (
            <Chip
              key={`${niche.category}-${niche.specific}`}
              label={`${niche.category}: ${niche.specific}${niche.isCustom ? ' (Custom)' : ''}`}
              onDelete={() => handleRemoveNiche(index)}
              sx={{
                margin: '4px',
                backgroundColor: niche.isCustom ? '#e0f7fa' : '#f5f5f5',
                '& .MuiChip-deleteIcon': {
                  color: '#d32f2f',
                },
              }}
            />
          ))
        ) : (
          <Typography variant="body1">Aún no se agregaron Nichos.</Typography>
        )}
      </Box>
      <Typography variant="h5" gutterBottom>
        Agregar Nicho
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box className="niche-form" sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isCustom}
              onChange={() => setIsCustom(!isCustom)}
            />
          }
          label="Nicho Custom"
        />
        {isCustom ? (
          <>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Categoría Custom"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g., Music"
                variant="outlined"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Específico Custom"
                value={customSpecific}
                onChange={(e) => setCustomSpecific(e.target.value)}
                placeholder="e.g., Vintage Vinyl Records"
                variant="outlined"
              />
            </FormControl>
          </>
        ) : (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSpecific('');
                }}
                label="Categoría"
              >
                <MenuItem value="">Seleccionar Categoría</MenuItem>
                {Object.keys(niches).map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" disabled={!selectedCategory}>
              <InputLabel>Específico</InputLabel>
              <Select
                value={selectedSpecific}
                onChange={(e) => setSelectedSpecific(e.target.value)}
                label="Específico"
              >
                <MenuItem value="">Seleccionar Específico</MenuItem>
                {selectedCategory &&
                  niches[selectedCategory]?.map((spec) => (
                    <MenuItem key={spec} value={spec}>
                      {spec}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </>
        )}
        <Button
          variant="contained"        
          onClick={handleAddNiche}
          sx={{ mt: 2 }}
        >
          Agregar Nicho
        </Button>
      </Box>
      
      
      <Box className="delete-account">
        <Button
          className="delete-account-button"
          variant="contained"
          color="error"
          onClick={handleOpenDeleteDialog}
        >
          Borrar Cuenta
        </Button>
        <DeleteAccountDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteAccount}
        />
      </Box>
    </Box>
  ) : null;
};

export default Profile;