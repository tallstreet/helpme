import "./App.css";
import emergencyNumbers from "./emergencyNumbers.json";
import { useCallback, useEffect, useState } from "react";

function App() {
  const [words, setWords] = useState(undefined);
  const [emergencyNumber, setEmergencyNumber] = useState(undefined);
  const [helpNumber, setHelpNumber] = useState(undefined);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          window.what3words.api
            .convertTo3wa({ lat: latitude, lng: longitude }, "en")
            .then((response) => {
              setWords(response.words);
              setEmergencyNumber(emergencyNumbers[response.country]);
              if (window.localStorage) {
                window.localStorage.setItem("country", response.country);
              }
            });
        }
      );
    }
  }, []);

  useEffect(() => {
    if (window.localStorage) {
      setHelpNumber(window.localStorage.getItem("helpNumber"));
      setEmergencyNumber(
        emergencyNumbers[window.localStorage.getItem("country")]
      );
    }
  }, []);

  const onSubmit = useCallback(
    (e) => {
      const form = new FormData(e.target);
      if (window.localStorage) {
        window.localStorage.setItem("helpNumber", form.get("number"));
      }
      setHelpNumber(form.get("number"));
      e.preventDefault();
    },
    [setHelpNumber]
  );

  return (
    <div className="App">
      <header className="App-header">
        {helpNumber && (
          <a className="button" href={`tel:${helpNumber}`}>
            Call For Help
          </a>
        )}

        {!helpNumber && (
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="number"
              placeholder="Enter number of friend"
            />
            <button type="submit">Save</button>
          </form>
        )}

        {words && (
          <div className="location">
            <div className="w3wLogo">
              <img alt="What3Words Location" src="w3w_logo.svg" />
            </div>
            <div>: {words}</div>
          </div>
        )}

        {emergencyNumber && (
          <a className="emergency_button" href={`tel:${emergencyNumber}`}>
            Call Emergency Services
          </a>
        )}
      </header>
    </div>
  );
}

export default App;
