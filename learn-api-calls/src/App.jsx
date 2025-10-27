import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useEffect, useReducer } from "react";
import { ENDPOINTS } from "./endpoints";
import "@niner/react-libs/style.css";
import { Banner, Button } from "@niner/react-libs";
import EndpointSelect from "./EndpointSelect";
import UsersGrid from "./UserGrid";
import PostsList from "./PostsList";
import TodoList from "./TodoList";
import PhotosGrid from "./PhotosGrid";
import ResultLimitSelector from "./ResultLimitSelector";
import Navbar from "./Navbar";



const initialState = {
  endpointKey: ENDPOINTS[0].key,
  loading: false,
  error: null,
  data: null,
  refreshTick: 0, // bump this to force a refetch
  maxItems: 10,
};

function reducer(state, action) {
  switch (action.type) {
    case "SELECT_ENDPOINT":
      return { ...state, endpointKey: action.payload, error: null, data: null };
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "REFRESH":
      return { ...state, refreshTick: state.refreshTick + 1 };
    case "SET_MAX_ITEMS":
      return { ...state, maxItems: action.payload };
    default:
      return state;
  }
}

function normalizePhotos(photos) {
  return photos.map((p) => ({
    ...p,
    // swap unreliable placeholder host for a stable one
    thumbnailUrl: `https://picsum.photos/seed/${p.id}/150/150`,
    url: `https://picsum.photos/seed/${p.id}/800/600`,
  }));
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const current = ENDPOINTS.find((e) => e.key === state.endpointKey);

  useEffect(() => {
    if (!current) return;
    const ac = new AbortController();

    (async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const res = await fetch(current.url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // keep big endpoints manageable
        let payload = Array.isArray(json)
          ? json.slice(0, state.maxItems)
          : json;
        if (current.key === "photos" && Array.isArray(payload)) {
          payload = normalizePhotos(payload);
        }
        dispatch({ type: "FETCH_SUCCESS", payload });
      } catch (err) {
        if (err.name !== "AbortError") {
          dispatch({ type: "FETCH_ERROR", payload: err });
        }
      }
    })();

    return () => ac.abort();
  }, [current, state.refreshTick, state.maxItems]);
  return (
    <>
      <Banner text="Exploring API Calls with React" />

      <Navbar dispatch={dispatch} state={state}  />


      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => dispatch({ type: "REFRESH" })}>Refetch</button>
      </div>

      {state.loading && <p>Loading…</p>}
      {state.error && (
        <p style={{ color: "crimson" }}>
          Error: {String(state.error.message || state.error)}
        </p>
      )}

      {!state.loading && !state.error && state.data && renderContent()}

     
    </>
  );

  function renderContent() {
    switch (state.endpointKey) {
      case "users":
        return <UsersGrid users={state.data} />;
      case "posts":
        return <PostsList posts={state.data} />;
      case "todos":
        return <TodoList todos={state.data} />;
      case "photos":
        return <PhotosGrid photos={state.data} />;
      default:
        return (
          <pre style={{ background: "#111", color: "#eee", padding: "1rem" }}>
            {JSON.stringify(state.data, null, 2)}
          </pre>
        );
    }
  }
}

export default App;
