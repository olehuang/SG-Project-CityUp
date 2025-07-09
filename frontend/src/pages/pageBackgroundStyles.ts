
const pageBackgroundStyles = {
        container: {
            minHeight: "100vh",
            margin: 0,
            padding: "0 1rem", // 添加左右内边距，避免内容贴边
            boxSizing: "border-box",
            // backgroundColor: "#f5f9fc",
            backgroundColor: "#FFF8E1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflowY: "auto",
            flexDirection: "column",
        },
        wrapper: {
            width: "100%", // 改为100%宽度
            maxWidth: "1000px", // 保持最大宽度限制
            marginTop: "1rem",
            padding: "0 1rem", // 添加内边距
        },
    title: {
        fontWeight: "bold",
        // color: "#0d3b66",
        color: "#3E2723",
        fontSize: {
            xs: "3rem",    // 手机屏幕：更小的字体
            sm: "4rem",    // 小平板：中等字体
            md: "5rem",    // 中等屏幕：原来的xs大小
            lg: "6rem",   // 大屏幕：原来的md大小
            xl: "8rem"    // 超大屏幕：原来的lg大小
        },
        marginBottom: "1.5rem",
        textAlign: "center", // 确保文字居中
        lineHeight: 1.1,     // 调整行高，避免文字过于拥挤
    },

}

export default pageBackgroundStyles