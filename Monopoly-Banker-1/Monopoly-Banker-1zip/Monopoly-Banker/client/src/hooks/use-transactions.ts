import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Create a type for the input based on the route definition
type CreateTransactionInput = z.infer<typeof api.transactions.create.input>;

export function useTransactions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: [api.transactions.list.path],
    queryFn: async () => {
      const res = await fetch(api.transactions.list.path);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return api.transactions.list.responses[200].parse(await res.json());
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: CreateTransactionInput) => {
      const res = await fetch(api.transactions.create.path, {
        method: api.transactions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Invalid transaction");
        }
        throw new Error("Failed to process transaction");
      }
      return api.transactions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate both transactions list AND players list (balances changed)
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.players.list.path] });
      toast({ title: "Success!", description: "Transaction completed." });
    },
    onError: (error) => {
      toast({ 
        title: "Transaction Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  return {
    transactions: transactionsQuery.data ?? [],
    isLoading: transactionsQuery.isLoading,
    createTransaction: createTransactionMutation,
  };
}
