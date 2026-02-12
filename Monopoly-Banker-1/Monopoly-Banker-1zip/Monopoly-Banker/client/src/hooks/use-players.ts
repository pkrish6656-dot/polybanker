import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertPlayer, Player } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function usePlayers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const playersQuery = useQuery({
    queryKey: [api.players.list.path],
    queryFn: async () => {
      const res = await fetch(api.players.list.path);
      if (!res.ok) throw new Error("Failed to fetch players");
      return api.players.list.responses[200].parse(await res.json());
    },
  });

  const createPlayerMutation = useMutation({
    mutationFn: async (data: InsertPlayer) => {
      const res = await fetch(api.players.create.path, {
        method: api.players.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create player");
      return api.players.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.players.list.path] });
      toast({ title: "Joined!", description: "New player added to the game." });
    },
  });

  const updatePlayerMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertPlayer>) => {
      const url = buildUrl(api.players.update.path, { id });
      const res = await fetch(url, {
        method: api.players.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update player");
      return api.players.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.players.list.path] });
    },
  });

  const deletePlayerMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.players.delete.path, { id });
      const res = await fetch(url, { method: api.players.delete.method });
      if (!res.ok) throw new Error("Failed to delete player");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.players.list.path] });
      toast({ title: "Removed", description: "Player removed from the game." });
    },
  });

  const resetGameMutation = useMutation({
    mutationFn: async (startBalance: number = 1500) => {
      const res = await fetch(api.players.reset.path, {
        method: api.players.reset.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startBalance }),
      });
      if (!res.ok) throw new Error("Failed to reset game");
      return api.players.reset.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.players.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] }); // Also clear history conceptually if needed, though API might not clear transactions table
      toast({ title: "New Game!", description: "All balances reset to start amount." });
    },
  });

  return {
    players: playersQuery.data ?? [],
    isLoading: playersQuery.isLoading,
    isError: playersQuery.isError,
    createPlayer: createPlayerMutation,
    updatePlayer: updatePlayerMutation,
    deletePlayer: deletePlayerMutation,
    resetGame: resetGameMutation,
  };
}
