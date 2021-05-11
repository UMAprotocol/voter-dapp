import Router from "features/router";
import { QueryClient } from "react-query";

interface Props {
  queryClient: QueryClient;
}

function App(props: Props) {
  return (
    <div className="App">
      <Router qc={props.queryClient} />
    </div>
  );
}

export default App;
