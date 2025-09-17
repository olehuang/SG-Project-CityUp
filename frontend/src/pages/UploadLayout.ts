// uploadLayout.ts
import { CSSProperties } from "react";

interface UploadLayout {
    container: CSSProperties;
    topRow: CSSProperties;
    bottomRow: CSSProperties;
    leftColumn: CSSProperties;
    rightColumn: CSSProperties;
}

const uploadLayout: UploadLayout = {
    container: {
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        backgroundColor: "#FFF8E1",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        gap: "1rem",
    },
    topRow: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap", // Automatic line breaks on small screens
        gap: "0.8rem",
        width: "100%",
        boxSizing: "border-box",
        alignItems: "center",
    },
    bottomRow: {
        display: "flex",
        flexDirection: "row",
        flex: 1,
        gap: "1rem",
        width: "100%",
        boxSizing: "border-box",
    },
    leftColumn: {
        flex: 2,
        display: "flex",
        flexDirection: "column",
        gap: "0.8rem",
        minWidth: "280px", // ✅ 防止过窄
    },
    rightColumn: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minWidth: "250px", // ✅ 防止过窄
    },
};

// Dynamic injection of reactive rules
const style = document.createElement("style");
style.innerHTML = `
  @media (max-width: 1200px) {
    .upload-bottomRow {
      flex-direction: column !important;
    }
    .upload-topRow {
      flex-direction: column !important;
      align-items: stretch !important;
    }
  }

  @media (max-width: 768px) {
    .upload-container {
      padding: 0.5rem !important;
      gap: 0.5rem !important;
    }
    .upload-topRow {
      gap: 0.5rem !important;
    }
    .upload-leftColumn,
    .upload-rightColumn {
      min-width: 100% !important;
    }
  }
`;
document.head.appendChild(style);

export default uploadLayout;
