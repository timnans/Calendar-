json.extract! schedule, :id, :title, :calendar_id, :start, :end, :location, :created_at, :updated_at
json.url schedule_url(schedule, format: :json)
