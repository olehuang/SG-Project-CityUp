const BuildingInfoStyles={
    container:{
        position: "absolute",
        top: `${60}px`,
        left:0,
        right:0,
        margin:0,
        paddingTop: "0.5%",
        height:`calc(100vh - ${70}px)`,
        //border:"1px solid skyblue",
        borderRadius:"5px",
        overflow:"hidden",
        backgroundColor: "#e3f2fd",
        display: "flex",
        flexDirection: "column",
    },
    innerContainer:{
        top:"2%",
        marginTop:"0.5%",
        paddingTop:"0%",
        justifyContent:"left",
        display:"flex",
        flexDirection: "row",//  Direction of all result
        gap: "8px",// space between resualt
        height:"95%",
        width:"100%",
        // border:"1px solid red",
        borderRadius:"5px",
        overflowY: "auto",
    },
    leftContainer:{
        paddingBottom:"0",
        justifyContent:"left",
        display:"flex",
        flexDirection:"column",//  Direction of all result
        gap: "8px",// space between resualt
        height:"99%",
        //border:"1px solid black",
        borderRadius:"5px",
        overflowY: "auto",
    },
    searchTitle:{
        position: "absolut",
        display: "flex",
        justifyContent:"space-between",
        backgroundColor:"#fff",
        width:"100%",
        gridTemplateColumns: "50% 30% 20%",
    },
    serachResault:{
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover":{
            backgroundColor: "#e0f7fa",
            borderColor: "#128d9e",
        },
        "&:active": {
            transform: "scale(0.98)",
            backgroundColor: "#b2ebf2",
        },
    },

    rightContainer:{
        paddingBottom:"0",
        display:"flex",
        flexDirection: "column",
        flexWrap:"warp",
        gap: "8px",// space between resualt
        padding:"0 0 0 0 ",
        height:"99%",
        //border:"1px solid blue",
        borderRadius:"5px",
        overflowY: "auto",
    },
    resizer: {
        width: "6px",
        cursor: "col-resize",
        backgroundColor: "#ddd",
        "&:hover": {
            backgroundColor: "#bbb",
        },
    }
}

export default BuildingInfoStyles