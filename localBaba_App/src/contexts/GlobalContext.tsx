import React, {createContext, useState, useContext, FC} from 'react';

export interface GlobalContextData {
  isLogin: boolean;
  setLogin: (text: boolean) => void;
}

const GlobalContext = createContext<GlobalContextData>({} as GlobalContextData);

const GlobalProvider: FC<any> = ({children}) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const setLogin = (text: boolean) => {
    setIsLogin(text);
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogin,
        setLogin,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

function useGlobal(): GlobalContextData {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error('useGlobal must be used within an GlobalContext');
  }

  return context;
}

export {GlobalContext, GlobalProvider, useGlobal};
