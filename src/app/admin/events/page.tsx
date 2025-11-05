'use client';

import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/admin/Button';
import { Table } from '@/components/admin/Table';
import { Modal } from '@/components/admin/Modal';
import { FormInput, FormTextarea } from '@/components/admin/FormComponents';
import { Toast, useToast } from '@/components/admin/Toast';
import { useForm } from '@/hooks/useForm';
import { useCRUD } from '@/hooks/useCRUD';

interface EventFormData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  imageUrl: string;
}

interface Event extends EventFormData {
  id: string;
}

const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Mental Health Awareness Week',
    description: 'A week-long series of events focused on raising awareness',
    location: 'Main Campus',
    startDate: '2025-11-07',
    startTime: '09:00',
    endDate: '2025-11-07',
    endTime: '11:00',
    imageUrl: '',
  },
];

const INITIAL_FORM_STATE: EventFormData = {
  title: '',
  description: '',
  location: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  imageUrl: '',
};

export default function EventsManagement() {
  const [state, actions] = useCRUD<Event>(INITIAL_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { messages, addToast, removeToast } = useToast();

  const validateForm = (values: EventFormData) => {
    const errors: Partial<Record<keyof EventFormData, string>> = {};
    if (!values.title.trim()) errors.title = 'Title is required';
    if (!values.description.trim()) errors.description = 'Description is required';
    if (!values.location.trim()) errors.location = 'Location is required';
    if (!values.startDate) errors.startDate = 'Start date is required';
    if (!values.startTime) errors.startTime = 'Start time is required';
    if (!values.endDate) errors.endDate = 'End date is required';
    if (!values.endTime) errors.endTime = 'End time is required';
    return errors;
  };

  const form = useForm<EventFormData>(INITIAL_FORM_STATE, handleSubmitForm, validateForm);

  function handleSubmitForm(values: EventFormData) {
    try {
      if (editingId) {
        actions.updateItem(editingId, values);
        addToast('Event updated successfully', 'success');
      } else {
        const newEvent: Event = {
          id: Math.random().toString(36).substr(2, 9),
          ...values,
        };
        actions.addItem(newEvent);
        addToast('Event created successfully', 'success');
      }
      setIsModalOpen(false);
      form.reset();
      setEditingId(null);
    } catch (error) {
      addToast('Failed to save event', 'error');
    }
  }

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    form.setValues(event);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      actions.deleteItem(id);
      addToast('Event deleted successfully', 'success');
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

  const columns = [
    { key: 'title', label: 'Title', width: '200px' },
    {
      key: 'startDate',
      label: 'Date',
      render: (value: string, row: Event) =>
        `${value} at ${row.startTime}`,
    },
    {
      key: 'location',
      label: 'Location',
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
        title="Events"
        description="Create and manage upcoming events"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleAddNew}
          >
            New Event
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
        title={editingId ? 'Edit Event' : 'Create New Event'}
        size="lg"
      >
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <FormInput
            label="Event Title"
            name="title"
            value={form.values.title}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.title && form.errors.title ? form.errors.title : undefined}
            placeholder="e.g., Mental Health Awareness Week"
          />

          <FormTextarea
            label="Description"
            name="description"
            value={form.values.description}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.description && form.errors.description ? form.errors.description : undefined}
            placeholder="Describe the event..."
            rows={4}
          />

          <FormInput
            label="Location"
            name="location"
            value={form.values.location}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.location && form.errors.location ? form.errors.location : undefined}
            placeholder="e.g., Main Campus, Student Center"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Date"
              name="startDate"
              type="date"
              value={form.values.startDate}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.startDate && form.errors.startDate ? form.errors.startDate : undefined}
            />
            <FormInput
              label="Start Time"
              name="startTime"
              type="time"
              value={form.values.startTime}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.startTime && form.errors.startTime ? form.errors.startTime : undefined}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="End Date"
              name="endDate"
              type="date"
              value={form.values.endDate}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.endDate && form.errors.endDate ? form.errors.endDate : undefined}
            />
            <FormInput
              label="End Time"
              name="endTime"
              type="time"
              value={form.values.endTime}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.endTime && form.errors.endTime ? form.errors.endTime : undefined}
            />
          </div>

          <FormInput
            label="Image URL (Optional)"
            name="imageUrl"
            type="url"
            value={form.values.imageUrl}
            onChange={form.handleChange}
            placeholder="https://example.com/image.jpg"
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
              {editingId ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
