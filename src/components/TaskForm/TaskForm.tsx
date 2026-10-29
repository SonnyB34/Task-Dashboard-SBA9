import { useEffect, useState } from 'react';
import type { FormErrors, TaskFormData, TaskFormProps } from '../../types';
import { validateTask } from '../../utils/taskUtils';

const emptyForm: TaskFormData = {
    title: '', description: '', priority: 'medium', dueDate: '',
};

export default function TaskForm({ editingTask, onSubmit, onCancel }: TaskFormProps) {
    const [form, setForm] = useState<TaskFormData>(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});

    // When the user clicks "edit" on a task, fill the form with its info.
 useEffect(() => {
    if(editingTask) {
        const { title, description, priority, dueDate } = editingTask;
        setForm({ title, description, priority, dueDate });
    } else {
        setForm(emptyForm);
    }
    setErrors({});
 }, [editingTask]);

 // One function updates and field
 const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
 ) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    // Re-check as they type, but only for fields that already had an error.
    if (errors[name as keyof TaskFormData]) setErrors(validateTask(next));
 };

 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateTask(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // stop if anything is wrong
    onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() });
    if (!editingTask) setForm(emptyForm);
 };

 return (
    <form className="panel form" onSubmit={handleSubmit} noValidate>
        <h2>{editingTask ? 'Edit task' : 'Add a task'}</h2>

        <label>
            Title
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="Complete Project..." aria-invalid={!!errors.title} />
            {errors.title && <span className="error" role="alert">{errors.title}</span>}
        </label>

        <label>
            Description
            <textarea />
        </label>
    </form>
 )
}