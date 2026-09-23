import type { ReactNode } from 'react';
import { Button, Drawer, Form } from '../../libs/antd';

interface FormDrawerProps<T extends object> { title: string; open: boolean; initialValues?: T; loading?: boolean; children: ReactNode; onSubmit: (values: T) => void; onClose: () => void; }

const FormDrawer = <T extends object>({ title, open, initialValues, loading = false, children, onSubmit, onClose }: FormDrawerProps<T>) => (
  <Drawer title={title} open={open} onClose={onClose} size="large" destroyOnHidden footer={<div className="drawer-footer"><Button onClick={onClose}>Cancelar</Button><Button type="primary" loading={loading} onClick={() => { void document.querySelector<HTMLButtonElement>('.income-form-submit')?.click(); }}>Guardar</Button></div>}>
    <Form layout="vertical" initialValues={initialValues as Record<string, unknown>} onFinish={(values) => onSubmit(values as T)} className="income-form">{children}<button className="income-form-submit" type="submit" aria-hidden="true" tabIndex={-1} /></Form>
  </Drawer>
);

export default FormDrawer;
