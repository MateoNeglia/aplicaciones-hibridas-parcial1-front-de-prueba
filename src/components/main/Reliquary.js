import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import axios from 'axios';
import DeleteRelicDialog from '../common/DeleteRelicDialog'; 
import PLACEHOLDER_IMG from '../../assets/img/no-image.png';
import './AddRelic.scss';

const Reliquary = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reliquary, setReliquary] = useState([]);
  const [error, setError] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRelicId, setSelectedRelicId] = useState(null); 
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!hasFetched.current) {
      hasFetched.current = true;
      fetchRelicData();
    }
  }, [user, navigate]);

  const fetchRelicData = async () => {
    try {
      const sessionData = JSON.parse(sessionStorage.getItem('CURRENT_USER'));
      if (!sessionData?.refreshToken) {
        throw new Error('No access token found');
      }
      const response = await axios.get(`/api/relics/reliquary/${sessionData.userId}`, {
        headers: {
          Authorization: `Bearer ${sessionData.refreshToken}`,
        },
      });
      const data = response.data;
      setReliquary(data);
      console.log('Reliquary data:', data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching reliquary data');
      console.error('Error fetching relic data:', error);
    }
  };

  //logica de delete
  const handleOpenDeleteDialog = (relicId) => {
    setSelectedRelicId(relicId); 
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedRelicId(null); 
  };

  const handleDeleteRelic = async () => {
    try {
      const sessionData = JSON.parse(sessionStorage.getItem('CURRENT_USER'));
      if (!sessionData?.refreshToken) {
        setError('No access token found');
        return;
      }

      await axios.delete(`/api/relics/${selectedRelicId}`, {
        headers: { Authorization: `Bearer ${sessionData.refreshToken}` },
      });

      //refrescaelrelicario
      await fetchRelicData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete relic');
      console.error('Error deleting relic:', error);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  return (
    <div className="">
      <h2>Relicario de {user?.username || 'Usuario'}</h2>
      {error && <p className="error">{error}</p>}
      <div>
        {reliquary.length > 0 ? (
          reliquary.map((niche) => (
            <div key={niche._id} className="niche-section">
              <h3>
                {niche.niche.category}: {niche.niche.specific}
              </h3>
              {niche.relics.length > 0 ? (
                <Card
                  className="relics-container"
                  style={{
                    padding: '20px',
                    marginBottom: '20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  {niche.relics.map((relic) => {
                    return (
                      <div
                        key={relic._id}
                        className="relic-card"
                        style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width: '300px' }}
                      >
                        {relic ? (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div className="relic-image">
                                <img
                                  src={relic.picture ? relic.picture : PLACEHOLDER_IMG}
                                  alt={relic.name}
                                  width={100}
                                />
                              </div>
                              <div className="relic-info">
                                <h4>{relic.name}</h4>
                                <p>{relic.description || 'No description available'}</p>
                                <ul>
                                  <li>Condición: {relic.condition || 'Unknown'}</li>
                                  <li>Set: {relic.set || 'Unknown'}</li>
                                  <li>Año: {relic.year || 'Unknown'}</li>
                                  <li>Me Gusta: {relic.likes.length || '0'}</li>                                  
                                </ul>
                                <button
                                  className="add-relic-button"
                                  onClick={() => handleOpenDeleteDialog(relic._id)} 
                                  style={{ marginRight: '10px' }}
                                >
                                  Borrar
                                </button>
                                <button
                                  className="add-relic-button"
                                  onClick={() => navigate(`/relic/update/${relic._id}`)}
                                >
                                  Editar
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <p>Cargando detalles de la reliquia...</p>
                        )}
                      </div>
                    );
                  })}
                </Card>
              ) : (
                <p>No se encontraron reliquias en este nicho.</p>
              )}
            </div>
          ))
        ) : (
          <p>No niches found in your reliquary.</p>
        )}
        <button className="add-relic-button" onClick={() => navigate('/profile')}>
          VOLVER
        </button>
      </div>
      <DeleteRelicDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteRelic}
      />
    </div>
  );
};

export default Reliquary;