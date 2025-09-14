import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateTaskRequest, Task } from '@/services/api';
import { X, Plus, Loader2 } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (data: CreateTaskRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  editData?: Task;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
  onSubmit, 
  onCancel, 
  loading = false,
  editData 
}) => {
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    description: editData?.description || '',
    dueDate: editData?.dueDateTime ? editData.dueDateTime.split('T')[0] : '',
    dueTime: editData?.dueDateTime ? editData.dueDateTime.split('T')[1]?.substring(0, 5) : '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.dueTime) {
      newErrors.dueTime = 'Due time is required';
    }

    if (formData.dueDate && formData.dueTime) {
      const selectedDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
      const now = new Date();
      
      if (selectedDateTime < now) {
        newErrors.dueDateTime = 'Due date and time cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const dueDateTime = `${formData.dueDate}T${formData.dueTime}:00.000Z`;
      await onSubmit({
        title: formData.title,
        description: formData.description,
        dueDateTime
      });
    } catch (error) {
      throw error;
    }
  };

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{editData ? 'Edit Task' : 'Create New Task'}</CardTitle>
            <CardDescription>
              {editData ? 'Update your task details' : 'Add a new task to your list'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Task title</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange('title')}
              className={errors.title ? 'border-destructive' : ''}
              disabled={loading}
              placeholder="Task title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange('description')}
              className={errors.description ? 'border-destructive' : ''}
              disabled={loading}
              placeholder="Description"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange('dueDate')}
                className={errors.dueDate ? 'border-destructive' : ''}
                disabled={loading}
              />
              {errors.dueDate && (
                <p className="text-sm text-destructive">{errors.dueDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueTime">Due time</Label>
              <Input
                id="dueTime"
                type="time"
                value={formData.dueTime}
                onChange={handleInputChange('dueTime')}
                className={errors.dueTime ? 'border-destructive' : ''}
                disabled={loading}
              />
              {errors.dueTime && (
                <p className="text-sm text-destructive">{errors.dueTime}</p>
              )}
            </div>
          </div>

          {errors.dueDateTime && (
            <p className="text-sm text-destructive">{errors.dueDateTime}</p>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {editData ? 'Update Task' : 'Create Task'}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};