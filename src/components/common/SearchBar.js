import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Modal,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@mui/material'; 
import './SearchBar.scss';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    specific: '',
    condition: '',
  });
  const [niches, setNiches] = useState({});
  const [nicheError, setNicheError] = useState('');
  const [conditions] = useState([
    'Perfecto Estado',
    'Casi Perfecto Estado',
    'Ligeramente Usado',
    'Moderadamente Usado',
    'Muy Usado',
    'Desgastado',
    'Dañado',
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);
  //el sort
  const [sort, setSort] = useState({ sortBy: 'createdAt', order: 'desc' });
  const [openSortModal, setOpenSortModal] = useState(false);
  const [tempSort, setTempSort] = useState({ sortBy: 'createdAt', order: 'desc' });

//campos del sort
const sortOptions = [
  { value: 'createdAt', label: 'Recently Created' },
  { value: 'updatedAt', label: 'Recently Updated' },
  { value: 'likes', label: 'Most Likes' },
  { value: 'ownerName', label: "Owner's Name" },
  { value: 'year', label: 'Year' },
  { value: 'set', label: 'Set' },
  { value: 'condition', label: 'Condition' },
  { value: 'name', label: 'Name' },
];

const orderOptions = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];


  useEffect(() => {
    const fetchNiches = async () => {
      try {
        const response = await axios.get('/api/niche/niches');
        console.log('Niches fetched:', response.data);
        if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          setNiches(response.data);
        } else {
          console.error('SearchBar: Expected object, got:', response.data);
          setNicheError('Invalid niches data received');
        }
      } catch (err) {
        console.error('SearchBar: Failed to fetch niches=', err.response?.data || err.message);
        setNicheError('Failed to load filter options');
      }
    };
    fetchNiches();
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { specific: '' } : {}),
    }));
  };

const handleSubmit = (e) => {
  e.preventDefault();
  if (query.trim() || filters.category || filters.specific || filters.condition || sort.sortBy) {
    onSearch({ query, filters, sort });
  }
};

  const handleOpenModal = () => {
    setTempFilters(filters); 
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters); 
    setOpenModal(false);
    
    onSearch({ query, filters: tempFilters, sort });
  };

//handlers del sort
const handleSortByChange = (e) => {
  setTempSort((prev) => ({ ...prev, sortBy: e.target.value }));
};

const handleOrderChange = (e) => {
  setTempSort((prev) => ({ ...prev, order: e.target.value }));
};

const handleOpenSortModal = () => {
  setTempSort(sort);
  setOpenSortModal(true);
};

const handleCloseSortModal = () => {
  setOpenSortModal(false);
};

const handleApplySort = () => {
  setSort(tempSort);
  setOpenSortModal(false);
  onSearch({ query, filters, sort: tempSort });
};



  return (
<form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Busca Coleccionables..."
        className="search-input"
      />
      {nicheError && <div className="niche-error">{nicheError}</div>}
      <button type="submit" className="search-button">
        <svg
          className="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
      <Button variant="outlined" className="filter-button" onClick={handleOpenModal} sx={{ ml: 1 }}>
        Filtros
      </Button>
      <Button variant="outlined" className="filter-button" onClick={handleOpenSortModal} sx={{ ml: 1 }}>
        Ordenar
      </Button>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="filter-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 300,
            maxWidth: 500,
          }}
        >
          <Typography id="filter-modal-title" variant="h6" gutterBottom>
            Aplicar Filtros
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoría</InputLabel>
            <Select
              name="category"
              value={tempFilters.category}
              onChange={handleFilterChange}
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
          <FormControl fullWidth margin="normal" disabled={!tempFilters.category}>
            <InputLabel>Específico</InputLabel>
            <Select
              name="specific"
              value={tempFilters.specific}
              onChange={handleFilterChange}
              label="Específico"
            >
              <MenuItem value="">All Specifics</MenuItem>
              {tempFilters.category &&
                niches[tempFilters.category]?.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Condición</InputLabel>
            <Select
              name="condition"
              value={tempFilters.condition}
              onChange={handleFilterChange}
              label="Condición"
            >
              <MenuItem value="">All Conditions</MenuItem>
              {conditions.map((cond) => (
                <MenuItem key={cond} value={cond}>
                  {cond}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleApplyFilters}>
              Aplicar
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openSortModal}
        onClose={handleCloseSortModal}
        aria-labelledby="sort-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 300,
            maxWidth: 500,
          }}
        >
          <Typography id="sort-modal-title" variant="h6" gutterBottom>
            Ordenar Resultados
          </Typography>
          <FormControl component="fieldset">
            <FormLabel component="legend">Ordenar por</FormLabel>
            <RadioGroup
              name="sortBy"
              value={tempSort.sortBy}
              onChange={handleSortByChange}
            >
              {sortOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Orden</FormLabel>
            <RadioGroup
              name="order"
              value={tempSort.order}
              onChange={handleOrderChange}
            >
              {orderOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleCloseSortModal}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleApplySort}>
              Aplicar
            </Button>
          </Box>
        </Box>
      </Modal>
    </form>
  );
};

export default SearchBar;