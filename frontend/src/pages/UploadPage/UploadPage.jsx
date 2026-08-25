import { useEnrollForm } from "../../hooks/useEnrollform";
import EnrollForm from "../../components/EnrollForm";
import EnrollSuccess from "../../components/EnrollSuccess";
import "./UploadPage.css";

export default function UploadPage() {
  const {
    MIN_PHOTOS,
    enrollFields,
    setEnrollFields,
    photos,
    isDragging,
    setIsDragging,
    status,
    errorMessage,
    result,
    photoCountOk,
    addFiles,
    removePhoto,
    handleDrop,
    handleSubmit,
    resetForm,
  } = useEnrollForm();

  return (
    <>
      {status === "success" && result ? (
        <EnrollSuccess result={result} onReset={resetForm} />
      ) : (
        <EnrollForm
          MIN_PHOTOS={MIN_PHOTOS}
          enrollFields={enrollFields}
          setEnrollFields={setEnrollFields}
          photos={photos}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          status={status}
          errorMessage={errorMessage}
          photoCountOk={photoCountOk}
          addFiles={addFiles}
          removePhoto={removePhoto}
          handleDrop={handleDrop}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
}
