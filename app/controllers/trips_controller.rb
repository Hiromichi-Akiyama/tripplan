class TripsController < ApplicationController

  def index
    @trips = current_user.trips
  end

  def show
    @trip = current_user.trips.find(params[:id])
  end

end
