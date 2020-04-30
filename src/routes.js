import Intro from './components/Intro.vue';
import Calendar from './components/Calendar';
import Time from './components/Time';
import Git from './components/Git';

export default [
    { path: '/', component: Intro },
    { path: '/calendar', component: Calendar },
    { path: '/time', component: Time },
    { path: '/git', component: Git }
];