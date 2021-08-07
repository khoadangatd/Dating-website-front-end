import React, { useState } from 'react';
import './Criteria.css';
import Heartblue from '../../assets/img/heartsblue.png';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import CallApi from '../../helper/axiosClient';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import * as actions from '../../actions';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 300,
    },
    formControl: {
        minWidth: 120,
    },
}));

const PrettoSlider = withStyles({
    root: {
        color: '#52af77',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);

const Criteria = (props) => {
    const { user } = props
    const [age, setAge] = useState(user.data.setting.age);
    const [gender,setGender] =useState(user.data.setting.gender);
    const dispatch= useDispatch();
    const classes = useStyles();
    const handleChange = (event, newValue) => {
        setAge(newValue);
    };
    async function onSubmitEditForm(){
        var form ={
            age,
            gender
        }
        try{
            const data=await CallApi({
                url:`http://localhost/users/setting`,
                method:`put`,
                data: form,
            })
            dispatch(actions.FetchLoginUser())
            toast.success(data.message);
            // toast.success(data.submessage);
        }
        catch{
            toast.error("Có lỗi gì đó!");
        }
    }
    function onHandleChange(e){
        setGender(e.target.value);
    }
    return (
        <div className="criteria">
            <div className="criteria-main row">
                <div className="criteria-main--part col-lg-6">
                    <h3 className="criteria--title">Cài đặt tìm kiếm</h3>
                    <Typography id="range-slider" gutterBottom>
                        <div className="criteria--age">
                            <p className="criteria--content">Độ tuổi</p>
                            <p className="criteria--content">{age[0]}<i class="fas fa-arrow-right"></i>{age[1]} tuổi</p>
                        </div>
                    </Typography>
                    <PrettoSlider
                        value={age}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                    />
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="grouped-select">
                            <p className="criteria--content">Giới tính </p>
                        </InputLabel>
                        <Select defaultValue={gender} onChange={onHandleChange} value={gender} id="grouped-select" className="criteria-gender">
                            <MenuItem value="Nam">Nam</MenuItem>
                            <MenuItem value="Nữ">Nữ</MenuItem>
                        </Select>
                    </FormControl>
                    <div className="criteria--submit">
                        <button className="criteria--submit--btn" onClick={onSubmitEditForm}>Lưu</button>
                    </div>
                </div>
                <div className="criteria-main--part col-lg-6">
                    <img src={Heartblue} alt="heartblue" className="criteria--img"></img>
                </div>
            </div>
        </div>
    );
};

export default Criteria;
