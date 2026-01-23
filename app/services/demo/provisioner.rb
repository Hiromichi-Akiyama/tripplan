module Demo
  class Provisioner
    def self.call!(user)
      new.call!(user)
    end

    def call!(user)
      trip_map = {}

      Demo::SeedData::TRIPS.each do |trip_data|
        trip = user.trips.create!(
          title: trip_data[:title],
          destination: trip_data[:destination],
          start_date: trip_data[:start_date],
          end_date: trip_data[:end_date],
          color: trip_data[:color],
          notes: nil
        )
        trip_map[trip_data[:id]] = trip
        create_packing_items!(trip, trip_data[:packing_list])
      end

      create_activities!(trip_map)
    end

    private

    def create_packing_items!(trip, items)
      items.each_with_index do |item, index|
        trip.packing_items.create!(
          name: item[:name],
          category: item[:category],
          checked: item[:checked],
          display_order: index + 1
        )
      end
    end

    def create_activities!(trip_map)
      order_map = Hash.new(0)

      Demo::SeedData::ACTIVITIES.each do |activity|
        trip = trip_map[activity[:trip_id]]
        next unless trip

        order_map[trip.id] += 1
        start_time, end_time = parse_time_range(activity[:time])

        trip.activities.create!(
          title: activity[:title],
          date: activity[:date],
          start_time: start_time,
          end_time: end_time,
          location: activity[:location],
          cost: activity[:cost].to_i,
          memo: activity[:memo],
          address: nil,
          url: nil,
          booking_code: nil,
          display_order: order_map[trip.id]
        )
      end
    end

    def parse_time_range(time_range)
      return [nil, nil] if time_range.blank?

      parts = time_range.split(/\s*[–-]\s*/)
      start_str = parts[0].to_s.strip
      end_str = parts[1].to_s.strip

      [normalize_time(start_str), normalize_time(end_str)]
    end

    def normalize_time(time_str)
      return nil if time_str.blank?

      time_str
    end
  end
end
