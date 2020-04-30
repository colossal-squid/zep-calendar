<template>
  <div>
    <h3>Lets see your git commits now</h3>
    <p>Please execute</p>
    <code>zep_user_name=$(git config user.name) && git log --all --author="$zep_user_name" --pretty=format:"%s #@! %cD" >> out.txt && open out.txt</code>
    <p>This will print all the tasks you've been working on, EVER (in that particular repo) which is pretty cool, and store them in a file <b>out.txt</b>, inside of folder you've ran the command in.</p>
    
    <p> Now copy the contents into the textbox below. (for multiple repos - you'd have to run this once in each repo and just dump contents of all text files here)</p>
    <textarea v-model="gitLog" @input="save" class="app-text-area" placeholder="Paste it here!"></textarea>
    <span v-if="gitLog && gitLog.length">
      Got it! {{gitLog.split('\n').length}} records are all here!
    </span>
    <p>Once you're done - press Next!</p>
    <router-link to="/calendar">Next!</router-link>
  </div>
</template>

<script>
import GitLogParser from '../service/git-log-parser';

export default {
  name: 'Git',
  data: ()=>({
    gitLog: ''
  }),
  methods: {
    save() {
      GitLogParser.save(this.gitLog);
    }
  }
}
</script>

<style scoped>

</style>