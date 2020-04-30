<template>
  <section>
    <h1>Lets see what ve have</h1>
    <p>Click on a day in a week, to see what I've got</p>
    <p>
      If you've realised something is missing (stuff from other repo or project, perhaps) -
      <router-link to="/">go back, and add everything again</router-link>
    </p>
    <section class="row">
      <calendar
        class="scale2"
        :width="'300px'"
        :value="value"
        :disabled-days-of-week="disabled"
        :format="format"
        :firstDayOfWeek="1"
        :pane="1"
        :has-input="false"
        :on-draw-date="onDrawDate"
        :on-day-click="onDayClick"
      ></calendar>
      <section>
        <p v-if="!selectedDate">Press on a date to visualize your commits here ..</p>
        <div v-if="selectedDate">
          <h3>{{moment(selectedDate).format('DD MMM YYYY')}}</h3>
          <h4>
            On this day
            <button @click="editDay">Edit ✏️️</button>
            <button @click="copyDayScript">Copy script to clipboard</button>
          </h4>
          <p>
            You have worked
            <strong>{{(dayRecordsMinutesTotal/60).toFixed(2)}}</strong> hrs (
            <strong>{{dayRecordsMinutesTotal}}</strong> minutes)
          </p>
          <ul>
            <li v-for="record in dayRecords" :key="record.message">
              <strong>[{{record.startTime}}~{{record.endTime}}]</strong>
              : {{record.comment}} [ {{ record.delta }} minutes ]
            </li>
          </ul>

          <!-- Week section -->
          <h4>
            On this week
            <button disabled>Edit ✏️️</button>
            <button @click="forge">Forge 🎱</button>
            <button @click="copyWeekScript">Copy script to clipboard</button>
          </h4>
          <p>
            You have worked
            <strong>{{(weekRecordsMinutesTotal/60).toFixed(2)}}</strong> hrs (
            <strong>{{weekRecordsMinutesTotal}}</strong> minutes)
          </p>
          <ul>
            <ol v-for="(item, key) in weekRecords" :key="key">
              <h3>{{key}}</h3>
              <li v-for="record in item" :key="record.message">
                 <strong>[{{record.startTime}}~{{record.endTime}}]</strong>
                : {{record.comment}} [ {{ record.delta }} minutes ]
              </li>
            </ol>
          </ul>
        </div>
      </section>
    </section>
    <p>If you're really impressed, or perhaps want to contribute - click here to see whats on the roadmap</p>
  </section>
</template>

<script>
import Vue from "vue";
import calendar from "vue2-slot-calendar/lib/calendar";
import moment from 'moment';
import copy from 'copy-to-clipboard';
import GitLogParser from "../service/git-log-parser";
import MagicBuilder from "../service/magic";
import state from "../service/state";

const CLICK_A_DAY_SCRIPT = `
  let i = 0;
  records.forEach(record => {
      i++;
      setTimeout(()=>{
        $('#von').val(record.startTime);
        $('#bis').val(record.endTime);
        $('#dauer').val(record.duration);
        $('#bemerkung').val(record.comment);
        $('#taetigkeit').val(record.type || "opw");
        console.log('Bastian types in: ');
        console.log(JSON.stringify(record, null, 2));
        setTimeout(()=>{
          console.log('Bastian clicks "save!"');
          const $saveBtn = $('#Speichern').length == 0 ? $('#Save') : $('#Speichern');
          $saveBtn.click();
        }, 300);
      }, i * 2000);
  })
`

