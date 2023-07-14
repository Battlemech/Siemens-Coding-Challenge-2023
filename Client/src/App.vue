<template>
  <div class="home">
    <div>The button has been clicked</div>
    <div class="count">{{ counter.count }}</div>
    <div>times!</div>
    <div class="button-holder">
      <button @click="counter.increment">Increment</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { counterStore } from './stores/counter';
const counter = counterStore()
</script>

<style>
.home{
  text-align: center;
}
.count{
  font-size: 60px;
  margin: 20%;
}
.button-holder{
  font-size: 60px;
  margin: 10%;
}
</style>