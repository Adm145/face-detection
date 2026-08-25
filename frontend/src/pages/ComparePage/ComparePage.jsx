import { useCompareFaces } from "../../hooks/useCompareFaces";
import CompareForm from "../../components/CompareForm";
import CompareResult from "../../components/CompareResult";
import "./ComparePage.css";

export default function ComparePage() {
  const {
    photoA,
    photoB,
    draggingA,
    draggingB,
    setDraggingA,
    setDraggingB,
    status,
    errorMessage,
    result,
    setPhotoA,
    setPhotoB,
    clearPhotoA,
    clearPhotoB,
    handleDropA,
    handleDropB,
    handleSubmit,
  } = useCompareFaces();

  return (
    <main className="compare-page">
      <div className="compare-shell">
        <CompareForm
          photoA={photoA}
          photoB={photoB}
          draggingA={draggingA}
          draggingB={draggingB}
          setDraggingA={setDraggingA}
          setDraggingB={setDraggingB}
          status={status}
          errorMessage={errorMessage}
          setPhotoA={setPhotoA}
          setPhotoB={setPhotoB}
          clearPhotoA={clearPhotoA}
          clearPhotoB={clearPhotoB}
          handleDropA={handleDropA}
          handleDropB={handleDropB}
          handleSubmit={handleSubmit}
        />

        {status === "success" && result && <CompareResult result={result} />}
      </div>
    </main>
  );
}
