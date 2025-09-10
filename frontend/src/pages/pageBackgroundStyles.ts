
const pageBackgroundStyles = {
        // Outer container style for the entire page layout
        container: {
            minHeight: "100vh",
            flexDirection: "column",
            margin: 0,
            boxSizing: "border-box",
            backgroundColor: "#FFF8E1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "100vw",
            overflow: "hidden",
        },
    // Wrapper for inner content, used to constrain width and add padding
        wrapper: {
            width: "100%",
            maxWidth: "1000px",
            marginTop: "1rem",
            padding: "0 1rem",
        },
    // Title style used for section headers
    title: {
        fontWeight: "bold",
        color: "#3E2723",
        fontSize: {
            xs: "3rem",
            sm: "4rem",
            md: "5rem",
            lg: "6rem",
            xl: "8rem"
        },
        marginBottom: "1.5rem",
        textAlign: "center",
        lineHeight: 1.1,
        maxWidth: "100%",
        overflowWrap: "break-word"
    },

}

export default pageBackgroundStyles