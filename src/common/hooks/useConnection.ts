import { useContext } from "react";
import {
  ConnectionContext,
  EMPTY,
} from "common/context/ConnectionContext";


// this hook could go away and view uses useContext(ConnectionContext)
export function useConnection() {
  const context = useContext(ConnectionContext);
  if (context === EMPTY) {
    throw new Error(`UseConnection must be used within a Connection Provider.`);
  }
  // returns [state,{connect,disconnect, get, set}]
  return context
}
