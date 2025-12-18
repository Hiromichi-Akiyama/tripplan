class TripsController < ApplicationController

  def index
    @active_tab = %w[all upcoming past].include?(params[:tab]) ? params[:tab] : "all"
    today = Date.current
    base = current_user.trips

    @trips =
      case @active_tab
      when "upcoming"
        base.where("end_date >= ?", today).order(start_date: :asc)
      when "past"
        base.where("end_date < ?", today).order(end_date: :desc)
      else
        base.order(start_date: :desc)
      end
  end

  def show
    @trip = current_user.trips.find(params[:id])
  end

end
