import { Provider } from "react-redux";
import { store } from "./store";
import StuffList from "./components/StuffList";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <StuffList />
      </div>
    </Provider>
  );
}

export default App;
