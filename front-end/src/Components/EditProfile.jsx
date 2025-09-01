import { useState, useContext, useEffect } from "react";
import { supabase } from "../supabase";
import { langChanger, sessionSaver } from "../Context/CreateContexts";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const { userId, profile } = useContext(sessionSaver);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [teamid, setTeamid] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [team_title, setTeamTitle] = useState("");
  const [active, setActive] = useState("join");
  const [lang, setLang] = useState({});
  const { text } = useContext(langChanger);
  useEffect(() => {
    setLang(text);
  }, [text]);
  useEffect(() => {
    document.title = lang.editProfile;
  }, [lang]);
  function sanitizeFileName(name) {
    return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  }
  async function uploadAvatar(file) {
    if (images.length > 0) {
      const uploadedUrls = [];
      for (const file of images) {
        const safeFileName = sanitizeFileName(file.name);
        const filePath = `uploads/${Date.now()}_${safeFileName}`;

        const safeFile = new File([file], safeFileName, {
          type: file.type,
          lastModified: file.lastModified,
        });

        const { data: filep, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, safeFile);

        if (uploadError) {
          console.error("خطأ في الرفع:", uploadError);
          continue;
        }
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }
      const { error: updateError } = await supabase
        .from("profiles ")
        .update({ avatar_url: uploadedUrls[0] })
        .eq("id", userId);

      if (updateError) {
        console.error("خطأ في تحديث الروابط:", updateError);
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (images.length > 0) {
      const uploadedUrl = await uploadAvatar(images[0]);
      if (uploadedUrl) avatarUrl = uploadedUrl;
    }

    const { error } = await supabase
      .from("profiles ")
      .update({ full_name: fullName })
      .eq("id", userId);

    setLoading(false);

    if (error) {
      console.error("خطأ في تحديث البروفايل:", error);
    } else {
      window.location.pathname = "/profile";
    }
  }
  return (
    <div className="signup container">
      <form
        className="card-bg"
        onSubmit={handleSubmit}
        style={{ marginTop: "100px", flexDirection: "column", display: "flex" }}
      >
        <label>{lang.name}:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label>{lang.avatar}:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files))}
        />

        <button type="submit" disabled={loading}>
          {loading ? lang.updating : lang.update}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
