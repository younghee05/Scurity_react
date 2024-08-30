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

    // const [ refresh, setRefresh ] = useState(false);

    const accessTokenValid = useQuery(
        ["accessTokenValidQuery"], // atom 대신 key 값을 넣음 
        async () => {
            // console.log("쿼리에서 요청!!!");
            // setRefresh(false); 
            return await instance.get("/auth/access", {
                params: {
                    accessToken: localStorage.getItem("accessToken")
                } 
            });
        }, {
            // enabled: refresh,
            // refetchOnWindowFocus: false, // 윈도우에 포커스 갔을 때 refetch를 해라
            // retry: 0, // 처음에만 로그인 요청을 보내라 / 재요청
            // // 요청이 성공적으로 보내졌을 때 동작
            retry: 0,
            onSuccess: response => { 
                // console.log("OK에 응답");
                console.log(response.data);
            },
            // 요청을 보냈을 때 error 가 나면 동작
            onError: error => {
                // console.log("오류!!");
                console.error(error);
            }
        }
    ); 

    const userInfo = useQuery(
        ["userInfoQuery"],
        async () => {
            return await instance.get("/user/me")
        },
        {
            enabled: accessTokenValid.isSuccess && accessTokenValid.data?.data, // data?.data 데이터 안에 데이터 값이 존재하면 데이터값을 참조하겠다 
            onSuccess: response => {
                console.log(response)
            },
            onError: error => {

            }
        }
    );

    // console.log("그냥 출력!!");

    useEffect(() => {
        // const accessToken = localStorage.getItem("accessToken");
        // if(!!accessToken) {
        //     setRefresh(true);
        // }
        // console.log("Effect!!!");
    }, [accessTokenValid.data]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <IndexPage /> }/>
                <Route path="/user/join" element={ <UserJoinPage /> }/>
                <Route path="/user/login" element={ <UserLoginPage /> }/>
                <Route path="/admin/*" element={ <></> }/>

                {/* Not Found 구간 */}
                <Route path="/admin/*" element={ <h1>Not Found</h1> }/>
                <Route path="*" element={ <h1>Not Found</h1> }/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
