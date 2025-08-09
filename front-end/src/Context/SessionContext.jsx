import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import { sessionSaver } from "./CreateContexts";
import LangContext from "./LangContext";
function SessionContext() {
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);
  if (session === undefined) return <div>Loading...</div>;
  const sessionProvider = { session };
  return (
    <sessionSaver.Provider value={sessionProvider}>
      <LangContext />
    </sessionSaver.Provider>
  );
}

export default SessionContext;
