import { useState, type JSX } from "react";
import {
  PageContainer,
  Title,
  UploadBox,
  FileInput,
  HelperText,
} from "./Upload.styled";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import Button from "../../components/Button/Button";

const Upload = (): JSX.Element => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    text: string;
    type: "error" | "success" | "info" | "warning";
  } | null>(null);

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
      const data = await res.json();

      if (res.ok) {
        setAlert({
          text: `Upload successful. Imported ${data} records.`,
          type: "success",
        });
      } else {
        setAlert({ text: data.message || "Upload failed.", type: "error" });
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
      <Title>Upload Apple Health Extract</Title>
      <UploadBox>
        <FileInput type="file" accept=".xml" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={loading} loading={loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
        <HelperText>Only .xml files are supported</HelperText>

        {loading && <Loader text="Processing your health data..." />}
        {alert && <Alert text={alert.text} type={alert.type} />}
      </UploadBox>
    </PageContainer>
  );
};

export default Upload;
