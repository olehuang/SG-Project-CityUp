import React, {useState,useEffect,useRef} from "react";
import Paper from '@mui/material/Paper';
import {useAuthHook} from "../components/AuthProvider";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Pagination from '@mui/material/Pagination'; //
import { useTheme, useMediaQuery } from '@mui/material';//
import {
    Box, Typography, CircularProgress, Alert,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Card, CardContent, Grid,Button
} from '@mui/material';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import pageBackgroundStyles from "./pageBackgroundStyles";

import { useTranslation } from 'react-i18next';
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
    const theme = useTheme();//
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); //
    const top3 = userRanking?.users.slice(0, 3) || [];//
    const restUsers = userRanking?.users.slice(3) || [];//

    const { t } = useTranslation();
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
            setGetRankingError(t("ranking.getRankingError")+(error.message || t("ranking.unknownError")))
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
            setPrivateUserError(t("ranking.getUserError")+(e.message || t("ranking.unknownError")));
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
        <Box sx={{
            ...pageBackgroundStyles.container,
            ...styles.pages,
        }}>
            <Box sx={{
                ...styles.personInfo,
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                //textAlign: { xs: "left", sm: "baseline" },

            }}>
                <Typography variant="h6" sx={{
                    fontWeight: "bold",
                    mb:{xs:0,sm:{}},
                    mt:0,
                    maxWidth: { xs: "180px", sm: "250px" },
                    textOverflow: "ellipsis",
                    marginLeft: { xs: 0, sm: "2%" }  // Restore the original marginLeft on the web page
                }}>
                    {/* Display different labels according to screen size */}
                    {isMobile ? t('ranking.userName')+`: ${user.username}` : t('ranking.userName')+`: ${user.username}`}
                </Typography>
                <Typography variant="h6" sx={{
                    fontWeight: "bold",
                    maxWidth: { xs: "180px", sm: "250px" },
                    textOverflow: "ellipsis",
                    margin: { xs: 0, sm: "auto auto auto 17%" }  //  Restore the original marginLeft on the web page
                }}>
                    {t('ranking.myRanking')}: {user.rank !== -1 && +user.point !== 0 ? user.rank : "not in Ranking"}
                </Typography>

                <Box sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm:"" }, //mobile row, website column
                    alignItems: { xs: "flex-start", sm: "center" },
                    width: {xs:"100%",md:"30%"},
                }}>
                <Typography variant="h6" sx={{
                    fontWeight: "bold",
                    //marginLeft: { xs: 0, sm: "auto" }  //  Restore the original marginLeft on the web page
                }}>
                    {t("ranking.myPoint")}: {user.point}
                </Typography>
                <Button
                    size= "small"
                    variant="outlined"
                    sx={{
                        alignSelf: { xs: "flex-end", sm: "center" },
                        visibility: totalPages > 1 ? "visible" : "hidden",
                        //  Restore the original margin Styles on the web page
                        margin: { xs: "0 2% 0 auto", sm: "1% 2% 0.5% auto" },
                    }}
                    onClick={toMyPosition}
                >
                    {showingMyPosition ? t("ranking.top") : t("ranking.myPosition")}
                </Button>
                </Box>
            </Box>

            <TableContainer component={Paper}
                            sx={{
                                ...styles.tableContainer,
                            }}>
                {isMobile ? (
                    <Box
                        sx={{
                            width: '100%',
                            overflowX: 'hidden'           // Disable horizontal scrolling
                        }}
                    >


                        <Table stickyHeader >
                            <TableHead>
                                <TableRow>
                                    <TableCell >{t("ranking.ranking")}</TableCell>
                                    <TableCell >{t("ranking.username")}</TableCell>
                                    <TableCell >{t("ranking.points")}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {usersloading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                                            <Box>
                                                <CircularProgress color="primary" />
                                                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>Loading...</Typography>
                                                {getRankingError && <Alert variant="filled" severity="error">{getRankingError}</Alert>}
                                                {privateUserError && <Alert variant="filled" severity="error">{privateUserError}</Alert>}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    userRanking?.users.map((rowUser, index) => (
                                        <TableRow
                                            key={rowUser.user_id}
                                            sx={rowUser.user_id === user_id ? { ...styles.tableRowHiligh } : {}}
                                            ref={rowUser.user_id === user_id ? myRuf : null}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    {(() => {
                                                        const rank = rowUser.rank;
                                                        if (rank <= 3) {
                                                            const color = rank === 1 ? "gold" : rank === 2 ? "silver" : "coral";
                                                            return (
                                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                    <WorkspacePremiumRoundedIcon sx={{ color, fontSize: 24 }} />
                                                                    {/*<Typography variant="body2" fontWeight="bold">{rank}</Typography>*/}
                                                                </Box>
                                                            );
                                                        }
                                                        return <Typography variant="body2" sx={{marginLeft:"7%"}}>{rank}</Typography>;
                                                    })()}
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{
                                                 maxWidth: 120
                                            }}>
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                    sx={{
                                                        fontWeight: rowUser.rank <= 3 ? "bold" : "normal",
                                                        color: rowUser.rank <= 3 ? "primary.main" : "inherit"
                                                    }}
                                                >
                                                    {rowUser.username}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ fontWeight: rowUser.rank <= 3 ? "bold" : "normal" }}
                                                >
                                                    {rowUser.point}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Box>
                ) : (
                    // Website
                    <Table stickyHeader
                           sx={{width:'100%',}}
                    >
                        <TableHead >
                            <TableRow sx={{ backgroundColor: "#F1EFEC",//"#abd1e6",
                            }}>
                                <TableCell sx={styles.headerCell(25)}>{t("ranking.ranking")}</TableCell>
                                <TableCell sx={styles.headerCell(30)}>{t("ranking.username")}</TableCell>
                                <TableCell sx={styles.headerCell(25)}>{t("ranking.points")}</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody >
                            {usersloading ? (
                                <TableRow >
                                    <TableCell sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center"
                                    }}>
                                        <Box sx={{
                                            margin:"auto",textAlign: "center"}}>
                                            <CircularProgress color={"primary"}></CircularProgress>
                                            <Typography variant="h6" sx={{ fontWeight: "bold",marginLeft:"auto"}}>
                                                {t("ranking.loading")}
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
                                            <Box sx={{
                                                display: "flex",
                                                alignItems:"center",
                                                justifyContent: "flex-start",
                                                //maxHeight:"10%",
                                            }}
                                                 title={rowUser.username}
                                            >
                                                {(() => {
                                                    const rank = rowUser.rank;
                                                    if (rank <= 3) {
                                                        const color = rank === 1 ? "gold" : rank === 2 ? "silver" : "coral";
                                                        return <WorkspacePremiumRoundedIcon sx={{ color }} />;
                                                    }
                                                    return <Typography sx={{marginLeft:"3%"}}>{rank}</Typography>;
                                                })()}</Box>
                                        </TableCell>
                                        <TableCell>{rowUser.username}</TableCell>
                                        <TableCell>{rowUser.point}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
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
    pages:{display: "flex",
        flexDirection: "column",
        justifyContent: "content",
        alignItems: "center",
        overflowY: "hidden",
        overflowX: "hidden",
    },
    tableContainer:{
        backgroundColor: "#FAF6E9",//"#d9e7f1",
        display:"flex",
        //flex:1,
        width: { xs: '100%', sm: '90%' },
        maxHeight: "77%",
        height:"auto",
        margin: "0 auto 1% auto",
        boxShadow:"0 4px 10px rgba(0, 0, 0, 0.1)"
    },
    personInfo:{
        display:"flex",
        justifyContent:"space-between",
        width: { xs: '100%', sm: '90%' },
        height: {xs:"18%",sm:"10%"},
        margin:  "0 0 1% 0",
        maxWidth: { xs: '100%' },
        marginBottom:  { xs: 2 },
        padding: { xs: "0 1rem 1.5rem 1rem", sm: "1% 0% 1% 0%" },
        //border:"1px solid black",
        borderRadius:"10px",
        backgroundColor: "#FAF6E9",
        boxShadow:"0 4px 10px rgba(0, 0, 0, 0.1)"
    },
    headerCell:(width:number) =>({
        width:`${width}%`,
        fontWeight:"bold",
        fontSize: { xs: "1.2rem"},
    }),
    loadingZone:{},
    tableRowHiligh:{
        backgroundColor: "#fff3cd",
        fontWeight:"bold",
    }

}

export default RankingPage;