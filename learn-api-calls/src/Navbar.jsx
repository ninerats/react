// Navbar.jsx
import { ENDPOINTS } from "./endpoints";
import EndpointSelect from "./EndpointSelect";
import ResultLimitSelector from "./ResultLimitSelector";


export default function Navbar({ state, dispatch }) {
  return (
    <nav className="navbar navbar-dark bg-dark mb-3">
      <div className="container-fluid">
        <span className="navbar-brand">React API Demo</span>

        <div className="d-flex align-items-center gap-3">
          <EndpointSelect
            options={ENDPOINTS}
            value={state.endpointKey}
            onChange={(key) =>
              dispatch({ type: "SELECT_ENDPOINT", payload: key })
            }
          />

          <ResultLimitSelector
            onChange={(value) =>
              dispatch({ type: "SET_MAX_ITEMS", payload: value })
            }
            value={state.maxItems}
          />
        </div>
      </div>
    </nav>
  );
}
