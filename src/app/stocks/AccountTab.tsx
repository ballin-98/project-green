"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  accountName: string;
  accountId: string;
  isActive?: boolean;
  onSelect?: () => void;
  onSave?: (newAccountName: string) => void | Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDelete: (accountId: string) => Promise<any>;
};

export default function AccountTab({
  accountName,
  accountId,
  isActive = false,
  onSelect,
  onSave,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(accountName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    if (draft.trim() && draft !== accountName) onSave?.(draft.trim());
    setEditing(false);
  };

  const handleDelete = async () => {
    console.log("trying delete");
    try {
      await onDelete(accountId);
    } catch (error) {
      console.log("Error deleting account:", error);
    }
  };

  return (
    <Box
      sx={{
        minWidth: 120,
        height: 40,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        border: "1px solid",
        borderColor: "grey.300",
        backgroundColor: isActive ? "common.white" : "grey.100",
        borderBottomColor: isActive ? "common.white" : "grey.300",
        cursor: "pointer",
        userSelect: "none",
        fontSize: "0.875rem",
      }}
      onClick={onSelect}
    >
      {editing ? (
        <InputBase
          inputRef={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          sx={{ flexGrow: 1, textAlign: "center" }}
        />
      ) : (
        <Box
          onDoubleClick={() => setEditing(true)}
          sx={{
            flexGrow: 1,
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {accountName}
        </Box>
      )}
      <IconButton size="small" sx={{ ml: 1 }}>
        <CloseIcon
          fontSize="small"
          onClick={async () => await handleDelete()}
        />
      </IconButton>
    </Box>
  );
}
