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

type UploadBankResponse =
  operations["upload_bank_api_bank__post"]["responses"][201]["content"]["application/json"];

const Upload = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  const [healthFile, setHealthFile] = useState<File | null>(null);
  const [bankFiles, setBankFiles] = useState<File[] | null>(null);

  const handleBankFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBankFiles(Array.from(e.target.files));
    }
  };

  const handleHealthFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setHealthFile(e.target.files[0]);
  };

  const handleHealthUpload = async () => {
    if (!healthFile) {
      setAlert({
        text: "Please select a file before uploading.",
        type: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", healthFile);

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

  const handleBankUpload = async () => {
    if (!bankFiles) {
      setAlert({
        text: "Please select your bank statements before uploading.",
        type: "warning",
      });
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < bankFiles.length; i++) {
      formData.append("files", bankFiles[i]);
    }

    try {
      setLoading(true);
      setAlert(null);

      const res = await fetch("/api/bank", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = (await res.json()) as UploadBankResponse;
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
    <>
      <PageContainer>
        <UploadBox>
          <H1 center>Apple Health</H1>
          <FileInput
            type="file"
            accept=".xml"
            onChange={handleHealthFileChange}
          />
          <Button onClick={handleHealthUpload} disabled={loading}>
            Upload
          </Button>
          <HelperText>Only .xml files are supported</HelperText>
        </UploadBox>

        <UploadBox>
          <H1 center>Bank Statements</H1>
          <FileInput
            type="file"
            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            multiple
            onChange={handleBankFileChange}
          />
          <Button onClick={handleBankUpload} disabled={loading}>
            Upload
          </Button>
          <HelperText>Only .csv or .xls files are supported</HelperText>
        </UploadBox>
      </PageContainer>
      {loading && <Loader text="Processing your health data..." />}
      {alert && <Alert {...alert} />}
    </>
  );
};

export default Upload;
