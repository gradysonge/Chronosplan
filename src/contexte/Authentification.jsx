import React, { createContext, useState, useContext } from 'react';

export const ContexteAuth = createContext();

export const AuthProvider = ({ children }) => {
  const [estAuthentifie, setEstAuthentifie] = useState(false);

  return (
    <ContexteAuth.Provider value={{ estAuthentifie, setEstAuthentifie }}>
      {children}
    </ContexteAuth.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(ContexteAuth);
};