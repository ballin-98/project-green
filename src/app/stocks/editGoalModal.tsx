import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface EditNumberDialogProps {
  open: boolean;
  onClose: () => void;
  value: number;
  onSave: (newValue: number) => Promise<void>;
  label?: string;
}

export default function EditNumberDialog({
  open,
  onClose,
  value,
  onSave,
  label,
}: EditNumberDialogProps) {
  const [localValue, setLocalValue] = useState(String(value));

  // keep in sync if parent value changes
  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  const handleSave = async () => {
    await onSave(Number(localValue));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit {label}</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={label}
          type="number"
          fullWidth
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
