import React, { useState, useEffect } from "react";
import LOGO from "../../assets/logo.svg";
import "./css/style.scss";
import TEXT_GREY from "../../assets/text-grey.svg";
import TEXT_COLOR from "../../assets/text-color.svg";
import FILE_GREY from "../../assets/files-grey.svg";
import FILE_COLOR from "../../assets/files-color.svg";
import TextArea from "../../components/TextArea";
import ThemeButton from "../../components/Button";
import DropZone from "../../components/DropZone";
import FileList from "../../components/FileList";
import { FaDownload } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  db,
  ref,
  set,
  onValue,
  remove,
  storage,
  storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "../../db/index";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import { Switch } from "antd";

function HomePage() {
  const [type, setType] = useState("text");
  const [textValue, setTextValue] = useState("");
  const [isText, setIsText] = useState(false);
  const [files, setFiles] = useState([]);
  const [tempFiles, setTempFiles] = useState([]);

  const [t, i18n] = useTranslation();

  const handleChange = (checked) => {
    const newLanguage = checked ? "ur" : "en";
    i18n.changeLanguage(newLanguage);
  };

  const onDrop = async (acceptedFiles) => {
    setTempFiles([...tempFiles, ...acceptedFiles]);
    let arr = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      arr.push(uploadFile(acceptedFiles[i], i));
    }
    const allFiles = await Promise.all(arr);
    setFiles([...files, ...allFiles]);
    // uploadFile(acceptedFiles[0], 0)
    setTempFiles([]);
    set(ref(db, "file-sharing"), {
      files: [...files, ...allFiles],
    });
  };
  // console.log('files', tempFiles);

  const uploadFile = (file, i) => {
    return new Promise((resolve, reject) => {
      const fileRef = storageRef(storage, `files/file-${i}`);
      const uploadTask = uploadBytesResumable(fileRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve({ url: downloadURL, type: file.type, name: file.name });
          });
        }
      );
    });
  };

  const clearText = async () => {
    await remove(ref(db, "text-sharing/"));
    setTextValue("");
    setIsText(false);
  };

  const deleteAllFiles = async () => {
    await remove(ref(db, "file-sharing/"));
    setFiles([]);
  };

  const downloadAll = () => {
    let filename = "All-Files";
    // const urls = files.url
    const zip = new JSZip();
    const folder = zip.folder("project");
    files.forEach((file) => {
      console.log("file", file);
      const blobPromise = fetch(file.url).then(function (response) {
        if (response.status === 200 || response.status === 0) {
          return Promise.resolve(response.blob());
        } else {
          return Promise.reject(new Error(response.statusText));
        }
      });
      const name = file.name;
      folder.file(name, blobPromise);
    });

    zip
      .generateAsync({ type: "blob" })
      .then((blob) => saveAs(blob, filename))
      .catch((e) => console.log(e));
  };

  const saveChanges = () => {
    set(ref(db, "text-sharing/"), {
      text: textValue,
    });
  };
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveChanges();
        console.log("hello");
      }
    });
  });

  useEffect(() => {
    const textRef = ref(db, "text-sharing");
    onValue(textRef, (snapshot) => {
      const data = snapshot.val();
      // console.log('data', data);
      setTextValue(data.text);
      if (data.text) {
        setIsText(true);
      }
    });

    const fileRef = ref(db, "file-sharing");
    onValue(fileRef, (snapshot) => {
      const data = snapshot.val();
      console.log(files);
      setFiles(data.files);
    });
  }, []);

  var expression =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  var regex = new RegExp(expression);
  const links = textValue.match(regex) || [];

  return (
    <div className="container">
      <div className="header-bar">
        <div className="logo">
          <img src={LOGO} alt="" />
        </div>
        <div className="menu-bar">
          <ul>
            <li>{t("How it works")}</li>
            <li>{t("Download")}</li>
            <li>{t("Upgrade")}</li>
            <li>{t("Feedback")}</li>
            <li className="menu-btn">{t("Login / Register")}</li>
            <li>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ margin: "0px 8px" }}>En</span>
                <Switch
                  size="small"
                  defaultChecked={i18n.language === "ur"}
                  onChange={handleChange}
                />
                <span style={{ margin: "0px 8px" }}>Ur</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="main-card">
        <div className="card-sidebar">
          <div
            onClick={() => setType("text")}
            className={type === "text" && "active"}
          >
            <img src={type === "text" ? TEXT_COLOR : TEXT_GREY} alt="" />
          </div>
          <div
            onClick={() => setType("files")}
            className={type === "files" && "active"}
          >
            <img src={type === "files" ? FILE_COLOR : FILE_GREY} alt="" />
          </div>
        </div>
        <div className="card-container">
          {type === "text" ? (
            <div className="text-section">
              <h1>Text</h1>
              <div className="resize-section">
                <TextArea
                  value={textValue}
                  placeholder={t("TextArea")}
                  onChange={(e) => {
                    setTextValue(e.target.value);
                    setIsText(false);
                  }}
                />
              </div>
              <div className="text-footer">
                <div className="links">
                  {links.map((v, i) => (
                    <div key={i}>
                      <span>
                        <a href={v} target="_blank" rel="noopener noreferrer">
                          {v}
                        </a>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="save-btn-section">
                  <span onClick={clearText}>Clear</span>
                  {isText ? (
                    <ThemeButton
                      onClick={() => {
                        navigator.clipboard.writeText(textValue);
                      }}
                      title={t("Copy")}
                    />
                  ) : (
                    <ThemeButton
                      onClick={saveChanges}
                      disabled={!textValue}
                      title={t("Save")}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="files-section">
              <div className="files-header">
                <h1>{t("Files")}</h1>
                <div className="files-btn">
                  <div className="download-btn" onClick={downloadAll}>
                    <FaDownload />
                    {t("Download All")}
                  </div>
                  <div onClick={deleteAllFiles} className="delete-btn">
                    <MdDelete />
                    {t("Delete All")}
                  </div>
                </div>
              </div>
              {tempFiles.length || files.length ? (
                <FileList tempFiles={tempFiles} files={files} onDrop={onDrop} />
              ) : (
                <DropZone
                  onDrop={onDrop}
                  titleElement={
                    <>
                      {t("Drag and drop any files up to 2 files, 5Mbs each or")}
                      {"  "}
                      <span>{t("Browse Upgrade")}</span>{" "}
                      {t("to get more space")}
                    </>
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
