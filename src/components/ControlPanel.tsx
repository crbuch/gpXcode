import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography,
  Divider,
  Stack
} from '@mui/material';
import { Download as DownloadIcon, Clear as ClearIcon } from '@mui/icons-material';

interface ControlPanelProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  waypointCount: number;
  onDownload: () => void;
  onClearRoute: () => void;
}

export default function ControlPanel({
  speed,
  onSpeedChange,
  waypointCount,
  onDownload,
  onClearRoute
}: ControlPanelProps) {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'absolute', 
        top: 16, 
        right: 16, 
        p: 2, 
        zIndex: 1000,
        minWidth: 250,
        maxWidth: 300
      }}
    >
      <Typography variant="h6" gutterBottom>
        GPX Route Creator
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Stack spacing={2}>
        <TextField
          label="Travel Speed (mph)"
          type="number"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          fullWidth
          size="small"
          inputProps={{ min: 0.1, step: 0.1 }}
          helperText="Walking speed: ~3-4 mph"
        />
        
        <Box>
          <Typography variant="body2" color="text.secondary">
            Waypoints: {waypointCount}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={onDownload}
          fullWidth
          disabled={waypointCount === 0}
        >
          Download GPX
        </Button>
        
        <Button
          variant="outlined"
          color="error"
          startIcon={<ClearIcon />}
          onClick={onClearRoute}
          fullWidth
          disabled={waypointCount === 0}
        >
          Clear Route
        </Button>
      </Stack>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="caption" color="text.secondary">
        Click map to add waypoints<br />
        Click waypoint to edit pause time
      </Typography>
    </Paper>
  );
}
