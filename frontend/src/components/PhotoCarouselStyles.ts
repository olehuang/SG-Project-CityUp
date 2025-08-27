
const styles={
    dialogMobilPopers:{
        width: 'auto',
        maxWidth: '90vw',
        maxHeight: '90vh',
        m: 'auto',
        p: 0,
        bgcolor: 'transparent',
        boxShadow: 'none',
    },
    mainBox:{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FAF6E9",
    },
    linkArrowArea:{
        position:"absolute",
        left:0,top:0,bottom:0,
        width:"5%",display:"flex",
        alignItems:"center",
        //border:"1px solid black",
        justifyContent:"flex-start",
        cursor:"pointer",
        zIndex:10,
        "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" }
    },
    linkArrorIcon:{
        position: "absolute",
        left: 0, top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10
    },
    photoAndInfoArea:{
        flex: 1,
        overflow: "hidden",
        width: "100%",
        height:"100%",
        display: "flex",
        flexDirection:"row",
        alignItems: "center",
        justifyContent: "center",
        textAlign:"center",
    },
    photoArea:{
        textAlign: "center",
        paddingLeft:0,
        marginTop: 0,
        '@media (min-width:900px)': {
            height:"80%",
            margin:"0 1% 0 5%",
        },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    image:{
        width:  "100%",
        maxHeight: "90vh" ,
        boxShadow:  "none" ,
        '@media (minWidth:900px)': {
            width: "90%",
            height: "70%",
            boxShadow:  "0px 4px 12px rgba(0,0,0,0.2)",
        },
        height: "auto",
        objectFit: "contain" as const,
        borderRadius: 8,
        backgroundColor: "transparent",
        overflow: "hidden",
    },
    infoArea:{ //only Desktop work
        textAlign: "left",
        marginRight:"5%",
    },
    closeIcon:{
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(255,255,255,0.6)",
        zIndex: 20
    },
    rightArrowArea:{
        position:"absolute",
        right:0,top:0,bottom:0,
        width:"5%",display:"flex",
        justifyContent:"flex-end",
        cursor:"pointer",
        zIndex:10,
        // border:"1px solid black",
        "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" }
    },
    rightArrow:{
        position: "absolute",
        right: 10, top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10
    },
    test: { color: "red" },
}

export default styles
