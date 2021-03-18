import { Controller } from "stimulus"
import Rails from "@rails/ujs"
import 'tui-time-picker/dist/tui-time-picker.css';
import "tui-calendar/dist/tui-calendar.css";
import Calendar from "tui-calendar";

export default class extends Controller {
    calendar = new Calendar(document.getElementById('calendar'), {
        id: "1",
        name: "My Calendar",
        defaultView: 'month',
        color: '#00a9ff',
          bgColor: '#00a9ff',
          dragBgColor: '#00a9ff',
          borderColor: 'red',
    
        milestone: true,    // Can be also ['milestone', 'task']
        scheduleView: true,  // Can be also ['allday', 'time']
        useCreationPopup: true,
        useDetailPopup: true,
        template: {
    
          popupDetailRepeat: function(schedule) {
            return 'Repeat : ' + schedule.recurrenceRule;
          },
          
          popupStateFree: function() {
            return 'Free';
          },
            milestone: function(schedule) {
                return '<span style="color:red;"><i class="fa fa-flag"></i> ' + schedule.title + '</span>';
            },
            milestoneTitle: function() {
                return 'Milestone';
            },
            task: function(schedule) {
                return '&nbsp;&nbsp;#' + schedule.title;
            },
            taskTitle: function() {
                return '<label><input type="checkbox" />Task</label>';
            },
            allday: function(schedule) {
                return schedule.title + ' <i class="fa fa-refresh"></i>';
            },
            alldayTitle: function() {
                return 'All Day';
            },
            time: function(schedule) {
                return schedule.title + ' <i class="fa fa-refresh"></i>' + schedule.start;
            }
        },
        month: {
            daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            startDayOfWeek: 0,
            narrowWeekend: true
        },
        week: {
            daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            startDayOfWeek: 0,
            narrowWeekend: true
        }
    });
    getCalendardata(){
        var schedules = JSON.parse(document.querySelector("#calendar").dataset.schedules);
        window.schedules = schedules;
        schedules.forEach(schedule => {
        this.calendar.createSchedules([
        {
          id: schedule.id,
          calendarId: '1',
          title: schedule.title,
          category: 'time',
          dueDateClass: schedule.dueDateClass,
          location: schedule.location,
          start: schedule.start,
          end: schedule.end
        }
        ])
        });
      }
      createCalendarSchedule(){
        let calendar = this.calendar;
        calendar.on('beforeCreateSchedule', function(event) {
        var triggerEventName = event.triggerEventName;
        var schedule =  {
          id: 1,
          calendarId: '1',
          title: event.title,
          category: 'time',
          location: event.location,
          start: event.start,
          end: event.end
        }
        if (triggerEventName === 'click') {
            // open writing simple schedule popup
            // schedule = {...};
        } else if (triggerEventName === 'dblclick') {
            // open writing detail schedule popup
            // schedule = {...};
        }
      
        calendar.createSchedules([schedule]);
        let formData = new FormData()
        formData.append('title', schedule.title);
        formData.append('category', schedule.category);
        formData.append('start', schedule.start._date);
        formData.append('end', schedule.end._date);
        formData.append('location', schedule.location);
      
        Rails.ajax({
          type: "POST",
          url: '/schedules',
          data: formData
        })
       
      });
      } 
      updatedCalendarSchedule(){
        let calendar = this.calendar;
        calendar.on('beforeUpdateSchedule', function(event) {
          var schedule = event.schedule;
          var changes = event.changes;
          var formUpdate = new FormData()    
          if (changes.end) {
          formUpdate.append("end", changes.end._date)    
          }
          if (changes.start) {
          formUpdate.append("start", changes.start._date)    
          }
          if (changes.title) {
          formUpdate.append("title", changes.title)  
          }
          if (changes.category) {
          formUpdate.append("category", changes.category)  
          }
          calendar.updateSchedule(schedule.id, schedule.calendarId, changes);
          
          Rails.ajax({
          type: "PATCH",
          url: '/schedules/'+ schedule.id,
          data: formUpdate
          })
          
          });
      }
      deleteCalendarSchedule(){
        let calendar = this.calendar
       calendar.on('beforeDeleteSchedule', function(event) {
          var schedule = event.schedule;
          calendar.deleteSchedule(schedule.id, schedule.calendarId)
          
          Rails.ajax({
            type: "DELETE",
            url: '/schedules/'+ schedule.id,
          })
          });
      }

  connect() {
      this.deleteCalendarSchedule()
      this.createCalendarSchedule()
      this.getCalendardata()
      this.updatedCalendarSchedule()
  }
}
