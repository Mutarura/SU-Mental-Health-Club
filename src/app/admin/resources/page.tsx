'use client';

import { useState } from 'react';
import { Edit2, Trash2, Plus, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/admin/Button';
import { Table } from '@/components/admin/Table';
import { Modal } from '@/components/admin/Modal';
import { FormInput, FormTextarea, FormSelect } from '@/components/admin/FormComponents';
import { Toast, useToast } from '@/components/admin/Toast';
import { useForm } from '@/hooks/useForm';
import { useCRUD } from '@/hooks/useCRUD';

interface ResourceFormData {
  title: string;
  description: string;
  category: string;
  url: string;
  author: string;
}

interface Resource extends ResourceFormData {
  id: string;
}

const INITIAL_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Understanding Anxiety',
    description: 'A comprehensive guide to understanding and managing anxiety disorders',
    category: 'mental-health',
    url: 'https://example.com',
    author: 'Dr. Smith',
  },
  {
    id: '2',
    title: 'Stress Management Techniques',
    description: 'Practical techniques for managing stress in academic life',
    category: 'wellness',
    url: 'https://example.com',
    author: 'Wellness Team',
  },
];

const INITIAL_FORM_STATE: ResourceFormData = {
  title: '',
  description: '',
  category: '',
  url: '',
  author: '',
};

const CATEGORIES = [
  { value: 'mental-health', label: 'Mental Health' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'study-tips', label: 'Study Tips' },
  { value: 'support', label: 'Support Services' },
  { value: 'guide', label: 'Guide' },
];

export default function ResourcesManagement() {
  const [state, actions] = useCRUD<Resource>(INITIAL_RESOURCES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { messages, addToast, removeToast } = useToast();

  const validateForm = (values: ResourceFormData) => {
    const errors: Partial<Record<keyof ResourceFormData, string>> = {};
    if (!values.title.trim()) errors.title = 'Title is required';
    if (!values.description.trim()) errors.description = 'Description is required';
    if (!values.category) errors.category = 'Category is required';
    if (!values.url.trim()) errors.url = 'URL is required';
    if (values.url && !isValidUrl(values.url)) errors.url = 'Invalid URL format';
    if (!values.author.trim()) errors.author = 'Author is required';
    return errors;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const form = useForm<ResourceFormData>(INITIAL_FORM_STATE, handleSubmitForm, validateForm);

  function handleSubmitForm(values: ResourceFormData) {
    try {
      if (editingId) {
        actions.updateItem(editingId, values);
        addToast('Resource updated successfully', 'success');
      } else {
        const newResource: Resource = {
          id: Math.random().toString(36).substr(2, 9),
          ...values,
        };
        actions.addItem(newResource);
        addToast('Resource created successfully', 'success');
      }
      setIsModalOpen(false);
      form.reset();
      setEditingId(null);
    } catch (error) {
      addToast('Failed to save resource', 'error');
    }
  }

  const handleEdit = (resource: Resource) => {
    setEditingId(resource.id);
    form.setValues(resource);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      actions.deleteItem(id);
      addToast('Resource deleted successfully', 'success');
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.reset();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.reset();
  };

  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find((cat) => cat.value === value)?.label || value;
  };

  const columns = [
    { key: 'title', label: 'Title', width: '220px' },
    {
      key: 'category',
      label: 'Category',
      render: (value: string) => (
        <span className="inline-block bg-su-blue/10 text-su-blue px-3 py-1 rounded-full text-sm font-medium">
          {getCategoryLabel(value)}
        </span>
      ),
    },
    {
      key: 'author',
      label: 'Author',
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => (
        <span className="truncate max-w-xs">{value}</span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Resources"
        description="Create and manage support resources for members"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleAddNew}
          >
            New Resource
          </Button>
        }
      />

      <Toast messages={messages} onRemove={removeToast} />

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={state.items}
          actions={(row) => (
            <div className="flex items-center gap-2">
              <a
                href={row.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded transition"
                title="Visit resource"
              >
                <ExternalLink className="w-4 h-4 text-gray-600" />
              </a>
              <Button
                variant="secondary"
                size="sm"
                icon={<Edit2 className="w-4 h-4" />}
                onClick={() => handleEdit(row)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => handleDelete(row.id)}
              >
                Delete
              </Button>
            </div>
          )}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Edit Resource' : 'Create New Resource'}
      >
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <FormInput
            label="Resource Title"
            name="title"
            value={form.values.title}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.title && form.errors.title ? form.errors.title : undefined}
            placeholder="e.g., Understanding Anxiety"
          />

          <FormTextarea
            label="Description"
            name="description"
            value={form.values.description}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.description && form.errors.description ? form.errors.description : undefined}
            placeholder="Describe the resource..."
            rows={4}
          />

          <FormSelect
            label="Category"
            name="category"
            value={form.values.category}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.category && form.errors.category ? form.errors.category : undefined}
            options={CATEGORIES}
          />

          <FormInput
            label="Author/Source"
            name="author"
            value={form.values.author}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.author && form.errors.author ? form.errors.author : undefined}
            placeholder="e.g., Dr. Smith or Mental Health Organization"
          />

          <FormInput
            label="Resource URL"
            name="url"
            type="url"
            value={form.values.url}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.url && form.errors.url ? form.errors.url : undefined}
            placeholder="https://example.com/resource"
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={form.isSubmitting}
              type="submit"
            >
              {editingId ? 'Update Resource' : 'Create Resource'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
