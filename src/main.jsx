import {createRoot} from "react-dom/client";
import App from "./App";
import "./assets/css/app.css";
import {BrowserRouter} from "react-router-dom";
import {RecoilRoot} from "recoil";
import {SnackbarProvider} from "notistack";
import { SkeletonTheme } from 'react-loading-skeleton';

const container = document.getElementById("root");


const root = createRoot(container);
root.render(
    <SnackbarProvider>
        <RecoilRoot>
            <SkeletonTheme   baseColor="#D7D7D7"
                             highlightColor="#FFFFFF"
                             borderRadius="0.5rem"
                             duration={4}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
            </SkeletonTheme>
        </RecoilRoot>
    </SnackbarProvider>
);
