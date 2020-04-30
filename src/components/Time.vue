<template>
  <section>
    <h1>Pick your starting time</h1>
    <input class="time" v-model="state.startTime" type="time" min="06:00" max="18:00" required />
    <p>
      This will make every record start logging from
      <strong>{{state.startTime}}</strong>
    </p>
    <button disabled>Add daily meeting (not implemented)</button>

    <p>Once you're happy with time - press "Next!" to procceed</p>

    <router-link to="/git">Next!</router-link>
  </section>
</template>

<script>
import State from "../service/state";

export default {
  name: "Time",
  components: {},
  data: ()=>({
    state: State
  }),
  methods: {}
};
</script>

<style>
.time {
  font-size: 26px;
}
</style>