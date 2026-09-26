import { createBrowserRouter } from "react-router";
import ProjectsPage from "./pages/ProjectPage";
import PersonasPage from "./pages/PersonaPage";
import App from "./App";
import ReposPage from "./pages/ReposPage";
import PersonaMessagesPage from "./pages/PersonaMessagesPage";

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
      {
        path: "personas/messages/:pid",
        Component: PersonaMessagesPage,
      },
      {
        path: "repos",
        Component: ReposPage,
      },
    ],
  },
]);

export default router;
