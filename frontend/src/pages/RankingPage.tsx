
import {Box, Typography, Container, Button,Dialog, DialogTitle,LinearProgress,Alert} from "@mui/material";
import React, {useState,useEffect,useRef} from "react";

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

/**
 * a class form user, because user ranking in DBMS storage
 * */
type User={
    user_id:string,
    username:string,
    point:string,
    rank:number,
}
/**
 *take backend in frontend storage
 * */
type UserRanking={
    total:number,
    page:number,
    limit:number,
    total_page:number,
    users:User[],
}
/**
 * Ranking page is to show Point System and how,which user in ranking
 * */
const RankingPage =()=>{

    /**default infomation
     * */
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
    const totalPages = userRanking?.total_page || 1; // how many pages will show, default 1
    const [usersloading,setUsersLoading]=useState<boolean>(false); //
    const [userloading,setUserLoading]=useState<boolean>(false); //
    const [ranking,setRanking]=useState<number>();
    const [getRankingError,setGetRankingError]=useState<string>("");
    const [privateUserError,setPrivateUserError]=useState<string>("");

    const myRuf=useRef<HTMLTableRowElement>(null);
    const [scrollToMyRow, setScrollToMyRow]=useState(false);
    const [showingMyPosition,setShowingMyPosition]=useState(false);
    const navigat = useNavigate();
    const url="http://127.0.0.1:8000"

    useEffect(() => {

        get_users(page,limit)
    }, [page,limit]);
    useEffect(() => {
        get_user(user_id);
    }, []);

    /**
     * get all user ranking from DBMS and set all users in UserRanking
     * @param page: actuelle page, default= 1
     * @param limit: how many user in a page to show
     * */
    const get_users=async (page=1,limit=10) => {
        try{
            setUsersLoading(true);
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
        }catch(error:any){
            setGetRankingError("get Ranking Error: "+(error.message || "Unknown error"))
        } finally {
            setUsersLoading(false);
        }
    }

    /**
     * get self user infomation, ranking and put it into local
     * @param user_id: use to take user infomation from DBMS
     * */
    const get_user=async (user_id:string) => {
        try {
            setUserLoading(true)
            const response = await axios.get(url+`/users/get_user`,{params:{user_id:user_id}});

            const re = await axios.get(url+`/users/get_user_rank`,{params:{user_id:user_id}})
            const responseUser: User = {
                user_id: response.data.user_id,
                username: response.data.username,
                point: response.data.point,
                rank: re.data.rank,
            };
            setUser(responseUser);
            setRanking(re.data)

        }catch (e:any) {
            setPrivateUserError("get private User Error: "+(e.message || "Unknown error"));
        }finally {
            setUserLoading(false)
        }
    }

    const checkUserPage =async (page:number,userId:string)=>{
        try {
            const response = await axios.get(url+`/users/get_all_user_after_order`,
                {params:{page,limit}});
            return response.data.users.some((u:User) => u.user_id==userId);
        }catch(error:any){
            return false;
        }
    }

    const toMyPosition = async ()=>{
        if (user.rank==-1) return;
        if (showingMyPosition){//trans back to top/ first page
            setPage(1);
            setScrollToMyRow(true);
            setShowingMyPosition(false);
            return;
        }
        if (totalPages>1){
            const targetPage =  Math.max(1, Math.ceil(user.rank / limit));
            let foundPage = -1;

            if (await checkUserPage(targetPage,user_id)){
                foundPage = targetPage;
            }else {
                if (targetPage > 1 && await checkUserPage(targetPage-1,user_id)){
                    foundPage = targetPage-1;
                }
                else if (targetPage <totalPages && await checkUserPage(targetPage+1,user_id)){
                    foundPage = targetPage+1;
                }
            }
            if(foundPage!==-1){
                setPage(foundPage);
                setScrollToMyRow(true);
                setShowingMyPosition(true);
            }
        }

    }
    useEffect(() => {
        if (scrollToMyRow && !usersloading && myRuf) {
            myRuf.current?.scrollIntoView({behavior: "smooth", block: "center"});
            setScrollToMyRow(false);
        }
    }, [scrollToMyRow, usersloading, userRanking]);

    return (
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",overflowY: "auto",}}>
            <Box sx={styles.personInfo}>
                <Typography variant="h6" sx={{marginLeft: "2%", fontWeight: "bold"}}>User
                    Name: {user.username }</Typography>
                <Typography variant="h6" sx={{marginLeft: "auto", fontWeight: "bold"}}>My
                    Ranking: {user.rank!== -1 && +user.point !== 0 ? user.rank : "not in Ranking " }</Typography>
                <Typography variant="h6" sx={{marginLeft: "auto", fontWeight: "bold"}}>My
                    Point: {user.point}</Typography>
                <Button sx={{margin: "auto 2% 0.5% auto", visibility: totalPages > 1 ? "visible" : "hidden",}}
                        size="large"
                        variant={"outlined"}
                        onClick={toMyPosition}
                > {showingMyPosition ? "Top" : "My Position"}
                </Button>
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
                        {usersloading ? (
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
                                      ref={rowUser.user_id===user_id? myRuf:null}
                            >
                                <TableCell >
                                    <Box sx={{display: "flex", alignItems:"center", justifyContent: "flex-start"}}>
                                    {(() => {
                                    const rank = rowUser.rank;
                                    if (rank <= 3) {
                                        const color = rank === 1 ? "gold" : rank === 2 ? "silver" : "coral";
                                        return <WorkspacePremiumRoundedIcon sx={{ color }} />;
                                    }
                                        return <Typography sx={{marginLeft:"2%"}}>{rank}</Typography>;
                                })()}</Box>
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