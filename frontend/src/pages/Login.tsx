import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  Space,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import type { ApiError, LoginRequest } from "../types";

import "./Login.css";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm<LoginRequest>();
  const navigate = useNavigate();

  useEffect(() => {
    const existingToken = sessionStorage.getItem("auth_token");
    if (existingToken) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const onFinish = async (values: LoginRequest) => {
    setIsSubmitting(true);
    try {
      const data = await login(values);
      sessionStorage.setItem("auth_token", data.token);
      message.success("Login successful");
      form.resetFields(["password"]);
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      const error = err as ApiError;
      message.error(error.message.join(", "));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout.Content className="login-content">
      <Card className="login-card">
        <Space orientation="vertical" size="large" className="login-space">
          <div>
            <Typography.Title level={3} className="login-title">
              Sign in
            </Typography.Title>
            <Typography.Text type="secondary">
              Enter your credentials
            </Typography.Text>
          </div>

          <Form<LoginRequest>
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Enter a username" }]}
            >
              <Input autoComplete="username" placeholder="admin" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Enter a password" }]}
            >
              <Input.Password
                autoComplete="current-password"
                placeholder="admin"
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              block
            >
              Sign in
            </Button>
          </Form>
        </Space>
      </Card>
    </Layout.Content>
  );
}
