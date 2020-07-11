function objects(title, description, time, time_of_work, name, tag, data, id){
  return{
    title, description, time, time_of_work, name, tag, data, id
  }
}

const plan_array = [
  // objects("Task 1", "description", "time", "time_of_work", "name", "plan"),
  // objects("Task 2", "description", "time", "time_of_work", "name", "in-work"),
  // objects("Task 3", "description", "time", "time_of_work", "name", "in-work"),
  // objects("Task 4", "description", "time", "time_of_work", "name", "ended")
]

new Vue({
  el: "#app",
  data: {
    windowVisibility: false,
    userNameBoolevo: false,
    boolevo: [false, false, false],
    userName: '',
    search: '',
    description: '',
    status: '',
    sponsor: '',
    start: '',
    end: '',
    title: 'Kanban Vue.JS',
    editable: false,
    uuid: 0, 
    dif_id: 0,
    darkIsEnabled: true,
    darkText: true,
    theme_naming: ["Светлая тема", "Темная тема"],
    selected_id: 0,
    check_box: 0,
    schedule: [0, 0, 0],
    plan_array: plan_array
  },
  methods: {
    checkFull: function(name){
      if(name != "" || name != " "){
        this.uuid++
        this.dif_id++
        this.plan_array.push(objects('Задача ' + this.uuid, this.search, "", "", this.userName, "plan", "", 'Task ' + this.dif_id))
        this.status = ''
        this.sponsor = ''
        this.start = ''
        this.end = ''
        this.shell()
        this.userNameBoolevo = !this.userNameBoolevo
      }
    },
    checkTextInInput: function(search){
      if(search != '' || search != " "){
        // this.windowVisibility = !this.windowVisibility
        this.search = search
        this.userNameBoolevo = !this.userNameBoolevo
      }
    },
    reset_input: function(){
      this.search =  '',
      this.description = '',
      this.status = '',
      this.sponsor = '',
      this.start = '',
      this.end = ''
    },
    add_data_to_array: function(desc, status, sponsor, start, end){
      if((status == 'plan' || status == 'in-work' || status == 'ended') && this.editable == false){
          this.uuid++
          this.plan_array.push(objects('Task ' + this.uuid, desc, start, end, this.userName, status, ""))
          this.reset_input()
          this.windowVisibility = !this.windowVisibility
          this.shell()
      }
      else if((status == 'plan' || status == 'in-work' || status == 'ended') && this.editable == true){
                for(let i = 0; i < this.plan_array.length; i++){
                  if(this.plan_array[i]["id"].includes(this.selected_id)){
                    this.plan_array[i]["description"] = this.search
                    this.plan_array[i]["time"] = this.start
                    this.plan_array[i]["time_of_work"] = this.end
                    this.plan_array[i]["name"] = this.sponsor
                    this.plan_array[i]["tag"] = this.status
                  }
                }
                this.windowVisibility = !this.windowVisibility
                this.reset_input()
                this.selected_id = 0
                this.editable = false
                this.shell()
      }
    },
    edit_app_block: function(index){
      for(let i = 0; i < this.plan_array.length; i++){
        if(this.plan_array[i]["id"].includes(index + 1)){
          if(this.plan_array[i]["tag"] == "plan"){
            this.boolevo[0] = true
            this.boolevo[1] = true
            this.boolevo[2] = false
          }
          else if(this.plan_array[i]["tag"] == "in-work"){
            this.boolevo[0] = false
            this.boolevo[1] = true
            this.boolevo[2] = false
          }
          else if(this.plan_array[i]["tag"] == "ended"){
            this.boolevo[0] = false
            this.boolevo[1] = false
            this.boolevo[2] = true
          }
          this.search =  this.plan_array[i]["description"],
          this.status = this.plan_array[i]["tag"],
          this.sponsor = this.plan_array[i]["name"],
          this.start = this.plan_array[i]["time"],
          this.end = this.plan_array[i]["time_of_work"]
          this.editable = true
          this.windowVisibility = !this.windowVisibility
          this.selected_id = index + 1
        }
      }
    },
    ready_button: function(index){
      for(let i = 0; i < this.plan_array.length; i++){
        if(this.plan_array[i]["id"].includes(index + 1)){
          if(this.plan_array[i]["tag"] == "plan"){
            this.plan_array[i]["tag"] = 'in-work'
            if(this.plan_array[i]["time"] == ""){
              this.plan_array[i]["time"] = new Date().toLocaleString();
              this.plan_array[i]["data"] = new Date();
            }
          }
          else if(this.plan_array[i]["tag"] == 'in-work'){
            this.plan_array[i]["tag"] = 'ended'
            if(this.plan_array[i]["time_of_work"] == ""){
              var diff = this.dateDiff(this.plan_array[i]["data"], new Date())
              this.plan_array[i]["time_of_work"] = diff.years+' лет, '+
              diff.months+' месяцев, '+
              diff.days+' дней, '+
              diff.hours+' часов, '+
              diff.minutes+' минут, '+
              diff.seconds+' секунд'
            }
          }
          this.shell()
        }
      }
    },
    dateDiff: function(date1, date2) {
      var years, months, days, hours, minutes, seconds;
      var y1, m1, d1, d2, dd;
      years = date2.getFullYear()-(y1 = date1.getFullYear())
      months = date2.getMonth()-(m1 = date1.getMonth())
      days = (d2 = date2.getDate())-(d1 = date1.getDate())
      hours = date2.getHours()-date1.getHours()
      minutes = date2.getMinutes()-date1.getMinutes()
      seconds = date2.getSeconds()-date1.getSeconds()
      dd = 0
      if (seconds < 0) {
          seconds += 60;
          minutes--;
      }
      if (minutes < 0) {
          minutes += 60
          hours--
      }
      if (hours < 0) {
          hours += 24
          days--
          dd = 1
      }
      if (days < 0) {
          days = monthDays(y1, m1)-d1+d2-dd
          months--
      }
      if (months < 0) {
          months += 12
          years--
      }
      return {years: years, months: months, days: days,
              hours: hours, minutes: minutes, seconds: seconds};
    },
    delete_app_block: function(index){
      for(let i = 0; i < this.plan_array.length; i++){
        if(this.plan_array[i]["id"].includes(index + 1)){
          for(let j = i + 1; j < this.plan_array.length; j++){
            this.plan_array[j]["id"] = 'Task ' + (this.plan_array[j]["id"].split(" ")[1] - 1)
          }
          this.plan_array.splice(i, 1)
          this.dif_id--
          this.shell()
          console.log(this.plan_array.toString())
        }
      }
    },
    change_text: function(){
      this.check_box = !this.check_box
      if(this.check_box == 1){
        this.darkIsEnabled = false
      }
      else{
        this.darkIsEnabled = true
      }
    },
    shell: function(){
      let plans = 0
      let works = 0
      let done = 0
      for(let i = 0; i < this.plan_array.length; i++){
        if(this.plan_array[i]['tag'] == "plan"){
          plans++
        }
        else if(this.plan_array[i]['tag'] == "in-work"){
          works++
        }
        else if(this.plan_array[i]['tag'] == "ended"){
          done++
        }
      }
      this.schedule[0] = plans
      this.schedule[1] = works
      this.schedule[2] = done
      console.log(this.schedule)
    },
    startDrag: function(evt, item) {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('itemID', item.id)
      this.shell()
    },
    onDrop: function (evt, list) {
      const itemID = evt.dataTransfer.getData('itemID')
      const item = this.plan_array.find(item => item.id == itemID)
      item.tag = list
      if(item.tag == "in-work" && item.time == ""){
        item.time = new Date().toLocaleString()
        item.data = new Date()
      }
      else if(item.tag == "ended" && item.time_of_work == ""){
        var diff = this.dateDiff(item.data, new Date())
        item.time_of_work = diff.years+' лет, '+
        diff.months+' месяцев, '+
        diff.days+' дней, '+
        diff.hours+' часов, '+
        diff.minutes+' минут, '+
        diff.seconds+' секунд'
      }
      this.shell()
    }
  }
})