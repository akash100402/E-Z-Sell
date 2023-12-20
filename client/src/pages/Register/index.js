import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import Divider from "../../components/Divider";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";

const rules = [
  {
    required: true,
    message: <span style={{ fontSize: "12px" }}>required</span>,
  },
];


function Register() {
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true));
      const response = await RegisterUser(values);
      
      dispatch(SetLoader(false))
      if(response.success){
        navigate("/login")
        message.success(response.message);
      }else{
        throw new Error(response.message)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error.message);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/")
    }
  },[]);

  return (
    <div id="logReg-bg" className="h-screen bg-gray-900 flex justify-center items-center">
      <div id="logReg-grid" className="bg-white p-5 rounded w-[380px]">
        <h1 className="text-cyan-400 text-2xl">
          E-Z SELL - <span className="text-white text-2xl">REGISTER</span>
        </h1>
        <Divider />
        <Form id="log-reg" layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name" rules={rules}>
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={rules}>
            <Input placeholder="Enter you email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={rules}>
            <Input type="password" placeholder="Enter your password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block className="mt-2">
            Register
          </Button>
          <div className="mt-5 text-center">
            <span className="text-white">
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
                Login
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
