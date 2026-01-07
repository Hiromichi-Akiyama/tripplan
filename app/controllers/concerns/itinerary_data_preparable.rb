module ItineraryDataPreparable
  extend ActiveSupport::Concern

  private

  def prepare_itinerary_data
    @activities_by_date = @activities.group_by(&:date)
    if @trip.start_date.present? && @trip.end_date.present? && @trip.start_date <= @trip.end_date
      @trip_days = (@trip.start_date..@trip.end_date).to_a
    else
      @trip_days = @activities_by_date.keys.compact.sort
    end
  end
end
