# ZEP Automation tool

["ZEP - Time Tracking"](https://www.zep.de/time-tracking.html) is a solution for em.. tracking your time! Time tracking - rocks! 

_Over 540 companies trust ZEP. Every day._ - indeed! Lets imagine you didn't trust ZEP. You kept *not trusting zep* for a week, or even a month! Introducing: ZEP Automation tool!

- import your git commits history
- let the script click stuff for you
- relax in ur chair while it does so, you deserve it!

## Known issues
1. ZEP localizes DOM element IDs, just switch your language to English if you want to use the script
2. The line that extracts history into a file
`zep_user_name=$(git config user.name) && git log --all --author="$zep_user_name" --pretty=format:"%s #@! %cD" >> out.txt && open out.txt` - works in bash. Please contribute versions for your terminal of choice

## Things i want to implement in future:
1. Way to add regular meetings
2. JIRA integration (open a jira API with ur authenticated user/parse JSON workflow)

## Things you can contribute on
If you have an idea or even better - a PR with an improvement - HIT ME!

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
