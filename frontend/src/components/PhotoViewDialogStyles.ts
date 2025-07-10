


const styles = {
    dialogTitle: {
        backgroundColor: "#FAF6E9",
        padding: "1% 1% 0 1%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    downloadButton: {
        display: "flex",
        gap: 2,
        alignItems: "center",
        marginLeft: "auto",
    },
    favoriteIcon: {
        position: "absolute",
        top: "1%",
        right: "1%",
        backgroundColor: "rgba(255,255,255,0.8)",
        '&:hover': {
            backgroundColor: "rgba(255,255,255,0.9)",
        },
        zIndex: 2,
    },
    mainZoneBackground: {
        padding: 2,
        backgroundColor: "#FAF6E9",
    },
    mainZone: {
        display: "flex",
        mb: 1,
        alignItems: "center",
        margin: 0,
    },
    loading: {
        display: "flex",
        alignItems: "center",
        gap: 2,
    },
    image: {
        borderRadius: 8,
        cursor: "pointer",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
    },
};

export default styles;