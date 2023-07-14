import { defineStore } from "pinia";

export const CounterStore = defineStore({
    id: "counterState",
    state: () => ({
        counter: 0
    }),
    getters: {
        current_count: (state) => state.counter
    },
    actions: {
        increment_counter(){
            this.counter++;
        }
    }
})