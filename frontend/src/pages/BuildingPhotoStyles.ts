const BuildingPhotoStyles={
    container:{
        width: '100%',
        maxWidth: '100vw',
        position: "relative",
        left: 0,
        margin: '0 auto',
        padding: { xs: '8px', sm: '12px', md: '16px' },
        height: "100vh", //`calc(100vh - ${70}px)`,
        //border:"1px solid skyblue",
        borderRadius:"5px",
        overflow:"hidden",
        backgroundColor:"#FAF6E9",// "#cee6ec",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        gap: 2,
        boxSizing: 'border-box'
    },
    innerContainer:{
        margin:{ xs: '4px', md: '8px' },
        paddingTop:"0%",
        padding: { xs: '4px', md: '8px' },
        justifyContent:"left",
        display:"flex",
        flexDirection: { xs: "column", md: "row" },//  Direction of all result
        gap: { xs: 2, md: 3 },// space between resualt
        height: "calc(100% - 120px)",
        // border:"1px solid red",
        backgroundColor: "#FAF6E9",
        borderRadius:"5px",
        overflow: "hidden",
        boxShadow: "0px 10px 12px rgba(0, 0, 0, 0.1)",
        width: '100%',
        flex: 1,
        boxSizing: 'border-box'
    },
    leftContainer:{
        paddingBottom:"0",
        paddingRight: { xs: 0, md: 1 },
        justifyContent:"left",
        display:"flex",
        flexDirection: "column",//  Direction of all result
        gap: "8px",// space between resualt
        width: { xs: "100%", md: "calc(70% - 3px)" },
        minWidth: { xs: "100%", md: "300px" },
        maxHeight:  { xs: '40vh', md: '100%' },
        borderRadius:"5px",
        overflowY: "auto",
        flex: { xs: 'none', md: '0 0 auto' },
        marginBottom: { xs: 2, md: 0 },
        boxSizing: 'border-box'
    },
    searchTitle:{
        position: "relative",
        boxSizing: 'border-box',
        display: "flex",
        justifyContent:"space-between",
        backgroundColor:"#fff",
        width:"100%",

    },
    serachResault:{
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover":{
            backgroundColor: "#bbdefb",//"#e0f7fa",
            borderColor: "#128d9e",
        },
        "&:active": {
            transform: "scale(0.98)",
            backgroundColor: "#bbdefb",//"#b2ebf2",
        },
    },

    rightContainer:{
        paddingBottom:"0",
        display:"flex",
        flexDirection: "column",
        flexWrap:"nowrap",
        gap: "8px",// space between resualt
        paddingLeft: { xs: 0, md: 1 },
        height: { xs: "auto", md: "100%" },
        backgroundColor: "#FAF6E9",
        //border:"1px solid brown",
        borderRadius:"5px",
        overflowY: "auto",
        width: { xs: "100%", md: "calc(30% - 3px)" },
        flex: "none",
        minWidth: { xs: "100%", md: "200px" },
        maxWidth: { xs: "100%", md: "400px" },
        boxSizing: 'border-box'
    },
    rightContainerTitle:{
        display:"flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent:"space-between",
        alignItems:"center",
        padding: { xs: "3% 2%", md: "2% 3% 3% 3%" },
        margin: { xs: "0% 1% 2% 1%", md: "0% 2% 4% 1%" },
        backgroundColor:"#F1EFEC",
        borderRadius:"8px",
        position: "sticky",
        top: 0,
        gap: 1
    },
    resizer: {
        width: "6px",
        flexShrink: 0,
        cursor: "col-resize",
        backgroundColor: "#ddd",
        display: { xs: 'none', md: 'block' },
        "&:hover": {
            backgroundColor: "#b0bec5",
        },
    }
}

export default BuildingPhotoStyles