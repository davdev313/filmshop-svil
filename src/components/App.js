import React, { createContext } from "react";

import '../assets/css/style.css';
import Home from "./Home";

function App() {
    return (
        // <AppContext.Provider value={11}>  
        /* wrappando un component all'interno di Entity.Provider, tutti i cmp figli di quel cmp avranno accesso al context 
            in value dobbiamo mettere il valore che vogliamo passare
        */
        < Home />
        // </AppContext.Provider>
    )
}

export default App;
export const AppContext = createContext(0); // aggiungere un valore di default al creteContex(val) che può essere un qualsiasi tipo