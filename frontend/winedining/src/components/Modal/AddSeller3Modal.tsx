import React, { useState } from "react";
import { addNote } from "../../store/slices/noteSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Wine } from "../../types/wine";

interface AddSeller3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void; // 추가
  drinkData: any;
  wineInfo: Wine; // 추가
}

const AddSeller3Modal = ({ isOpen, onClose, onPrev, drinkData, wineInfo }: AddSeller3ModalProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  // 이미지 업로드
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);

    if (selectedImages.length + files.length > 3) {
      alert("최대 3장까지 업로드할 수 있습니다!");
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  // 이미지 삭제
  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    const bottleId = drinkData.bottleId;

    if (!bottleId) {
      alert("bottle_id가 없습니다. 저장할 수 없습니다.");
      return;
    }

    const newNote = {
      who: drinkData.companion,
      when: drinkData.drinkDate,
      pairing: drinkData.food ? drinkData.food.split(",") : [],
      nose: drinkData.taste,
      content: drinkData.note,
      rating: drinkData.rating,
      image: selectedImages,
    };

    try {
      await dispatch(addNote({ bottleId, note: newNote })).unwrap();
      alert("와인 노트가 저장되었습니다!");
      onClose();
    } catch (error) {
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
};

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>✕</button>

        <h2 style={styles.title}>와인 수집</h2>
        {wineInfo && (
          <p style={styles.subtitle}>
            {wineInfo.grape}
            <img src={`/flags/${wineInfo.country}.png`} alt={wineInfo.country} style={styles.flagIcon} />
          </p>
        )}

        <div style={styles.wineContainer}>
          {wineInfo && (
            <>
              <img 
                src={wineInfo.image || "/sample_image/wine_bottle.png"} 
                alt={wineInfo.name} 
                style={styles.wineImage} 
              />
              <p style={styles.wineName}>{wineInfo.name}</p>
            </>
          )}
        </div>

        {/* 사진 업로드 */}
        <p style={styles.sectionTitle}>오늘을 함께 기억할 사진</p>
        <div style={styles.imageUploadContainer}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} style={styles.uploadBox}>
              {selectedImages[index] ? (
                <>
                  <img src={selectedImages[index]} alt={`Uploaded ${index}`} style={styles.uploadedImage} />
                  <button style={styles.removeButton} onClick={() => removeImage(index)}>
                    ✕
                  </button>
                </>
              ) : (
                <label style={styles.uploadLabel}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  📷
                </label>
              )}
            </div>
          ))}
        </div>

        {/* 페이지 이동 */}
        <div style={styles.pagination}>
          <span style={styles.pageArrow} onClick={onPrev}>
            ←
          </span>
          <span style={styles.pageText}>3 / 3</span>
          <button style={styles.completeButton} onClick={handleComplete}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

// 스타일 추가
const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#2a0e35",
    padding: "20px",
    borderRadius: "25px",
    width: "350px",
    height: "600px",
    color: "#fff",
    position: "relative",
    border: "3px solid #d4a5ff",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  closeButton: {
    position: "absolute",
    right: "15px",
    top: "15px",
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#fff",
    cursor: "pointer",
  },
  title: { fontSize: "24px", fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: "14px", textAlign: "center", color: "#d4a5ff" },
  wineContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  wineImage: { width: "120px", height: "180px" },
  wineName: { fontSize: "16px", fontWeight: "bold", textAlign: "center", color: "#ffcc00" },
  sectionTitle: { fontSize: "14px", textAlign: "center", marginBottom: "10px" },
  imageUploadContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  uploadBox: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  uploadLabel: {
    fontSize: "24px",
    cursor: "pointer",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: "8px",
    objectFit: "cover",
  },
  removeButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    fontSize: "12px",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  completeButton: {
    backgroundColor: "#ffcc00",
    color: "#2a0e35",
    border: "none",
    padding: "10px 15px",
    fontSize: "14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default AddSeller3Modal;
