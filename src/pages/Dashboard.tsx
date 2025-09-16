import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskCard } from '@/components/tasks/TaskCard';
import { tasksApi, Task, CreateTaskRequest, UpdateTaskRequest, ApiError } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, CheckCircle, Clock, Filter, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      loadTasks();
    }
  }, [token]);

  const loadTasks = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await tasksApi.getTasks(token);
      setTasks(data);
    } catch (error) {
     
        toast({
          title: 'Failed to load tasks',
          description: error.message,
          variant: 'destructive',
        });
     
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskRequest) => {
    if (!token) return;
    
    try {
      setActionLoading('create');
      const newTask = await tasksApi.createTask(token, data);
      setTasks(prev => [newTask, ...prev]);
      setShowCreateForm(false);
      toast({
        title: 'Task created',
        description: 'Your new task has been added successfully.',
      });
    } catch (error) {
      
        toast({
          title: 'Failed to create task',
          description: error.message,
          variant: 'destructive',
        });
    
      throw error;
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateTask = async (data: CreateTaskRequest) => {
    if (!token || !editingTask) return;
    
    try {
      setActionLoading('update');
      const updatedTask = await tasksApi.updateTask(token, editingTask.id, data);
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? updatedTask : task
      ));
      setEditingTask(null);
      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully.',
      });
    } catch (error) {
     
        toast({
          title: 'Failed to update task',
          description: error.message,
          variant: 'destructive',
        });
    
      throw error;
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!token) return;
    
    try {
      setActionLoading(taskId);
      await tasksApi.deleteTask(token, taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: 'Task deleted',
        description: 'The task has been removed from your list.',
      });
    } catch (error) {
     
        toast({
          title: 'Failed to delete task',
          description: error.message,
          variant: 'destructive',
        });
    
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: Task['status']) => {
    if (!token) return;
    
    try {
      setActionLoading(taskId);
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const updatedTask = await tasksApi.updateTask(token, taskId, { status: newStatus });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      toast({
        title: `Task marked as ${newStatus}`,
        description: `The task status has been updated.`,
      });
    } catch (error) {
     
        toast({
          title: 'Failed to update task',
          description: error.message,
          variant: 'destructive',
        });
     
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = async () => {
    if (!token) return;
    
    if (!searchQuery.trim()) {
      toast({
        title: 'Search query required',
        description: 'Please enter a keyword to search for tasks.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setActionLoading('search');
      const results = await tasksApi.searchTasks(token, searchQuery);
      setSearchResults(results);
      setIsSearchMode(true);
    } catch (error) {
      toast({
        title: 'Search failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchMode(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'all') return true;
    return task.status === activeFilter;
  });

  const displayedTasks = isSearchMode ? searchResults : filteredTasks;
  
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  if (loading) {
    return (
      <Layout title="Your Tasks">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 w-32 bg-muted rounded mx-auto mb-4"></div>
              <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Your Tasks">
      <div className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{taskStats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{taskStats.completed}</div>
            </CardContent>
          </Card>
        </div>

        
        {(showCreateForm || editingTask) && (
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setShowCreateForm(false);
              setEditingTask(null);
            }}
            loading={actionLoading === 'create' || actionLoading === 'update'}
            editData={editingTask || undefined}
          />
        )}

        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>
                  {isSearchMode ? `Search results for "${searchQuery}"` : 'Manage your task list'}
                </CardDescription>
              </div>
              {!showCreateForm && !editingTask && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Section */}
            <div className="mb-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search tasks by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={actionLoading === 'search'}
                >
                  <Search className="h-4 w-4" />
                </Button>
                {isSearchMode && (
                  <Button 
                    variant="outline" 
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {/* Task Display Section */}
            {isSearchMode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Search Results</h3>
                  <Badge variant="secondary">{displayedTasks.length} found</Badge>
                </div>
                {displayedTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">
                      No tasks found matching "{searchQuery}"
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {displayedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={setEditingTask}
                        onDelete={handleDeleteTask}
                        onToggleStatus={handleToggleStatus}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as typeof activeFilter)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">
                    All Tasks
                    <Badge variant="secondary" className="ml-2">
                      {taskStats.total}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending
                    <Badge variant="secondary" className="ml-2">
                      {taskStats.pending}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed
                    <Badge variant="secondary" className="ml-2">
                      {taskStats.completed}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeFilter} className="mt-6">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground">
                        {activeFilter === 'all' 
                          ? "No tasks yet"
                          : `No ${activeFilter} tasks`
                        }
                      </div>
                      {activeFilter === 'all' && !showCreateForm && (
                        <Button className="mt-4" onClick={() => setShowCreateForm(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={setEditingTask}
                          onDelete={handleDeleteTask}
                          onToggleStatus={handleToggleStatus}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};