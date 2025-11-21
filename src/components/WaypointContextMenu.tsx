import { useState } from 'react';
import {
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import type { Waypoint } from '../types';

interface WaypointContextMenuProps {
  waypoint: Waypoint | null;
  anchorPosition: { top: number; left: number } | null;
  onClose: () => void;
  onAddTime: (waypointId: string, minutes: number) => void;
  onRemove: (waypointId: string) => void;
}

export default function WaypointContextMenu({
  waypoint,
  anchorPosition,
  onClose,
  onAddTime,
  onRemove,
}: WaypointContextMenuProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [additionalMinutes, setAdditionalMinutes] = useState('0');

  const handleAddTimeClick = () => {
    if (waypoint) {
      setAdditionalMinutes(waypoint.additionalTime.toString());
      setDialogOpen(true);
    }
    onClose();
  };

  const handleRemoveClick = () => {
    if (waypoint) {
      onRemove(waypoint.id);
    }
    onClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setAdditionalMinutes('0');
  };

  const handleDialogSubmit = () => {
    if (waypoint) {
      const minutes = parseFloat(additionalMinutes);
      if (!isNaN(minutes) && minutes >= 0) {
        onAddTime(waypoint.id, minutes);
      }
    }
    handleDialogClose();
  };

  return (
    <>
      <Menu
        open={Boolean(anchorPosition)}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition || undefined}
      >
        <MenuItem onClick={handleAddTimeClick}>
          {waypoint?.additionalTime ? 'Edit Additional Time' : 'Add Additional Time'}
        </MenuItem>
        <MenuItem onClick={handleRemoveClick} sx={{ color: 'error.main' }}>
          Remove Waypoint
        </MenuItem>
      </Menu>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {waypoint?.additionalTime ? 'Edit Additional Time' : 'Add Additional Time'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Additional Time (minutes)"
            type="number"
            fullWidth
            value={additionalMinutes}
            onChange={(e) => setAdditionalMinutes(e.target.value)}
            inputProps={{ min: 0, step: 1 }}
            helperText="Time to pause at this location before continuing"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
