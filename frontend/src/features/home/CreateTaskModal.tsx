import { Form, Input, Modal, Select } from "antd";
import { TASK_STATUS_OPTIONS } from "../../types";
import type { TaskCreate } from "../../types";

type CreateTaskModalProps = {
  open: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onCreate: (values: TaskCreate) => void;
};

export default function CreateTaskModal({
  open,
  isLoading,
  onCancel,
  onCreate,
}: CreateTaskModalProps) {
  const [form] = Form.useForm<TaskCreate>();

  return (
    <Modal
      title="Create task"
      open={open}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
            form.resetFields();
          })
          .catch(() => null);
      }}
      okText="Create"
      confirmLoading={isLoading}
      destroyOnHidden
    >
      <Form<TaskCreate>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ status: "Open" }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Enter a title" }]}
        >
          <Input placeholder="Task title" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Optional description" rows={4} />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Select
            options={TASK_STATUS_OPTIONS.map((status) => ({
              label: status,
              value: status,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
