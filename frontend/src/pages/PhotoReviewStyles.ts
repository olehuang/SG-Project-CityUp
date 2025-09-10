import pageBackgroundStyles from "./pageBackgroundStyles";

export const photoReviewStyles = {
    mainContainer: {
        ...pageBackgroundStyles.container,
        padding: { xs: "1px 4px", sm: "1px 8px" },
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    } as const,
    contentWrapper: {
        flex: 1,
        overflowY: 'auto',
        overflowX: "hidden",
        display: "flex",
        padding: '16px',
        flexDirection: "column",
        width: "98%",
        maxWidth: "none",
        margin: "0 auto",
        px: { xs: 0.5, sm: 1 },
    },
    topActionContainer: {
        display: "flex",
        flexWrap: 'wrap',
        justifyContent: "space-between",
        alignItems: "flex-start",
        mb: 2,
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1, sm: 0 },
        flexShrink: 0,
        '@media (max-width:600px)': {
            flexDirection: 'row',
            justifyContent: 'center',
        }
    },
    leftActionGroup: {
        display: "flex",
        alignItems: "center",
        flexDirection: 'row',
        gap: { xs: 1, sm: 2 },
        flexWrap: "wrap",
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
        maxWidth: { xs: "100%", sm: "400px" },
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
        maxHeight: { xs: "calc(100vh - 280px)", sm: "calc(100vh - 220px)" },
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(93, 64, 55, 0.1)",
        backgroundColor: "#FFFEF7",
        overflowX: "auto",
    },
    table: {
        minWidth: { xs: 500, sm: 600, md: 700 },
        width: "100%",
    },

    headerCheckboxCell: {
        width: 48,
        backgroundColor: "#F5F5F5",
        borderBottom: "2px solid #D7CCC8"
    },
    headerCell: (width: number) => ({
        width: {
            xs: width * 0.7,
            sm: width * 0.8,
            md: width
        },
        minWidth: { xs: 60, sm: 80, md: width * 0.8 },
        backgroundColor: "#F5F5F5",
        borderBottom: "2px solid #D7CCC8",
        fontWeight: "bold",
        color: "#3E2723",
        padding: { xs: "8px 4px", sm: "8px 8px" },
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
        height: { xs: "100px", sm: "120px" },
        "&:hover": {
            backgroundColor: "#F3E5F5",
        }
    }),
    imageCell: {
        padding: { xs: "4px", sm: "8px" }
    },
    imageBox: {
        width: { xs: "100px", sm: "150px" },
        height: { xs: "75px", sm: "110px" },
        borderRadius: "8px",
        overflow: "hidden",
        border: "2px solid #D7CCC8",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }
    },

    imageInner: {
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
        display: "block"
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
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1, sm: 0 },
    },
    statsText: {
        color: "#6D4C41",
        fontWeight: "500"
    },
    bottomActionGroup: {
        display: "flex",
        gap: { xs: 1, sm: 2 },
        alignItems: "center",
        flexWrap: "wrap",
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
    },


    cardContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: '8px',
    },


    card: {
        position: 'relative',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },


    cardMedia: {
        cursor: 'pointer',
        height: 180,
        objectFit: 'cover',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },


    cardContent: {
        padding: '12px 16px',
        '& > p': {
            marginBottom: 8,
            fontSize: '0.9rem',
            color: '#444',
        },
    },


    cardActions: {
        justifyContent: 'flex-end',
        gap: 8,
        padding: '8px 16px 16px',
    },


    cardCheckbox: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
};