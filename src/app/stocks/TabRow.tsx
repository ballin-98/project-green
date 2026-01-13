"use client";

import { Box } from "@mui/material";
import { AccountInfo } from "../lib/types";
import AccountTab from "./AccountTab";
import { deleteAccount } from "../lib/accountService";

interface TabRowProps {
  accounts: AccountInfo[];
}

export default function TabRow({ accounts }: TabRowProps) {
  return (
    <Box>
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
            onSelect={() => {}}
            onSave={() => {}}
            onDelete={deleteAccount}
          />
        ))}
      </Box>
    </Box>
  );
}
