import './App.css';
import AppRoutes from "./app/routes.tsx";

function App() {
  return (
          // ToDo Make actual header and footer
          <div style={{paddingTop: "4rem", paddingBottom: "4rem"}}>
            <header style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              backgroundColor: "#fde70e",
              color: "black",
              textAlign: "center",
              zIndex: 1000,
              height: "4rem",
              display: "flex",
              alignItems: "left",
              padding: "0 1rem" // Padding hinzugefügt
            }}>
              <img
                      src="https://www.fhnw.ch/logo/fhnw-logo-de.svg"
                      alt="FHNW Logo"
                      style={{
                        position: "absolute",
                        top: "0.5rem",
                        left: "1rem",
                        height: "3rem"
                      }}
              />
            </header>

            <main style={{
              minHeight: "100vh",
              paddingTop: "4rem", // Platz für den Header
              paddingBottom: "4rem" // Platz für den Footer
            }}>
              <AppRoutes/>
            </main>

            <footer style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
              backgroundColor: "#fde70e",
              color: "black",
              textAlign: "center",
              zIndex: 1000,
              height: "4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 1rem" // Padding hinzugefügt
            }}>
              <p>© 2025 FHNW Project</p>
            </footer>
          </div>
  );
}

export default App;