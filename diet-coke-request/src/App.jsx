import "./App.css";
import { useReducer } from "react";
import { initialState, appReducer } from "./state.js";
import ToggleSwitch from "./components/ToggleSwitch.jsx";
import { sendNtfy } from "./services/ntfy.js";
import { triggerIFTTT } from "./services/ifttt.js";
import StatusPanel from "./components/StatusPanel.jsx";
import DietCokeButton from "./components/DietCokeButton.jsx";

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const requestDietCoke = async () => {
    const calls = [];
    if (state.useNtfy) {
      dispatch({ type: "SET_MESSAGE", payload: "Calling Ntfy..." });
      calls.push(
        sendNtfy({
         
          tags: ["rotating_light"],
          // topic defaults to VITE_NTFY_TOPIC
        })
      );
    }
    if (state.useIfttt) {
      dispatch({ type: "SET_MESSAGE", payload: "Calling IFTTT..." });
      calls.push(
        triggerIFTTT({
          // event/key default from env
          // json: { value1: "Diet Coke" },
        })
      );
    }

    if (calls.length === 0) {
      dispatch({
        type: "SET_MESSAGE",
        payload: "Enable at least one service (ntfy or IFTTT) to send.",
      });
      return;
    }

    try {
      // DEBUG: Log what we're in calls
      console.log(
        "Making parallel calls to:",
        calls.map((c) => c.url || c)
      );

      // Wrap each fetch with detailed logging
      const debugCalls = calls.map((promise, i) => {
        return promise
          .then((res) => {
            console.log(
              `Call ${i} WON with status:`,
              res.status,
              res.ok ? "OK" : "NOT OK"
            );
            return res;
          })
          .catch((err) => {
            console.log(`Call ${i} FAILED:`, err.message || err);
            return Promise.reject(err); // re-throw
          });
      });

      const any = Promise.any
        ? Promise.any(debugCalls)
        : Promise.race(debugCalls);
      const res = await any;

      if (!res.ok) {
        console.log(
          "Winning response was NOT ok:",
          res.status,
          await res.text().catch(() => "(no body)")
        );
        throw new Error("No service responded OK");
      }

      console.log("SUCCESS! Winning response:", res.status);
      // appendMsg("Request sent ❤️");
    } catch (err) {
      console.error("ALL FAILED or bad status. Final error:", err);

      // Extra: If using Promise.race fallback, show *why* others failed
      if (!Promise.any) {
        console.warn(
          "Using Promise.race fallback — first rejection may have won"
        );
      }

    }
  };

  return (
    <div className="app-container galaxy-s23-container">
      <div>
        <DietCokeButton onClick={() => requestDietCoke()} />
        <span>
          <button
            onClick={() => dispatch({ type: "SET_MESSAGE", payload: "" })}
          >
            Clear Messages
          </button>
        </span>
      </div>

      <div className="controls">
        <ToggleSwitch
          id="toggle-ntfy"
          label="Use ntfy"
          checked={state.useNtfy}
          onChange={(val) => dispatch({ type: "TOGGLE_NTFY", payload: val })}
        />
        <ToggleSwitch
          id="toggle-ifttt"
          label="Use IFTTT"
          checked={state.useIfttt}
          onChange={(val) => dispatch({ type: "TOGGLE_IFTTT", payload: val })}
        />
      </div>
      <StatusPanel message={state.message} />
    </div>
  );
}
