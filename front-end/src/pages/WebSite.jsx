import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import NavBar from "../Componants/NavBar";
import { supabase } from "../supabase";

export default function WebSite() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();
  if (!window.localStorage.getItem("lang")) {
    window.localStorage.setItem("lang", "eng");
  }

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return (
    <div className="website">
      <NavBar />
      <div style={{ marginTop: "70px" }}>
        <Outlet />
      </div>
    </div>
  );
}
