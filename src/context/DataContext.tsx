import {createContext} from "react";

let DataContext = createContext<{ employeesResource: any, toolsResource: any, vehiclesResource: any, taskUpdated: boolean}>({
    employeesResource: [],
    toolsResource: [],
    vehiclesResource: [],
    taskUpdated: false,
});

export let DataProvider = DataContext.Provider;
export default DataContext;
