
const pageBackgroundStyles = {
        container: {
            minHeight: "100vh",
            margin: 0,
            padding: "0 1rem", //添加左右内边距，避免内容贴边
            boxSizing: "border-box",
            backgroundColor: "#FFF8E1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflowY: "auto",
            flexDirection: "column",
            maxWidth: "100vw",         // 避免内部撑宽超过视口
            overflowX: "hidden",       // 禁止横向滚动条出现
        },
        wrapper: {
            width: "100%", //从固定宽度变为百分比宽度以适配各类设备
            maxWidth: "1000px", //最大宽度限制防止内容太宽
            marginTop: "1rem",
            padding: "0 1rem", //增强左右间距，美观与排版
        },
    title: {
        fontWeight: "bold",
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
        maxWidth: "100%",         // 防止标题在小屏幕上超宽
        overflowWrap: "break-word" // 自动断行避免文字撑出屏幕
    },

}

export default pageBackgroundStyles