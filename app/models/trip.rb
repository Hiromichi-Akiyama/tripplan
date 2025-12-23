class Trip < ApplicationRecord
  belongs_to :user

  # Tabs for Trips index
  TABS = %w[all upcoming past].freeze

  # end_date >= today (includes trips currently in-progress)
  scope :upcoming, ->(today = Date.current) { where("end_date >= ?", today) }

  # end_date < today
  scope :past, ->(today = Date.current) { where("end_date < ?", today) }

  # Apply filtering + ordering for the given tab key.
  # Usage: current_user.trips.for_tab("upcoming")
  scope :for_tab, ->(tab, today = Date.current) {
    tab = tab.to_s
    case tab
    when "upcoming"
      upcoming(today).order(start_date: :asc)
    when "past"
      past(today).order(end_date: :desc)
    else
      order(start_date: :desc)
    end
  }
end
