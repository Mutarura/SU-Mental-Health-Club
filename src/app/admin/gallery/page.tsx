'use client';

import { useState } from 'react';
import { Edit2, Trash2, Plus, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/admin/Button';
import { Modal } from '@/components/admin/Modal';
import { FormInput, FormTextarea, FormFileInput } from '@/components/admin/FormComponents';
import { Toast, useToast } from '@/components/admin/Toast';
import { useForm } from '@/hooks/useForm';
import { useCRUD } from '@/hooks/useCRUD';

interface GalleryFormData {
  caption: string;
  description: string;
  imageUrl: string;
  altText: string;
}

interface GalleryImage extends GalleryFormData {
  id: string;
}

const INITIAL_GALLERY: GalleryImage[] = [
  {
    id: '1',
    caption: 'Mental Health Awareness Event',
    description: 'Students gathered for mental health awareness session',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    altText: 'Students in a workshop',
  },
  {
    id: '2',
    caption: 'Peer Support Circle',
    description: 'Weekly peer support gathering',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    altText: 'Group discussion session',
  },
];

const INITIAL_FORM_STATE: GalleryFormData = {
  caption: '',
  description: '',
  imageUrl: '',
  altText: '',
};

export default function GalleryManagement() {
  const [state, actions] = useCRUD<GalleryImage>(INITIAL_GALLERY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const { messages, addToast, removeToast } = useToast();

  const validateForm = (values: GalleryFormData) => {
    const errors: Partial<Record<keyof GalleryFormData, string>> = {};
    if (!values.caption.trim()) errors.caption = 'Caption is required';
    if (!values.imageUrl.trim()) errors.imageUrl = 'Image URL is required';
    if (!values.altText.trim()) errors.altText = 'Alt text is required';
    return errors;
  };

  const form = useForm<GalleryFormData>(INITIAL_FORM_STATE, handleSubmitForm, validateForm);

  function handleSubmitForm(values: GalleryFormData) {
    try {
      if (editingId) {
        actions.updateItem(editingId, values);
        addToast('Image updated successfully', 'success');
      } else {
        const newImage: GalleryImage = {
          id: Math.random().toString(36).substr(2, 9),
          ...values,
        };
        actions.addItem(newImage);
        addToast('Image uploaded successfully', 'success');
      }
      closeModals();
      form.reset();
      setEditingId(null);
      setPreviewFile(null);
    } catch (error) {
      addToast('Failed to save image', 'error');
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewFile(result);
        form.setFieldValue('imageUrl', result);
      };
      reader.readAsDataURL(file);
      addToast('Image selected. Fill in the details below.', 'info');
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingId(image.id);
    form.setValues(image);
    setPreviewFile(image.imageUrl);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      actions.deleteItem(id);
      addToast('Image deleted successfully', 'success');
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.reset();
    setPreviewFile(null);
    setIsUploadOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setIsUploadOpen(false);
  };

  const handleContinueToDetails = () => {
    if (!form.values.imageUrl) {
      addToast('Please select an image first', 'error');
      return;
    }
    setIsUploadOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Upload and manage event photos and media"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleAddNew}
          >
            Upload Image
          </Button>
        }
      />

      <Toast messages={messages} onRemove={removeToast} />

      {/* Gallery Grid */}
      {state.items.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No images yet</h3>
          <p className="text-gray-600 mb-6">Start uploading images to populate your gallery</p>
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleAddNew}
          >
            Upload Your First Image
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.items.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={image.altText}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {image.caption}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {image.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Edit2 className="w-4 h-4" />}
                    fullWidth
                    onClick={() => handleEdit(image)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    fullWidth
                    onClick={() => handleDelete(image.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={closeModals}
        title="Upload Image"
        size="md"
      >
        <div className="space-y-4">
          {/* Preview */}
          {previewFile && (
            <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={previewFile}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewFile(null);
                  form.setFieldValue('imageUrl', '');
                }}
                className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* File Input */}
          <FormFileInput
            label="Select Image"
            onChange={handleFileUpload}
            accept="image/*"
          />

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">Supported formats:</p>
            <p>JPG, PNG, GIF, WebP (Max 5MB)</p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={closeModals}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleContinueToDetails}
              type="button"
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModals}
        title={editingId ? 'Edit Image Details' : 'Image Details'}
        size="lg"
      >
        <div className="space-y-4">
          {previewFile && (
            <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={previewFile}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <form onSubmit={form.handleSubmit} className="space-y-4">
            <FormInput
              label="Caption"
              name="caption"
              value={form.values.caption}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={
                form.touched.caption && form.errors.caption
                  ? form.errors.caption
                  : undefined
              }
              placeholder="Brief caption for the image"
            />

            <FormTextarea
              label="Description (Optional)"
              name="description"
              value={form.values.description}
              onChange={form.handleChange}
              placeholder="Detailed description of the image"
              rows={3}
            />

            <FormInput
              label="Alt Text"
              name="altText"
              value={form.values.altText}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={
                form.touched.altText && form.errors.altText
                  ? form.errors.altText
                  : undefined
              }
              placeholder="Describe the image for accessibility"
            />

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="secondary"
                onClick={closeModals}
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                loading={form.isSubmitting}
                type="submit"
              >
                {editingId ? 'Update Image' : 'Upload Image'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
