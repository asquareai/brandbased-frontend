import React from 'react';

const Maintenance = () => {
  const styles = {
    container: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' },
    heading: { fontSize: '2.5rem', color: '#333' },
    text: { fontSize: '1.2rem', color: '#666' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>BrandBased is Coming Soon</h1>
      <p style={styles.text}>Our team in Chennai & Sydney is working hard to bring you something amazing.</p>
      <p style={styles.text}>Stay tuned!</p>
    </div>
  );
};

export default Maintenance;