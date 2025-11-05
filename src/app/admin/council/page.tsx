'use client';

import { useState } from 'react';
import { Edit2, Trash2, Plus, Upload } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/admin/Button';
import { Modal } from '@/components/admin/Modal';
import { FormInput, FormSelect, FormFileInput } from '@/components/admin/FormComponents';
import { Toast, useToast } from '@/components/admin/Toast';
import { useForm } from '@/hooks/useForm';
import { useCRUD } from '@/hooks/useCRUD';

interface CouncilMemberFormData {
  name: string;
  role: string;
  email: string;
  phone: string;
  photoUrl: string;
  bio: string;
}

interface CouncilMember extends CouncilMemberFormData {
  id: string;
}

const INITIAL_MEMBERS: CouncilMember[] = [
  {
    id: '1',
    name: 'Jane Doe',
    role: 'President',
    email: 'jane@strathmore.ac.ke',
    phone: '+254 712 345 678',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'Passionate about mental health advocacy',
  },
  {
    id: '2',
    name: 'John Smith',
    role: 'Vice President',
    email: 'john@strathmore.ac.ke',
    phone: '+254 712 345 679',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Events coordinator and community builder',
  },
];

const INITIAL_FORM_STATE: CouncilMemberFormData = {
  name: '',
  role: '',
  email: '',
  phone: '',
  photoUrl: '',
  bio: '',
};

const ROLES = [
  { value: 'president', label: 'President' },
  { value: 'vice-president', label: 'Vice President' },
  { value: 'treasurer', label: 'Treasurer' },
  { value: 'secretary', label: 'Secretary' },
  { value: 'event-coordinator', label: 'Event Coordinator' },
  { value: 'member', label: 'Member' },
];

export default function CouncilManagement() {
  const [state, actions] = useCRUD<CouncilMember>(INITIAL_MEMBERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const { messages, addToast, removeToast } = useToast();

  const validateForm = (values: CouncilMemberFormData) => {
    const errors: Partial<Record<keyof CouncilMemberFormData, string>> = {};
    if (!values.name.trim()) errors.name = 'Name is required';
    if (!values.role) errors.role = 'Role is required';
    if (!values.email.trim()) errors.email = 'Email is required';
    if (values.email && !isValidEmail(values.email))
      errors.email = 'Invalid email format';
    if (!values.phone.trim()) errors.phone = 'Phone is required';
    return errors;
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const form = useForm<CouncilMemberFormData>(
    INITIAL_FORM_STATE,
    handleSubmitForm,
    validateForm
  );

  function handleSubmitForm(values: CouncilMemberFormData) {
    try {
      if (editingId) {
        actions.updateItem(editingId, values);
        addToast('Member updated successfully', 'success');
      } else {
        const newMember: CouncilMember = {
          id: Math.random().toString(36).substr(2, 9),
          ...values,
        };
        actions.addItem(newMember);
        addToast('Member added successfully', 'success');
      }
      setIsModalOpen(false);
      form.reset();
      setEditingId(null);
      setPreviewPhoto(null);
    } catch (error) {
      addToast('Failed to save member', 'error');
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewPhoto(result);
        form.setFieldValue('photoUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (member: CouncilMember) => {
    setEditingId(member.id);
    form.setValues(member);
    setPreviewPhoto(member.photoUrl);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      actions.deleteItem(id);
      addToast('Member deleted successfully', 'success');
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.reset();
    setPreviewPhoto(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.reset();
    setPreviewPhoto(null);
  };

  const getRoleLabel = (value: string) => {
    return ROLES.find((role) => role.value === value)?.label || value;
  };

  return (
    <>
      <PageHeader
        title="Council Members"
        description="Manage council member profiles and information"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleAddNew}
          >
            Add Member
          </Button>
        }
      />

      <Toast messages={messages} onRemove={removeToast} />

      {/* Members Grid */}
      {state.items.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No members yet
          </h3>
          <p className="text-gray-600 mb-6">Add council members to get started</p>
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleAddNew}
          >
            Add Your First Member
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.items.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Photo */}
              <div className="h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://via.placeholder.com/300x200?text=No+Photo';
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-semibold text-su-blue mb-3">
                  {getRoleLabel(member.role)}
                </p>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Email:</span> {member.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {member.phone}
                  </p>
                </div>

                {member.bio && (
                  <p className="text-sm text-gray-600 mb-4 italic">
                    "{member.bio}"
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Edit2 className="w-4 h-4" />}
                    fullWidth
                    onClick={() => handleEdit(member)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    fullWidth
                    onClick={() => handleDelete(member.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Edit Member' : 'Add New Member'}
        size="lg"
      >
        <form onSubmit={form.handleSubmit} className="space-y-4">
          {/* Photo Preview */}
          {previewPhoto && (
            <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden mx-auto w-40">
              <img
                src={previewPhoto}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <FormFileInput
            label="Profile Photo"
            onChange={handleFileUpload}
            accept="image/*"
          />

          <FormInput
            label="Full Name"
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={
              form.touched.name && form.errors.name ? form.errors.name : undefined
            }
            placeholder="e.g., Jane Doe"
          />

          <FormSelect
            label="Role"
            name="role"
            value={form.values.role}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={
              form.touched.role && form.errors.role ? form.errors.role : undefined
            }
            options={ROLES}
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={form.values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={
              form.touched.email && form.errors.email
                ? form.errors.email
                : undefined
            }
            placeholder="member@strathmore.ac.ke"
          />

          <FormInput
            label="Phone Number"
            name="phone"
            value={form.values.phone}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={
              form.touched.phone && form.errors.phone
                ? form.errors.phone
                : undefined
            }
            placeholder="+254 712 345 678"
          />

          <FormInput
            label="Bio (Optional)"
            name="bio"
            value={form.values.bio}
            onChange={form.handleChange}
            placeholder="A brief bio or quote"
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
              {editingId ? 'Update Member' : 'Add Member'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
