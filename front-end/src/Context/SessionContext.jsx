import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { sessionSaver } from "./CreateContexts";
import LangContext from "./LangContext";
import Loading from "../Components/Loading";

function SessionContext() {
  const [session, setSession] = useState(undefined);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState({ full_name: "", avatar_url: "" });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);

        const { data, error } = await supabase
          .from("profiles ")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          // console.error( error);
        }

        if (!data) {
          const { error: insertError } = await supabase
            .from("profiles ")
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || "",
              avatar_url: user.user_metadata?.avatar_url || "",
              team_id: user.user_metadata?.team_id || "",
            });

          if (insertError) {
            // console.error( insertError);
          }

          setProfile({
            full_name: user.user_metadata?.full_name || "",
            avatar_url: user.user_metadata?.avatar_url || "",
            team_id: user.user_metadata?.team_id || "",
          });
        } else {
          setProfile(data);
        }
      }

      setLoading(false);
    }

    fetchProfile();
  }, []);

  const sessionProvider = { session, userId, profile };

  return (
    <sessionSaver.Provider value={sessionProvider}>
      {loading ? <Loading /> : <LangContext />}
    </sessionSaver.Provider>
  );
}

export default SessionContext;
