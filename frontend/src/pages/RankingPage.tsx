
import {Box, Typography, Container, Button,Dialog, DialogTitle,LinearProgress,Alert} from "@mui/material";
import React, {useState,useEffect,} from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useAuthHook} from "../components/AuthProvider";
import axios from "axios";
import {photoReviewStyles} from "./PhotoReviewStyles";
import {useNavigate} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import Pagination from '@mui/material/Pagination';


type User={
    user_id:string,
    username:string,
    point:string,
    rank:number,
}

type UserRanking={
    total:number,
    page:number,
    limit:number,
    total_page:number,
    users:User[],
}
const RankingPage =()=>{

    const defautUser:User={
        user_id: " - ",
        username:" - ",
        point:" 0 ",
        rank: -1 ,
    }
    const {user_id}=useAuthHook();
    const [userRanking,setUserRanking]=useState<UserRanking>();//all users as a Array
    const [user,setUser]=useState<User>(defautUser); //singel User
    const [page,setPage] = useState(1);    // page Nr
    const [limit,setLimit] = useState(10);  // each page show limit User
    const [total,setTotal]=useState<number>(100); //total
    const totalPages = userRanking?.total_page || 1;
    const[loading,setLoading]=useState<boolean>(false);
    const [ranking,setRanking]=useState<number>();
    const [getRankingError,setGetRankingError]=useState<string>("");
    const [privateUserError,setPrivateUserError]=useState<string>("");

    const navigat = useNavigate();
    const url="http://127.0.0.1:8000"

    useEffect(() => {
        setLoading(true);
        get_users(page,limit)

    }, [page,limit]);
    useEffect(() => {
        setLoading(true);
        get_user(user_id);
    }, []);

    const get_users=async (page=1,limit=10) => {
        try{
            const response = await axios.get<UserRanking>(url+"/users/get_all_user_after_order",
                {params:{page:page,limit:limit}});
            const usersR:UserRanking = {
                total:response.data.total,
                page:response.data.page,
                limit:response.data.limit,
                users:response.data.users,
                total_page:response.data.total_page,
            };
            setUserRanking(usersR);
            console.log("usersR[]:",usersR.users);
        }catch(error:any){
            setGetRankingError("get Ranking Error: "+(error.message || "Unknown error"))
        } finally {
            setLoading(false);
        }
    }

    const get_user=async (user_id:string) => {
        try {
            const response = await axios.get(url+`/users/get_user`,{params:{user_id:user_id}});
            console.log("user:",response.data)
            const re = await axios.get(url+`/users/get_user_rank`,{params:{user_id:user_id}})
            const responseUser: User = {
                user_id: response.data.user_id,
                username: response.data.username,
                point: response.data.point,
                rank: re.data.rank,
            };
            setUser(responseUser);

            console.log(re.data)
            setRanking(re.data)

        }catch (e:any) {
            setPrivateUserError("get private User Error: "+(e.message || "Unknown error"));
        }
    }



    return (
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",overflowY: "auto",}}>
            <Box sx={styles.personInfo}>
                <Typography variant="h6" sx={{marginLeft: "2%", fontWeight: "bold"}}>User
                    Name: {user.username }</Typography>
                <Typography variant="h6" sx={{marginLeft: "auto", fontWeight: "bold"}}>My
                    Ranking: {user.rank!== -1 ? user.rank: "not in Ranking " }</Typography>
                <Typography variant="h6" sx={{marginLeft: "auto", fontWeight: "bold"}}>My
                    Point: { user.point}</Typography>
                <Button sx={{marginLeft: "auto"}}
                        size="large"
                        variant={"outlined"}
                > My Position
                </Button>
                <Button sx={{margin: "0 2% 0 0.5%"}}
                        size="large"
                        variant={"outlined"}>Top</Button>
            </Box>
            <TableContainer component={Paper}
                            sx={{...styles.tableContainer,overflow:"auto"}}>

                <Table stickyHeader sx={{width:'100%',}}>
                    <TableHead >
                        <TableRow sx={{ backgroundColor: "#F1EFEC",//"#abd1e6",
                        }}>
                            <TableCell sx={styles.headerCell(25)}>Ranking</TableCell>
                            <TableCell sx={styles.headerCell(30)}>Username</TableCell>
                            <TableCell sx={styles.headerCell(25)}>Points</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody >
                        {loading ? (
                        <TableRow >
                            <TableCell sx={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                <Box sx={{margin:"auto",textAlign: "center"}}>
                                    <CircularProgress color={"primary"}></CircularProgress>
                                    <Typography variant="h6" sx={{ fontWeight: "bold"}}>
                                        Loading...
                                    </Typography>
                                    {getRankingError  &&
                                        <Alert variant={"filled"} severity="error">{getRankingError}</Alert>
                                    }
                                    {privateUserError  &&
                                        <Alert variant={"filled"} severity="error">{privateUserError}</Alert>
                                    }
                                </Box>
                            </TableCell>
                        </TableRow>
                    ): (
                        userRanking?.users.map((rowUser, index) => (
                            <TableRow key={index+1}
                                      sx={rowUser.user_id=== user_id? {...styles.tableRowHiligh}:{}}
                            >
                                <TableCell >
                                    {(() => {
                                    const rank = rowUser.rank;
                                    if (rank <= 3) {
                                        const color = rank === 1 ? "gold" : rank === 2 ? "silver" : "coral";
                                        return <WorkspacePremiumRoundedIcon sx={{ color }} />;
                                    }
                                    return rank;
                                })()}
                                </TableCell>
                                <TableCell>{rowUser.username}</TableCell>
                                <TableCell>{rowUser.point}</TableCell>
                            </TableRow>
                        ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {userRanking && (
                <Pagination
                    count={totalPages}
                    page={page}
                    sx={{ mt: 2 }}
                    color="primary"
                    onChange={(event,value)=>setPage(value)}/>
            )}
        </Box>
    )
}

const styles={
    tableContainer:{
        backgroundColor: "#FAF6E9",//"#d9e7f1",
        display:"flex",
        flex:1,
        width: "90%",
        maxWidth:"90%",
        maxHeight: 450,
        margin: "0 auto 1% auto",
    },
    personInfo:{
        display:"flex",
        flexDirection:"row",
        alignItems:"baseline",
        justifyContent:"space-between",
        width:'90%',
        height:"30%",
        margin:"0 0 1% 0",
        padding: "1% 0% 1% 0%",
        //border:"1px solid black",
        borderRadius:"10px",
        backgroundColor: "#FAF6E9",
        boxShadow:"0 4px 10px rgba(0, 0, 0, 0.1)"
    },
    headerCell:(width:number) =>({
        width:`${width}%`,
        fontWeight:"bold",
    }),
    loadingZone:{},
    tableRowHiligh:{
        backgroundColor: "#fff3cd",
        fontWeight:"bold",
    }

}

export default RankingPage;