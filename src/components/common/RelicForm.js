import { useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Alert,
} from '@mui/material';

const RelicForm = ({
  user,
  initialData = {
    name: '',
    description: '',
    nicheCategory: '',
    nicheSpecific: '',
    year: '',
    condition: '',
    set: '',
    picture: '',
  },
  onSubmit,
  error,
  setError,
  submitButtonText = 'Añadir',
  title = 'Agrega una nueva Reliquia',
}) => {
  const [formData, setFormData] = useState(initialData);
  const [isFileUpload, setIsFileUpload] = useState(!initialData.picture);
  const [pictureFile, setPictureFile] = useState("");

  const conditionOptions = [
    'Perfecto Estado',
    'Casi Perfecto Estado',
    'Ligeramente Usado',
    'Moderadamente Usado',
    'Muy Usado',
    'Desgastado',
    'Dañado',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleFileChange = (e) => {
    const file = e.target.files[0];
    //console.log('file', file);
    if (file && ['image/png', 'image/jpeg'].includes(file.type)) {
      setPictureFile(file.name);
      setError('');
    } else {
      setPictureFile(null);
      setError('Por favor selecciona un archivo de imagen válido (PNG o JPEG)');
    }
  };
  const handleToggle = (e) => {
    setIsFileUpload(e.target.checked);
    setFormData({ ...formData, picture: '' });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.nicheCategory || !formData.nicheSpecific || !formData.condition) {
      setError('Nombre, nicho y condición son obligatorios');
      return false;
    }
    if (!isFileUpload && formData.picture && !/^https?:\/\/.+\.(jpg|jpeg|png)$/.test(formData.picture)) {
      setError('Por favor ingresa una URL de imagen válida (jpg, jpeg o png)');
      return false;
    }
    return true;
  };

const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit({ formData });
  };

  return (
    <Box className="add-relic-container" sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!user?.niches?.length && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Por favor agrega nichos en tu perfil primero.
        </Alert>
      )}
      <form onSubmit={handleFormSubmit}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth margin="normal" disabled={!user?.niches?.length}>
          <InputLabel>Categoría del Nicho *</InputLabel>
          <Select
            name="nicheCategory"
            value={formData.nicheCategory}
            onChange={(e) => {
              setFormData({
                ...formData,
                nicheCategory: e.target.value,
                nicheSpecific: '',
              });
            }}
            required
            label="Categoría del Nicho *"
          >
            <MenuItem value="">Selecciona Categoría</MenuItem>
            {[...new Set(user?.niches?.map((niche) => niche.category) || [])].map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" disabled={!formData.nicheCategory}>
          <InputLabel>Nicho Específico *</InputLabel>
          <Select
            name="nicheSpecific"
            value={formData.nicheSpecific}
            onChange={handleChange}
            required
            label="Nicho Específico *"
          >
            <MenuItem value="">Selecciona Específico</MenuItem>
            {user?.niches
              ?.filter((niche) => niche.category === formData.nicheCategory)
              .map((niche) => (
                <MenuItem key={`${niche.category}-${niche.specific}`} value={niche.specific}>
                  {niche.specific}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Año"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="e.g., 1995"
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Condición *</InputLabel>
          <Select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            label="Condición *"
          >
            <MenuItem value="">Selecciona Condición</MenuItem>
            {conditionOptions.map((condition) => (
              <MenuItem key={condition} value={condition}>
                {condition}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Set"
            name="set"
            value={formData.set}
            onChange={handleChange}
            placeholder="e.g., First Edition"
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <FormControlLabel
            control={<Switch checked={isFileUpload} onChange={handleToggle} />}
            label={isFileUpload ? 'Subir Archivo de Imagen' : 'Ingresar URL de Imagen'}
          />
          {isFileUpload ? (
            <input
              type="file"
              accept="image/png,image/jpeg"
              value={formData.picture}
              onChange={handleFileChange}
              style={{ marginTop: '16px' }}
            />
          ) : (
            <TextField
              label="Imagen"
              name="picture"
              value={formData.picture}
              onChange={handleChange}
              placeholder="URL de la imagen"
              variant="outlined"
              sx={{ mt: 2 }}
            />
          )}
        </FormControl>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!user?.niches?.length}
          >
            {submitButtonText}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => (window.location.href = '/profile')}
          >
            Cancelar
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default RelicForm;