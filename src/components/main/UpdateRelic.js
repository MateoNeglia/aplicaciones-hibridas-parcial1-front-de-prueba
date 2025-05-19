import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RelicForm from '../common/RelicForm.js';

const UpdateRelicPage = () => {
  const { user } = useContext(AuthContext);
  const { relicId } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRelicData = async () => {
      try {        
        const sessionData = JSON.parse(sessionStorage.getItem('CURRENT_USER'));
        if (!sessionData?.refreshToken) {
          throw new Error('No se encontró el token de acceso');
        }
        const response = await axios.get(`/api/relics/${relicId}`, {
          headers: {
            Authorization: `Bearer ${sessionData.refreshToken}`,
          },
        });
        const relic = response.data;
        console.log('Fetched relic data:', relic);
        setInitialData({
          name: relic.name || '',
          description: relic.description || '',
          nicheCategory: relic.niche?.category || '',
          nicheSpecific: relic.niche?.specific || '',
          year: relic.year?.toString() || '',
          condition: relic.condition || '',
          set: relic.set || '',
          picture: relic.picture || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar los datos de la reliquia');
      }
    };
    fetchRelicData();
  }, [relicId]);

  const handleSubmit = async ({formData}) => {
    try {
      const sessionData = JSON.parse(sessionStorage.getItem('CURRENT_USER'));
      if (!sessionData?.refreshToken) {
        throw new Error('No se encontró el token de acceso');
      }
      console.log('Submitting relic data FORM:', formData);
      const headers = {
        Authorization: `Bearer ${sessionData.refreshToken}`,
        'Content-Type': 'application/json',
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
      console.log('Submitting relic data:', relicData);
      await axios.put(`/api/relics/${relicId}`, relicData, { headers });

      window.location.href = '/profile';
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar la reliquia');
    }
  };

  if (!initialData) {
    return <div>Cargando...</div>;
  }

  return (
    <RelicForm
      user={user}
      initialData={initialData}
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
      submitButtonText="Actualizar"
      title="Editar Reliquia"
    />
  );
};

export default UpdateRelicPage;