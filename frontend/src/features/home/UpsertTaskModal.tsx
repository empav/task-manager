import { Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import { TASK_STATUS_OPTIONS } from "../../types";
import type { TaskCreate } from "../../types";

type UpsertTaskModalProps = {
  open: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (values: TaskCreate) => void | Promise<void>;
  mode?: "create" | "edit";
  initialValues?: Partial<TaskCreate>;
};

export default function UpsertTaskModal({
  open,
  isLoading,
  onCancel,
  onSubmit,
  mode = "create",
  initialValues,
}: UpsertTaskModalProps) {
  const [form] = Form.useForm<TaskCreate>();
  const isEditMode = mode === "edit";

  useEffect(() => {
    if (!open) return;
    if (isEditMode) {
      form.setFieldsValue({
        title: initialValues?.title ?? "",
        description: initialValues?.description ?? undefined,
        status: initialValues?.status ?? "Open",
      });
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      status: "Open",
      ...initialValues,
    });
  }, [form, initialValues, isEditMode, open]);

  return (
    <Modal
      title={isEditMode ? "Edit task" : "Create task"}
      open={open}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) =>
            Promise.resolve(onSubmit(values)).then(() => {
              if (!isEditMode) {
                form.resetFields();
              }
            }),
          )
          .catch(() => null);
      }}
      okText={isEditMode ? "Save" : "Create"}
      confirmLoading={isLoading}
      destroyOnHidden
    >
      <Form<TaskCreate>
        form={form}
        layout="vertical"
        requiredMark={false}
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
