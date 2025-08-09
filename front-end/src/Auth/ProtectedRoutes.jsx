import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../supabase";

const ProtectedRoute = ({ children }) => {
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

  if (!session) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
