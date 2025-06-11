import pageBackgroundStyles from "./pageBackgroundStyles";

export const photoReviewStyles = {
    mainContainer: {
        ...pageBackgroundStyles.container,
        padding: "1px 0px",
        height: "100vh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    } as const,
    contentWrapper: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        width: "95%",
        maxWidth: "none",
        margin: "0 auto",
        px: 2,
    },
    topActionContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        mb: 2,
    },
    leftActionGroup: {
        display: "flex",
        alignItems: "center",
        gap: 2,
    },
    fetchButton: {
        borderRadius: 12,
        textTransform: "none",
        fontWeight: "bold",
        fontSize: 14,
        backgroundColor: "#5D4037",
        color: "#FFF8E1",
        px: 3,
        py: 1.5,
        "&:hover": {
            backgroundColor: "#4E342E",
        },
        "&:disabled": {
            backgroundColor: "#A1887F",
            color: "#D7CCC8",
        }
    },
    selectButton: {
        borderRadius: 12,
        textTransform: "none",
        fontWeight: "bold",
        fontSize: 14,
        borderColor: "#5D4037",
        color: "#5D4037",
        px: 3,
        py: 1.5,
        "&:hover": {
            borderColor: "#4E342E",
            backgroundColor: "#FFF8E1",
        },
        "&:disabled": {
            borderColor: "#D7CCC8",
            color: "#A1887F",
        }
    },
    alert: (hasError: boolean) => ({
        minWidth: 0,
        flex: 1,
        maxWidth: "400px",
        borderRadius: 2,
        backgroundColor: hasError ? "#FFEBEE" : "#E8F5E8",
        color: hasError ? "#C62828" : "#2E7D32",
        "& .MuiAlert-icon": {
            color: hasError ? "#C62828" : "#2E7D32",
        }
    }),
    tableContainer: {
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        mb: 2,
        flex: 1,
        overflow: "auto",
        maxHeight: "calc(100vh - 220px)",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(93, 64, 55, 0.1)",
        backgroundColor: "#FFFEF7",
    },
    table: {
        minWidth: 700,
    },

    headerCheckboxCell: {
        width: 48,
        backgroundColor: "#F5F5F5",
        borderBottom: "2px solid #D7CCC8"
    },
    headerCell: (width: number) => ({
        width: width,
        backgroundColor: "#F5F5F5",
        borderBottom: "2px solid #D7CCC8",
        fontWeight: "bold",
        color: "#3E2723"
    }),
    checkbox: {
        color: "#5D4037",
        "&.Mui-checked": {
            color: "#5D4037",
        },
        "&.MuiCheckbox-indeterminate": {
            color: "#5D4037",
        }
    },
    noDataCell: (selectMode: boolean) => ({
        colSpan: selectMode ? 6 : 5,
        align: "center" as const,
        py: 6,
        backgroundColor: "#FFFEF7"
    }),

    noDataText: {
        color: "#6D4C41",
        fontSize: 16,
        fontWeight: "500"
    },

    tableRow: (selectMode: boolean, selected: boolean) => ({
        backgroundColor: selectMode && selected ? "#F3E5F5" : "#FFFEF7",
        height: "120px",
        "&:hover": {
            backgroundColor: "#F3E5F5",
        }
    }),
    imageCell: {
        padding: "8px"
    },
    image: {
        width: "150px",
        height: "110px",
        objectFit: "cover" as const,
        borderRadius: "8px",
        border: "2px solid #D7CCC8",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }
    },
    addressText: {
        wordBreak: "break-word",
        color: "#3E2723",
        fontWeight: "500"
    },
    userText: {
        color: "#3E2723",
        fontWeight: "500"
    },
    timeText: {
        color: "#6D4C41"
    },
    actionButtonContainer: {
        display: "flex",
        gap: 1
    },
    approveButton: {
        borderRadius: 8,
        textTransform: "none",
        fontWeight: "bold",
        fontSize: 12,
        backgroundColor: "#4CAF50",
        color: "#FFF",
        px: 2,
        py: 1,
        "&:hover": {
            backgroundColor: "#45A049",
        },
        "&:disabled": {
            backgroundColor: "#A1887F",
            color: "#D7CCC8",
        }
    },
    rejectButton: {
        borderRadius: 8,
        textTransform: "none",
        fontWeight: "bold",
        fontSize: 12,
        backgroundColor: "#F44336",
        color: "#FFF",
        px: 2,
        py: 1,
        "&:hover": {
            backgroundColor: "#E53935",
        },
        "&:disabled": {
            backgroundColor: "#A1887F",
            color: "#D7CCC8",
        }
    },
    statsContainer: {
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        px: 1,
    },
    statsText: {
        color: "#6D4C41",
        fontWeight: "500"
    },
    bottomActionGroup: {
        display: "flex",
        gap: 2,
        alignItems: "center"
    },
    batchApproveButton: {
        borderRadius: 10,
        textTransform: "none",
        fontWeight: "bold",
        fontSize: 13,
        backgroundColor: "#4CAF50",
        color: "#FFF",
        px: 3,
        py: 1.2,
        "&:hover": {
            backgroundColor: "#45A049",
        },
        "&:disabled": {
            backgroundColor: "#A1887F",
            color: "#D7CCC8",
        }
    },
    batchRejectButton: {
        borderRadius: 10,
        textTransform: "none",
        fontWeight: "bold",
        fontSize: 13,
        backgroundColor: "#F44336",
        color: "#FFF",
        px: 3,
        py: 1.2,
        "&:hover": {
            backgroundColor: "#E53935",
        },
        "&:disabled": {
            backgroundColor: "#A1887F",
            color: "#D7CCC8",
        }
    },
    exitButton: {
        borderRadius: 10,
        textTransform: "none",
        fontWeight: "bold",
        fontSize: 13,
        borderColor: "#5D4037",
        color: "#5D4037",
        px: 3,
        py: 1.2,
        "&:hover": {
            borderColor: "#4E342E",
            backgroundColor: "#FFF8E1",
        }
    },

    previewDialog: {
        "& .MuiDialog-paper": {
            maxWidth: "90vw",
            maxHeight: "90vh",
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "hidden"
        }
    },
    previewContent: {
        position: "relative",
        padding: 0,
        backgroundColor: "transparent",
        overflow: "hidden",
        "&:first-child": {
            paddingTop: 0
        }
    },
    closeButton: {
        position: "absolute",
        right: -40,
        top: -40,
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "white",
        zIndex: 1,
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0.8)",
        }
    },
    previewImage: {
        maxWidth: "80vw",
        maxHeight: "80vh",
        objectFit: "contain" as const,
        borderRadius: "8px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
    }
};