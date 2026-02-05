require_relative "seed_data"

module Portfolio
  class Seed
    USER_EMAIL = "portfolio@example.com"
    USER_PASSWORD = "Portfolio1234"
    USER_NAME = "Portfolio User"

    def self.seed!
      ActiveRecord::Base.transaction do
        user = find_or_create_user
        return if user.trips.exists?

        create_data!(user)
      end
    end

    def self.reset!
      ActiveRecord::Base.transaction do
        user = find_or_create_user
        user.trips.destroy_all
        create_data!(user)
      end
    end

    def self.find_or_create_user
      user = User.find_or_initialize_by(email: USER_EMAIL)
      user.name = USER_NAME
      user.password = USER_PASSWORD
      user.password_confirmation = USER_PASSWORD
      user.save! if user.changed?
      user
    end
    private_class_method :find_or_create_user

    def self.create_data!(user)
      trip_map = {}

      SeedData::TRIPS.each do |trip_data|
        trip = user.trips.create!(
          title: trip_data[:title],
          destination: trip_data[:destination],
          start_date: Date.parse(trip_data[:start_date]),
          end_date: Date.parse(trip_data[:end_date]),
          color: trip_data[:color],
          notes: nil
        )
        trip_map[trip_data[:id]] = trip

        trip_data[:packing_list].each_with_index do |item, index|
          trip.packing_items.create!(
            name: item[:name],
            category: item[:category],
            checked: item[:checked],
            display_order: index + 1
          )
        end
      end

      activity_order = Hash.new(0)

      SeedData::ACTIVITIES.each do |activity|
        trip = trip_map[activity[:trip_id]]
        next unless trip

        activity_order[trip.id] += 1
        date = Date.parse(activity[:date])
        date = trip.start_date if date < trip.start_date
        date = trip.end_date if date > trip.end_date

        start_time, end_time = parse_time_range(activity[:time])
        cost_value = parse_cost(activity[:cost])

        trip.activities.create!(
          title: activity[:title],
          date: date,
          start_time: start_time,
          end_time: end_time,
          location: activity[:location],
          cost: cost_value,
          memo: activity[:memo],
          display_order: activity_order[trip.id]
        )
      end
    end
    private_class_method :create_data!

    def self.parse_time_range(time_range)
      return [nil, nil] if time_range.blank?

      parts = time_range.split(/\s*[–-]\s*/)
      return [nil, nil] if parts.empty?

      start_time = parse_time(parts[0])
      end_time = parts[1].present? ? parse_time(parts[1]) : nil
      [start_time, end_time]
    end
    private_class_method :parse_time_range

    def self.parse_time(value)
      return nil if value.blank?

      base = "2000-01-01 #{value}"
      Time.zone ? Time.zone.parse(base) : Time.parse(base)
    end
    private_class_method :parse_time

    def self.parse_cost(value)
      return nil if value.blank?

      Integer(value.to_s, 10)
    rescue ArgumentError, TypeError
      nil
    end
    private_class_method :parse_cost
  end
end
