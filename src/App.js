import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import IndexPage from './pages/IndexPage/IndexPage';
import UserJoinPage from './pages/UserJoinPage/UserJoinPage';
import UserLoginPage from './pages/UserLoginPage/UserLoginPage';
import { instance } from './apis/util/instance';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

function App() {

    const [ refresh, setRefresh ] = useState(false);

    const accessTokenValid = useQuery(
        ["accessTokenValidQuery"], // atom 대신 key 값
        async () => {
            setRefresh(false);
            return await instance.get("/auth/access", {
                params: {
                    accessToken: localStorage.getItem("accessToken")
                } 
            });
        }, {
            enabled: refresh,
            refetchOnWindowFocus: false,
            retry: 0, // 처음에만 로그인 요청을 보내라   
            onSuccess: response => {
                console.log(response);
            }
        }
    ); 

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if(!!accessToken) {
            setRefresh(true);
        }
    }, []);

    return (
        <BrowserRouter>  
            {
                accessTokenValid.isLoading 
                ? 
                    <h1>로딩중...</h1>  // true 일때
                :  
                    accessTokenValid.isSuccess
                ?
                    // false 일때 
                    <Routes>
                        <Route path="/" element={ <IndexPage /> }/>
                        <Route path="/user/join" element={ <UserJoinPage /> }/>
                        <Route path="/user/login" element={ <UserLoginPage /> }/>
                        <Route path="/admin/*" element={ <></> }/>

                        {/* Not Found 구간 */}
                        <Route path="/admin/*" element={ <h1>Not Found</h1> }/>
                        <Route path="*" element={ <h1>Not Found</h1> }/>
                    </Routes>
                :
                    <h1>페이지를 불러오는 중 오류가 발생하였습니다.</h1>
            }
            
        </BrowserRouter>
    );
}

export default App;
