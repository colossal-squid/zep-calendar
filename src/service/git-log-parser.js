import moment from 'moment';

let gitLog = '';
const service = {
    save(text) {
        gitLog = text;
        this.parsedRecords = gitLog.split('\n').filter(str=>!!str).map( str => {
            const [ message, date ] = str.split('#@!');
            return {
                message, date: moment(date)
            };
        });
    },
    
    parse() {
        return gitLog;
    },

    getRecords(day) {
        if (day && (this.parsedRecords || []).length) {
            const p = this.parsedRecords.filter( rec => {
                const dayDate = moment(day);
                const tmrw = dayDate.clone().add(1, 'day');
                return rec.date.isBefore(tmrw) && rec.date.isAfter(dayDate);
            } );
            return p;
        }
        return this.parsedRecords;
    },

    setRecords(records) {
        this.parsedRecords = records;
    },

    getWeekRecords(day) {
        if (day && (this.parsedRecords || []).length) {
           const dayMoment = moment(day);
           return this.parsedRecords.filter( rec => {
               const recMoment = moment(rec.date);
               return recMoment.month() == dayMoment.month() && 
                      recMoment.year() == dayMoment.year() && 
                      recMoment.week() == dayMoment.week();
           } )
        }
        return this.parsedRecords;
    },

    getWeekRecordsGroupedByDay(day) {
        const records = this.getWeekRecords(day);
        const days = {};
        records.forEach(rec => {
            const day = moment(rec.date).format('dddd');
            if (!days[day]) {
                days[day] = [];
            }
            days[day].push(rec);
        }) 
        return days;
    }
}
export default service;