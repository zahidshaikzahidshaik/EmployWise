import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Pagination,
  CircularProgress,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ExitToApp as LogoutIcon } from '@mui/icons-material';
import { userService } from '../services/api';
import { removeToken } from '../utils/auth';
// @ts-ignore
import EditUser from '../components/EditUser';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface ApiResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response: ApiResponse = await userService.getUsers(pageNumber);
      setUsers(response.data);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
  };

  const handleCloseEdit = () => {
    setEditUser(null);
  };

  const handleUserUpdate = async (updatedUser: Partial<User>) => {
    if (!editUser) return;
    
    try {
      await userService.updateUser(editUser.id, updatedUser);
      // Update the user in the list
      setUsers(users.map(user => 
        user.id === editUser.id ? { ...user, ...updatedUser } : user
      ));
      setEditUser(null);
    } catch (err) {
      console.error('Failed to update user', err);
    }
  };

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete === null) return;
    
    try {
      await userService.deleteUser(userToDelete);
      // Remove the user from the list
      setUsers(users.filter(user => user.id !== userToDelete));
      setDeleteConfirmOpen(false);
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Box mb={4}>
        <TextField
          fullWidth
          label="Search users"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {error && (
        <Box sx={{ mb: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3,
        justifyContent: 'flex-start'
      }}>
        {filteredUsers.map((user) => (
          <Card 
            key={user.id}
            sx={{ 
              width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' },
              display: 'flex', 
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <CardMedia
              component="img"
              image={user.avatar}
              alt={`${user.first_name} ${user.last_name}`}
              sx={{ height: 140, objectFit: 'contain', bgcolor: '#f5f5f5', pt: 2 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div">
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton color="primary" onClick={() => handleEdit(user)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleDeleteClick(user.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
        />
      </Box>

      {/* Edit User Dialog */}
      {editUser && (
        <EditUser 
          user={editUser} 
          open={!!editUser} 
          onClose={handleCloseEdit} 
          onSave={handleUserUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users; 