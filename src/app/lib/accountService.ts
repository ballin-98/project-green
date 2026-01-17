import { AccountInfo } from "./types";

export const getAccountsKey = (userId: string) =>
  `/api/accounts?userId=${userId}`;

export const getAccounts = async (userId: string): Promise<AccountInfo[]> => {
  try {
    console.log("Fetching accounts for userId:", userId);

    const response = await fetch(`/api/accounts?userId=${userId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch accounts");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
};

export const addAccount = async (userId: string, nickname: string) => {
  try {
    const response = await fetch(`/api/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        nickname,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create account");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating account:", error);
  }
};

export const updateAccountNickname = async (
  accountId: string,
  nickname: string
) => {
  try {
    const response = await fetch(`/api/accounts`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId,
        nickname,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update account");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating account:", error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteAccount = async (accountId: string): Promise<any> => {
  console.log("calling delete account service with account id: ", accountId);
  try {
    const response = await fetch("/api/accounts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId }), // send in body
    });

    if (!response.ok) {
      throw new Error("Failed to delete account");
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting account:", error);
  }
};
