import axios from "axios";
import { base_url } from "./Api";
import { supabase } from "../supabase";
let token;
const createBoard = async () => {
  const { data } = await supabase.auth.getSession();
  token = data.session?.access_token;
};
createBoard();
export const axioss = axios.create({
  baseURL: base_url,
  headers: {
    apikey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bndwdXZ0dmd4YmRxdWFrZmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2ODg3MTgsImV4cCI6MjA2OTI2NDcxOH0.eyA44rIM4eUTWy4VI8zRhY2JhkxaBbEBvh8XfeRg8WA",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
