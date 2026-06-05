import { createBrowserRouter } from "react-router";
import ProjectsPage from "./pages/ProjectPage";
import PersonasPage from "./pages/PersonaPage";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: ProjectsPage,
      },
      {
        path: "personas",
        Component: PersonasPage,
      },
    ],
  },
]);

export default router;
