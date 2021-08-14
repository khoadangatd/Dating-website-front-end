import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import callApi from '../../helper/axiosClient';
import { toast } from 'react-toastify';
import CountUp from 'react-countup';
import {
    LineChart,
    Line,
    Legend,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

function mergeArrayDetailMonth(temp, detail) {
    var flag = false;
    var month = [];
    for (let i = 0; i < detail.length; i++) {
        if (month.includes(detail[i].month))
            continue;
        for (let j = i + 1; j < detail.length; j++) {
            if (detail[i].month === detail[j].month) {
                temp[detail[i].month - 1] = { ...detail[i], ...detail[j] };
                month.push(detail[i].month);
                flag = true;
                break;
            }
        }
        if (!flag) {
            temp[detail[i].month - 1] = !detail[i].registerFree ? { ...detail[i], registerFree: 0 } : { ...detail[i], registerPremium: 0 };
        }
        flag = false;
    }
    console.log(temp);
    return temp;
}

function mergeArrayGeneralMonth(temp, detail) {
    for (let i = 0; i < detail.length; i++) {
        temp[detail[i].month - 1] = detail[i];
    }
    return temp;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const Dashboard = () => {
    const history = useHistory();
    const [dataUser, setDataUser] = useState(null);
    const [show, setShow] = useState({
        chartFree: true,
        chartPremium: true,
    })
    const [years, setYears] = useState(2021);
    async function getDataUser() {
        try {
            var data = await Promise.all(
                [
                    callApi({
                        url: `https://hape-dating.herokuapp.com/users/registerMonth/${years}`,
                        method: `get`
                    }),
                    callApi({
                        url: `https://hape-dating.herokuapp.com/users/resdetailMonth/${years}`,
                        method: `get`
                    }),
                    callApi({
                        url: `https://hape-dating.herokuapp.com/chats/count/${years}`,
                        method: `get`
                    }),
                ]
            );
            var detail;
            detail = [...data[1].UserFrees, ...data[1].UserPres];
            var dataDetail = [];
            var dataGeneral = [];
            for (let i = 1; i <= 12; i++) {
                dataDetail.push({
                    month: i,
                    registerPremium: 0,
                    registerFree: 0,
                })
                dataGeneral.push({
                    month: i,
                    register: 0,
                })
            }
            data[0] = {
                ...data[0],
                MixUser: mergeArrayGeneralMonth(dataGeneral, data[0].ResbyMonth)
            }
            data[1] = {
                ...data[1],
                MixUser: mergeArrayDetailMonth(dataDetail, detail)
            }
            // Data circle
            data.push({
                dataCircle: [
                    {
                        name: "Total Premium",
                        value: data[1].totalUserPres
                    },
                    {
                        name: "Total Free",
                        value: data[1].totalUserFrees
                    },
                    {
                        name: "Total User",
                        value: data[0].total
                    },
                    {
                        name: "Total Interact",
                        value: data[2].data
                    }
                ]
            })
            console.log(data);
            return data;
        }
        catch (error) {
            toast.error(error.response.data.message);
            history.push("/discovery");
        }
    }

    function caculateUser(dataUser,registers1,registers2) {
        console.log(dataUser);
        // if(dataUser[dataUser.length - 1].month!=dataUser[dataUser.length-2].month+1){
        //     return 0
        // }
        return ((registers1/registers2)-1)*100
    }

    useEffect(() => {
        let mounted = true;
        if (mounted)
            getDataUser().then(data => {
                console.log(data);
                if (mounted === true)
                    setDataUser(data);
            });
        return () => mounted = false;
    }, [years])// eslint-disable-line react-hooks/exhaustive-deps

    return dataUser && (
        <div className="main-manage">
            <div className="manage row">
                <div className="col-lg-6">
                    <div className="manage__item">
                        <div className="manage__item--head">
                            <div className="manage__item--head--title">
                                <i className="fas fa-place-of-worship"></i>
                                BÁO CÁO NGƯỜI DÙNG SỬ DỤNG
                            </div>
                            <div className="manage__item--head--btn">
                                <button type="button" className={show.chartFree ? "manage__item--head--btn--current" : "manage__item--head--btn--sub"} onClick={() => setShow({ ...show, chartFree: true })}>
                                    Biểu đồ</button>
                                <button type="button" className={!show.chartFree ? "manage__item--head--btn--current" : "manage__item--head--btn--sub"} onClick={() => setShow({ ...show, chartFree: false })}>
                                    Chi tiết</button>
                            </div>
                        </div>
                        <div className="manage-classified-by-year">
                            <button
                                className={years === 2021 ? "manage__item--head--btn--current" : "manage__item--head--btn--sub"}
                                onClick={() => setYears(2021)}
                            >2021</button>
                            <button
                                className={years === 2022 ? "manage__item--head--btn--current" : "manage__item--head--btn--sub"}
                                onClick={() => setYears(2022)}
                            >2022</button>
                            <button
                                className={years === 2023 ? "manage__item--head--btn--current" : "manage__item--head--btn--sub"}
                                onClick={() => setYears(2023)}
                            >2023</button>
                        </div>
                        {show.chartFree ?
                            <div className="manage--chart">
                                <p className="manage--chart--descript">Số lượng người dùng đăng ký HAPE</p>
                                <ResponsiveContainer height={200}>
                                    <AreaChart
                                        data={dataUser[0].MixUser}
                                        margin={{
                                            top: 5,
                                            right: 0,
                                            left: 0,
                                            bottom: 5
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="register" stroke="#8884d8" fill="#8884d8" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div> :
                            <div className="manage--chart">
                                <p className="manage--chart--descript">Số lượng người dùng free và premium</p>
                                <ResponsiveContainer height={200}>
                                    <LineChart
                                        data={dataUser[1].MixUser}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="registerFree"
                                            stroke="#8884d8"
                                            activeDot={{ r: 8 }}
                                        />
                                        <Line type="monotone" dataKey="registerPremium" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        }
                        <div className="manage--chart">
                            <ResponsiveContainer height={200}>
                                <PieChart >
                                    <Pie
                                        data={dataUser[3].dataCircle}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {dataUser[3].dataCircle.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="management--data management--data--1">
                                <div className="icon-wrapper management--data--circle">
                                    <div className="management--data--circle--overlay">
                                        <i class="fas fa-users"></i>
                                    </div>
                                </div>
                                <div className="management--data-numbers">
                                    <CountUp
                                        end={dataUser[0].total - 1 < 0 ? 0 : dataUser[0].total - 1}
                                        duration={Math.ceil((dataUser[0].total - 1 < 0 ? 0 : dataUser[0].total - 1) / 100)}
                                    />
                                </div>
                                <div className="management--data-subheading">
                                    Lượt đăng ký
                                </div>
                                <div className="management--data-description">
                                    <span className="pl-1">

                                        {dataUser[0].ResbyMonth.length > 1 ?
                                            caculateUser(dataUser[0].ResbyMonth,dataUser[0].ResbyMonth[dataUser[0].ResbyMonth.length - 1].register,
                                                dataUser[0].ResbyMonth[dataUser[0].ResbyMonth.length - 2].register
                                            ) > 0 ?
                                                [<i class="fas fa-arrow-up" key={1}></i>,
                                                Math.abs(caculateUser(dataUser[0].ResbyMonth,dataUser[0].ResbyMonth[dataUser[0].ResbyMonth.length - 1].register,
                                                    dataUser[0].ResbyMonth[dataUser[0].ResbyMonth.length - 2].register
                                                ))] :
                                                [<i class="fas fa-arrow-down" key={1}></i>,
                                                Math.abs(caculateUser(dataUser[0].ResbyMonth,dataUser[0].ResbyMonth[dataUser[0].ResbyMonth.length - 1].register,
                                                    dataUser[0].ResbyMonth[dataUser[0].ResbyMonth.length - 2].register
                                                ))] : 0
                                        }
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="management--data management--data--2">
                                <div className="icon-wrapper management--data--circle">
                                    <div className="management--data--circle--overlay">
                                        <i class="fas fa-crown"></i>
                                    </div>
                                </div>
                                <div className="management--data-numbers">
                                    <CountUp
                                        end={dataUser[1].totalUserPres}
                                        duration={Math.ceil(dataUser[1].totalUserPres / 100)}
                                    />
                                </div>
                                <div className="management--data-subheading">
                                    Lượt đăng ký premium
                                </div>
                                <div className="management--data-description">
                                    <span className="pl-1">
                                        {dataUser[1].UserPres.length > 1 ?
                                            caculateUser(dataUser[1].UserPres,dataUser[1].UserPres[dataUser[1].UserPres.length - 1].registerPremium,
                                                dataUser[1].UserPres[dataUser[1].UserPres.length - 2].registerPremium
                                            ) > 0 ?
                                                [<i class="fas fa-arrow-up" key={1}></i>,
                                                Math.abs(caculateUser(dataUser[1].UserPres,dataUser[1].UserPres[dataUser[1].UserPres.length - 1].registerPremium,
                                                    dataUser[1].UserPres[dataUser[1].UserPres.length - 2].registerPremium
                                                ))] :
                                                [<i class="fas fa-arrow-down" key={1}></i>,
                                                Math.abs(caculateUser(dataUser[1].UserPres,dataUser[1].UserPres[dataUser[1].UserPres.length - 1].registerPremium,
                                                    dataUser[1].UserPres[dataUser[1].UserPres.length - 2].registerPremium
                                                ))] : 0
                                        }
                                        %</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="management--data management--data--3">
                                <div className="icon-wrapper management--data--circle">
                                    <div className="management--data--circle--overlay">
                                        <i class="fas fa-address-card"></i>
                                    </div>
                                </div>
                                <div className="management--data-numbers">
                                    <CountUp
                                        end={dataUser[1].totalUserFrees}
                                        duration={Math.ceil(dataUser[1].totalUserFrees / 100)}
                                    />
                                </div>
                                <div className="management--data-subheading">
                                    Lượt đăng ký miễn phí
                                </div>
                                <div className="management--data-description">
                                    <span className="pl-1">
                                        {dataUser[1].UserFrees.length > 1 ?
                                            caculateUser(dataUser[1].UserFrees,dataUser[1].UserFrees[dataUser[1].UserFrees.length - 1].registerFree,
                                                dataUser[1].UserFrees[dataUser[1].UserFrees.length - 2].registerFree
                                            ) > 0 ?
                                                [<i class="fas fa-arrow-up" key={1}></i>,
                                                Math.abs(caculateUser(dataUser[1].UserFrees,dataUser[1].UserFrees[dataUser[1].UserFrees.length - 1].registerFree,
                                                    dataUser[1].UserFrees[dataUser[1].UserFrees.length - 2].registerFree
                                                ))] :
                                                [<i class="fas fa-arrow-down" key={1}></i>,
                                                Math.abs(caculateUser(dataUser[1].UserFrees,dataUser[1].UserFrees[dataUser[1].UserFrees.length - 1].registerFree,
                                                    dataUser[1].UserFrees[dataUser[1].UserFrees.length - 2].registerFree
                                                ))] : 0
                                        }
                                        %</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="management--data management--data--4">
                                <div className="icon-wrapper management--data--circle">
                                    <div className="management--data--circle--overlay">
                                        <i class="fas fa-comments"></i>
                                    </div>
                                </div>
                                <div className="management--data-numbers">
                                    <CountUp
                                        end={dataUser[2].data}
                                        duration={Math.ceil(dataUser[2].data / 100)}
                                    />
                                </div>
                                <div className="management--data-subheading">
                                    Lượt tương tác
                                </div>
                                <div className="management--data-description">
                                    <span className="pl-1">Tốt</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;
