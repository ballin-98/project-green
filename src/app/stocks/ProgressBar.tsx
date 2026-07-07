"use client";

import { LinearProgress, Box, Typography, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import EditNumberDialog from "./editGoalModal";
import { useState } from "react";
import { updateGoal } from "../lib/stockService";
import { useUser } from "../context/UserContext";
import { useSearchParams } from "next/navigation";

export interface ProgressBarProps {
  current: number;
  goal: number;
  label: string;
  onGoalUpdate: () => Promise<void>;
}

export default function ProgressBar({
  current,
  goal,
  label,
  onGoalUpdate,
}: ProgressBarProps) {
  const value = (current / goal) * 100 || 0;
  const [modalOpen, setModalOpen] = useState(false);

  const { user } = useUser();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");

  const handleUpdateGoal = async (newGoal: number) => {
    const goalField =
      label.toLowerCase() === "yearly goal" ? "longTermGoal" : "shortTermGoal";
    await updateGoal(user?.id ?? "", goalField, newGoal, accountId ?? "");
    await onGoalUpdate();
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 300,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 1,
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: "text.secondary",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
        <IconButton onClick={handleOpen} size="small">
          <Edit fontSize="small" />
        </IconButton>
        <EditNumberDialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          value={goal}
          onSave={handleUpdateGoal}
        />
      </Box>

      {/* Progress bar with side numbers */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Start value */}
        <Typography variant="body2" sx={{ mr: 1 }}>
          $0
        </Typography>

        {/* Bar container */}
        <Box sx={{ position: "relative", width: "80%" }}>
          <LinearProgress
            variant="determinate"
            value={value}
            sx={{
              height: 30,
              borderRadius: 6,
              backgroundColor: "#E0E0E0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#1976d2",
              },
            }}
          />
        </Box>

        {/* End value */}
        <Typography variant="body2" sx={{ ml: 1 }}>
          ${goal.toFixed(0)}
        </Typography>
      </Box>
    </Box>
  );
}
