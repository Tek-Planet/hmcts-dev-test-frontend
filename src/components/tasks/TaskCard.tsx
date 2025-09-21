import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/services/api';
import { Calendar, Edit, Trash2, Check, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (taskId: string, currentStatus: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) => {
  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-UK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateTimeString;
    }
  };

  const isOverdue = () => {
    const now = new Date();
    const dueDateTime = new Date(task.dueDateTime);
    return dueDateTime < now && task.status === 'pending';
  };

  const getDueDateColor = () => {
    if (task.status === 'completed') return 'text-muted-foreground';
    if (isOverdue()) return 'text-red-600 dark:text-red-400';
    
    const now = new Date();
    const dueDateTime = new Date(task.dueDateTime);
    const diffTime = dueDateTime.getTime() - now.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    
    if (diffHours <= 24) return 'text-orange-600 dark:text-orange-400';
    if (diffHours <= 72) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-muted-foreground';
  };

  return (
    <Card className={`transition-all duration-200 ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className={`text-base sm:text-lg break-words ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant={task.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
              {task.status === 'completed' ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Completed
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </>
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className={`text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {task.description}
        </p>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className={`text-sm font-medium ${getDueDateColor()}`}>
            Due: {formatDateTime(task.dueDateTime)}
            {isOverdue() && ' (Overdue)'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button 
            variant={task.status === 'completed' ? 'outline' : 'success'}
            size="sm"
            onClick={() => onToggleStatus(task.id, task.status)}
            className="flex-1 sm:flex-none"
          >
            {task.status === 'completed' ? (
              <>
                <Clock className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Mark Pending</span>
                <span className="sm:hidden">Pending</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Mark Complete</span>
                <span className="sm:hidden">Complete</span>
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(task)}
            className="flex-1 sm:flex-none"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(task.id)}
            className="flex-1 sm:flex-none"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};