export default {
  name: "Calendar",
  components: { calendar },
  data: () => ({
    value: "",
    format: "MMMM/dd/yyyy",
    disabled: [0, 6],
    selectedDate: null,
    dayRecords: [],
    weekRecords: [],
    moment: moment
  }),
  methods: {
    onDayClick(day) {
      this.selectedDate = day;
      this.dayRecords = MagicBuilder.withStartTime(
        state.startTime
      ).parseGitRecords(
        GitLogParser.getRecords(this ? this.selectedDate : null)
      );

      const groupedByDay = GitLogParser.getWeekRecordsGroupedByDay(this.selectedDate);

      this.weekRecords = {};
      Object.keys(groupedByDay).forEach(dayOfWeek => {
        const dayOfTheWeekRecords = groupedByDay[dayOfWeek] || [];
        this.weekRecords[dayOfWeek] = MagicBuilder.withStartTime(
          state.startTime
        ).parseGitRecords(dayOfTheWeekRecords);
      });
    },
    /* makes dates with data GREEN */
    onDrawDate(arg) {
      const records = GitLogParser.getRecords(arg.date);
      if (records && records.length) {
        arg.sclass += " green";
      }
    },
    forge() {
      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach(day => {
        if (!this.weekRecords[day]){
          const startMoment = moment(`2013-02-08 ${state.startTime}`);
          const randomMin = 7 * 54 + 30 + Math.round(20*Math.random());
          Vue.set(this.weekRecords, day, [
            {
               "startTime": state.startTime,
               "endTime":  startMoment.add(30, "minutes").format("HH:mm"),
               "comment": "Daily",
               "delta": 30,
               "duration": moment('2013-02-08 00:00').add(30, 'minutes').format('HH:mm'),
               "type": "me",
               "date": moment(this.selectedDate).day(day).format('YYYY-MM-DD')
            },
            {
               "startTime": startMoment.format("HH:mm"),
               "endTime":  startMoment.add(randomMin, "minutes").format('HH:mm'),
               "comment": "Operative work",
               "delta": randomMin,
               "duration": moment('2013-02-08 00:00').add(randomMin, 'minutes').format('HH:mm'),
               "type": "opw",
               "date": moment(this.selectedDate).day(day).format('YYYY-MM-DD')
            }
          ]);
        }
      })
    },
    copyDayScript() {
      let scriptText = `
      (function () {
         const records = ${JSON.stringify(this.dayRecords)};
         $('*[data-title*="${moment(this.selectedDate).format   ('DD.MM.YYYY')}"]').click();
         setTimeout(()=>{
           ${CLICK_A_DAY_SCRIPT}
         }, 500);
      }())
      `;
      copy(scriptText);
    },
    copyWeekScript() {
      let scriptText = `
      (function () {
        function delay(ms) {
          return new Promise((resolve, reject)=>{
            setTimeout(()=>{
              resolve();
              }, ms);
          });
        }

        const weekRecords = ${JSON.stringify(this.weekRecords, null, 2)};
        let recordsScheduled = 0, day = 0;
        const TIME_PER_RECORD = 3200;
        console.log(Object.keys(weekRecords));
        Object.keys(weekRecords).forEach(dayName => {

          delay(recordsScheduled * TIME_PER_RECORD + 1200 * day++).then(() => {
            const records = weekRecords[dayName];
            console.log("Bastian clicks on " + moment(records[0].date).format('DD/MM/YYYY') + "...");
            const selector = '*[data-title*="' + moment(records[0].date).format('DD/MM/YYYY') + '"]';
            console.log(dayName + ' ' + records[0].date + ' ' + selector);
            const $el = $(selector);
            if (!$el.length) {
              console.log('Basti can not find this day on screen! Wrong week perhaps? Gee man, be careful - it is !financing! we are talking about!');
            }
            $(selector).click();
            // wait for click
            delay(1000).then(()=>{
              ${CLICK_A_DAY_SCRIPT}
            });
          });
          
          recordsScheduled += weekRecords[dayName].length;
        });
      }())
      `;
      copy(scriptText);
    },
    editDay() {
      let newJson = window.prompt(
        `Copy this JSON for your day record.\n Do some text editor magic elsewhere\nPaste it back in this box. I trust you, you wont break a thing!`, JSON.stringify(this.dayRecords));
        if (!newJson) 
          return;
      this.dayRecords = JSON.parse(newJson);
      const oldRecords = GitLogParser.getRecords(this.selectedDate);
      if (!oldRecords) {
        GitLogParser.setRecords(
          ...GitLogParser.getRecords(),
          ...this.dayRecords
        );
      }
    },
    editWeek() {

    },
  },
  computed: {
    dayRecordsMinutesTotal() {
      if (this.dayRecords) {
        let total = 0;
        this.dayRecords.forEach(r => (total += r.delta));
        return total;
      } else {
        return 0;
      }
    },

    weekRecordsMinutesTotal() {
      if (this.weekRecords) {
        let total = 0;
        Object.keys(this.weekRecords).forEach(day => {
          let records = this.weekRecords[day];
          records.forEach(r => (total += r.delta));
        });
        return total;
      } else {
        return 0;
      }
    }
  }
};
</script>

<style>
.row {
  height: 300px;
  display: flex;
  margin-bottom: 200px;
}

.row > * {
  flex: 1;
}

.green {
  background: rgba(5, 255, 0, 0.3);
}
</style>