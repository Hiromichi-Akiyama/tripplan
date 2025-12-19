class TripsController < ApplicationController
  def index
    @active_tab = Trip::TABS.include?(params[:tab]) ? params[:tab] : "all"
    @trips = current_user.trips.for_tab(@active_tab)
  end

  def show
    @trip = current_user.trips.find(params[:id])
  end
end
