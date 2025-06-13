const BuildingPhotoStyles={
    container:{
        width: '95%',
        position: "absolute",
        left:"2%",
        marginRight:"2%",
        paddingTop: "0.5%",
        height:"79%",//`calc(100vh - ${70}px)`,
        //border:"1px solid skyblue",
        borderRadius:"5px",
        overflow:"hidden",
        backgroundColor: "#e3eaed",
        display: "flex",
        flexDirection: "column",
    },
    innerContainer:{
        top:"5%",
        margin:"1% 1% 1% 1%",
        paddingTop:"0%",
        justifyContent:"left",
        display:"flex",
        flexDirection: "row",//  Direction of all result
        gap: "8px",// space between resualt
        height:"95%",
        width:"100%",
        // border:"1px solid red",
        backgroundColor: "#e3eaed",
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
        width:"60%",
        //border:"1px solid black",
       // backgroundColor: "#e3f2fd",
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
        margin:"0 2% 0 0",
        flexDirection: "column",
        flexWrap:"wrap",
        gap: "8px",// space between resualt
        padding:"0 0 0 0 ",
        height:"100%",
        backgroundColor: "#e3eaed",
        //border:"1px solid brown",
        borderRadius:"5px",
        overflowY: "auto",
    },
    rightContainerTitle:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        padding:"2% 3% 3% 3%",
        margin:"0% 1% 4% 1%",
        backgroundColor:"#abd1e6",
        borderRadius:"8px",
        position: "sticky", top: 0
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

export default BuildingPhotoStyles