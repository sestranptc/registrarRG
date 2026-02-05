import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (usuario: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já está logado ao carregar (persistência simples)
    const storedAuth = localStorage.getItem('admin_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    // Criar usuário desenvolvedor se não existir
    const verificarCriarUsuarioDev = async () => {
      try {
        const q = query(collection(db, 'usuarios'), where('usuario', '==', 'desenvolvedor'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          await addDoc(collection(db, 'usuarios'), {
            usuario: 'desenvolvedor',
            senha: 'pmp159357', // Em produção, usar hash!
            role: 'admin',
            criadoEm: new Date()
          });
          console.log('Usuário desenvolvedor criado com sucesso');
        }
      } catch (error) {
        console.error('Erro ao verificar/criar usuário dev:', error);
      }
    };
    
    verificarCriarUsuarioDev();
  }, []);

  const login = async (usuario: string, senha: string) => {
    try {
      // Verificar credenciais no Firestore
      const q = query(
        collection(db, 'usuarios'), 
        where('usuario', '==', usuario),
        where('senha', '==', senha)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth', 'true');
        return true;
      }
      
      // Fallback para admin local (opcional, mantendo para segurança se DB falhar ou para migração)
      if (usuario === 'admin' && senha === 'admin123') {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth', 'true');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
