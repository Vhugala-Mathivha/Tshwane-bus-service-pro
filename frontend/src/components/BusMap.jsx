import React from 'react';
import { useNavigate } from 'react-router-dom';

function BusMap() {
  const navigate = useNavigate();
  
  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#14602f' }}>Find Bus Stations</h1>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '10px 20px',
              background: '#14602f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>
        
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#14602f', marginBottom: '20px' }}>Tshwane Bus Station Map</h2>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
            Interactive map coming soon. For now, here are the main bus stations:
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            textAlign: 'left'
          }}>
            {[
              'Pretoria Station',
              'Hatfield',
              'Centurion',
              'Menlyn',
              'Brooklyn',
              'Sunnyside',
              'Arcadia',
              'Mamelodi',
              'Atteridgeville',
              'Soshanguve'
            ].map((station, index) => (
              <div 
                key={index}
                style={{
                  padding: '15px',
                  background: '#f9f9f9',
                  borderLeft: '4px solid #14602f',
                  borderRadius: '4px'
                }}
              >
                <strong>{station}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusMap