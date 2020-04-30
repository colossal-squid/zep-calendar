/* 
    manipulations with records
    Record structure is:
    {
        comment: "Task name yada yada",
        startTime: "09:30",
        endTime: "12:00",
        delta: "02:30", // duration
        type: "opw", // opw for operative work, "me" for meetings
    }
*/
import moment from 'moment';

class Magic {
    constructor(time) {
        this.startTime = time;
    }

    parseGitRecords(gitRecords) {
        // 15 minutes deviation, Basti doesnt like 8hr work days
        let totalMs = 8 * 60 * 60 * 1000 - Math.floor(Math.random() * 15 * 60 * 100);
        const formatted = [];
        const startMoment = moment(`2013-02-08 ${this.startTime}`)
        for (let i = 0; i < gitRecords.length; i++) {
            if (i === gitRecords.length - 1) {
                const minutes =  Math.floor(totalMs / 1000 / 60) || 1;
                formatted.push({
                    date: gitRecords[i].date.format('YYYY-MM-DD'),
                    startTime: startMoment.format('HH:mm'),
                    endTime: startMoment.add(minutes, 'minutes').format('HH:mm'),
                    comment: gitRecords[i].message,
                    duration: moment('2013-02-08 00:00').add(minutes, 'minutes').format('HH:mm'),
                    delta: minutes, //minutes
                })
            } else {
                const deltaMs = gitRecords[i].date - gitRecords[i + 1].date;
                totalMs -= deltaMs;
                const minutes = Math.floor(deltaMs / 1000 / 60) || 2; // let's make the smallest task to be 2min long
                formatted.push({
                    date: gitRecords[i].date.format('YYYY-MM-DD'),
                    startTime: startMoment.format('HH:mm'),
                    endTime: startMoment.add(minutes, 'minutes').format('HH:mm'),
                    comment: gitRecords[i].message,
                    duration: moment('2013-02-08 00:00').add(minutes, 'minutes').format('HH:mm'),
                    delta: minutes, //minutes
                });
            }
        }
        return formatted;
    }
}

class MagicBuilder {
    withStartTime(time) {
        return new Magic(time);
    }
}
const INSTANCE = new MagicBuilder();
export default INSTANCE;