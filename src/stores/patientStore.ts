import { defineStore } from "pinia";
import axios from "axios";

interface Client {
  id: number;
  name: string;
  // Adicione outras propriedades do cliente conforme necessário
}

export const useClientStore = defineStore({
  id: "client",
  state: () => ({
    clients: [] as Client[],
  }),
  getters: {
    sortedClients(): Client[] {
      return this.clients.slice().sort((a, b) => a.name.localeCompare(b.name));
    },
    getClientById:
      (state) =>
      (id: number): Client | undefined => {
        return state.clients.find((client) => client.id === id);
      },
  },
  actions: {
    async fetchClients() {
      try {
        const response = await axios.post("/clientes");
        this.clients = response.data;
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    },
  },
});
