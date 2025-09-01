import { useState, useContext, useEffect } from "react";
import { supabase } from "../supabase";
import { langChanger, sessionSaver } from "../Context/CreateContexts";

function EditProfile() {
  const { userId, profile } = useContext(sessionSaver);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
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
          // console.error( uploadError);
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
        // console.error( updateError);
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
      // console.error( error);
    } else {
      window.location.pathname = "/profile";
    }
  }
  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0, // = top:0,right:0,bottom:0,left:0
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(2px)",
          }}
        ></div>
      )}
      <div className="signup container">
        <form
          className="card-bg"
          onSubmit={handleSubmit}
          style={{
            marginTop: "100px",
            flexDirection: "column",
            display: "flex",
          }}
        >
          <label>{lang.name}:</label>
          <input
            type="text"
            value={fullName}
            placeholder={lang.name}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label>{lang.avatar}:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
          />

          <button className="button" type="submit" disabled={loading}>
            {loading ? lang.updating : lang.update}
          </button>
        </form>
      </div>
    </>
  );
}

export default EditProfile;
