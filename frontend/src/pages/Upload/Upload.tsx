import { useState, type JSX } from "react";
import {
  PageContainer,
  UploadBox,
  FileInput,
  HelperText,
} from "./Upload.styled";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import Button from "../../components/Button/Button";
import type { AlertData } from "../../types/types";
import type { operations } from "../../types/api-routes";
import { H1 } from "../../components/Typography/Headings";

type UploadHealthResponse =
  operations["upload_health_api_health__post"]["responses"][201]["content"]["application/json"];

const Upload = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setAlert({
        text: "Please select a file before uploading.",
        type: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setAlert(null);

      const res = await fetch("/api/health", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = (await res.json()) as UploadHealthResponse;
        setAlert({
          text: `Upload successful. Imported ${data.imported} records.`,
          type: "success",
        });
      } else {
        setAlert({ text: "Upload failed.", type: "error" });
      }
    } catch {
      setAlert({
        text: "Something went wrong. Try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <H1 center>Upload Apple Health Extract</H1>
      <UploadBox>
        <FileInput type="file" accept=".xml" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={loading}>
          Upload
        </Button>
        <HelperText>Only .xml files are supported</HelperText>

        {loading && <Loader text="Processing your health data..." />}
        {alert && <Alert {...alert} />}
      </UploadBox>
    </PageContainer>
  );
};

export default Upload;
