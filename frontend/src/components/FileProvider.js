import React, { Children, createContext, useContext, useState } from 'react';

const fileContext = createContext();

export const useFile = () => useContext(fileContext);

function FileProvider({ children }) {
  const [file, setFile] = useState(null);
  const [file_id, setFileId] = useState(null);

  
  return (
    <fileContext.Provider value={{ setFile, setFileId, file, file_id }}>
      {children}
    </fileContext.Provider>
  );
}

export default FileProvider;
