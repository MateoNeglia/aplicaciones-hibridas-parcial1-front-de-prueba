import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import axios from 'axios';
import RelicForm from '../common/RelicForm.js';
import './AddRelic.scss';

const AddRelicPage = () => {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('');

  const handleSubmit = async ({ formData }) => {
    try {
      const sessionData = JSON.parse(sessionStorage.getItem('CURRENT_USER'));
      if (!sessionData?.refreshToken) {
        throw new Error('No se encontró el token de acceso');
      }
      console.log('relicData', formData );

      const headers = {
        Authorization: `Bearer ${sessionData.refreshToken}`,
      };     
        
        const relicData = {
          name: formData.name,
          description: formData.description || undefined,
          niche: {
            category: formData.nicheCategory,
            specific: formData.nicheSpecific,
          },
          year: formData.year || undefined,
          condition: formData.condition,
          set: formData.set || undefined,
          picture: formData.picture || undefined, 
        };

        await axios.post('/api/relics/add', relicData, {
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
        });
      

      window.location.href = '/profile';
    } catch (err) {
      setError(err.response?.data?.message || 'Error al añadir la reliquia');
    }
  };

  return (
    <RelicForm
      user={user}
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
      submitButtonText="Añadir"
      title="Agrega una nueva Reliquia"
    />
  );
};

export default AddRelicPage;