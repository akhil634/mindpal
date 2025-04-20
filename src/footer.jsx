import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'rgba(218, 165, 165, 0.8)',
        color: '#ecf0f1',
        padding: '2rem 1rem',
        fontFamily: 'Arial, sans-serif',
        borderTop: '4px solid rgb(2, 63, 104)',
        textAlign: 'center',
        width: '209vh', // Ensure full width
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Company Name */}
        <h3 style={{ marginBottom: '1rem', color: 'rgb(2, 63, 104)' }}>MINDPAL</h3>
        <p style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>
          © {currentYear} Mindpal. All rights reserved.
        </p>

        {/* Contact Info */}
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>
            Email: mindpalsupport@gmail.com
          </p>
          <p style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>
            Phone: (91) 8075 290 893
          </p>
          <div style={{ marginTop: '1rem' }}>
            <a href="mailto:support@yourcompany.com" style={linkStyle}>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Styles
const linkStyle = {
  color: 'rgb(2, 63, 104)',
  textDecoration: 'none',
  fontSize: '0.9rem',
  transition: 'color 0.3s ease',
};

export default Footer;