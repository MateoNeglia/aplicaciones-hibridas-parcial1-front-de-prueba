import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../../components/common/NavBar.js';
import PLACEHOLDER_IMG from '../../assets/img/no-image.png';
import axios from 'axios';
import './MainLayout.scss';

const MainLayout = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchError, setSearchError] = useState('');
  const [currentFilters, setCurrentFilters] = useState({});


  //el handle del buscador, esta es la función más importante
const handleSearch = async ({ query, filters, sort }) => {
  try {
    const page = filters.page || 1;
    console.log('MainLayout: Searching for:', { query, filters, sort, page });
    const CURRENT_USER = JSON.parse(sessionStorage.getItem('CURRENT_USER'));
    console.log('MainLayout: Current user=', CURRENT_USER.refreshToken);
    const response = await axios.get('/api/relics', {
      params: {
        name: query || undefined,
        page: page,
        limit: 6,
        category: filters.category || undefined,
        specific: filters.specific || undefined,
        condition: filters.condition || undefined,
        sortBy: sort.sortBy || undefined,
        order: sort.order || undefined,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CURRENT_USER.refreshToken}`,
      },
    });
    console.log('MainLayout: Search results=', response.data);
    setSearchResults(response.data.relics);
    setPagination(response.data.pagination);
    setCurrentFilters({ query, filters: { ...filters, page }, sort });
    setSearchError('');
  } catch (err) {
    console.error('MainLayout: Search error=', err.response?.data || err.message);
    setSearchResults([]);
    setPagination({});
    setCurrentFilters({});
    setSearchError(err.response?.data?.message || 'Failed to fetch search results');
  }
};

  return (
    <div className="main-layout">
      <NavBar onSearch={(query, filters, sort) => handleSearch(query, filters, sort)} />
      <div className="main-content">
        {searchResults.length > 0 && (
          <div className="search-results">
            <h2>Resultados de la Búsqueda</h2>
            <ul>
              {searchResults.map((relic) => (
                <li key={relic._id} className="search-result-item">
                  <img
                    src={relic.picture || PLACEHOLDER_IMG}
                    alt={relic.name}
                    className="relic-image"
                  />
                  <span>{relic.name}</span>
                  <span>
                    {relic.niche.category}: {relic.niche.specific}
                  </span>
                  <span>{relic.condition}</span>
                  <span>By: {relic.owner.username}</span>
                </li>
              ))}
            </ul>
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={pagination.page === 1}
                  onClick={() =>
                    handleSearch({
                      query: currentFilters.query,
                      filters: { ...currentFilters.filters, page: currentFilters.filters.page - 1 },
                      sort: currentFilters.sort,
                    })
                  }
                >
                  Previous
                </button>
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() =>
                    handleSearch({
                      query: currentFilters.query,
                      filters: { ...currentFilters.filters, page: currentFilters.filters.page + 1 },
                      sort: currentFilters.sort,
                    })
                  }
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
        {searchError && <div className="search-error">{searchError}</div>}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;