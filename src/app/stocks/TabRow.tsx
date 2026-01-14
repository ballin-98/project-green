"use client";

import { Box } from "@mui/material";
import { AccountInfo } from "../lib/types";
import AccountTab from "./AccountTab";
import { deleteAccount } from "../lib/accountService";

interface TabRowProps {
  accounts: AccountInfo[];
  onSelect: () => void;
}

export default function TabRow({ accounts, onSelect }: TabRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "flex-start",
        width: "100%",
      }}
    >
      {accounts.map((account, index) => (
        <AccountTab
          key={index}
          accountName={account.nickname ?? "Unnamed Account"}
          accountId={account.id}
          isActive={index === 0}
          //   this needs to be passed in and it's going to act like a filter
          onSelect={onSelect}
          onDelete={deleteAccount}
        />
      ))}
      {/* <IconButton size="small" sx={{ ml: 1 }}>
        <Add fontSize="small" onClick={async () => await handleAdd()} />
      </IconButton> */}
    </Box>
  );
}
