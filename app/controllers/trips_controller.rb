class TripsController < ApplicationController
  include ItineraryDataPreparable
  include PackingItemsGroupable
  before_action :authenticate_user!
  before_action :set_trip, only: %i[show edit update destroy]

  def index
    @active_tab = Trip::TABS.include?(params[:tab]) ? params[:tab] : "all"
    @trips = current_user.trips.for_tab(@active_tab)
  end

  def show
    @activities = @trip.activities.ordered_for_timeline
    @packing_items = @trip.packing_items.ordered_for_list
    @packing_item = @trip.packing_items.build
    @default_tab = params[:tab]
    prepare_itinerary
    prepare_packing_items_by_category
  end

  def new
    @trip = current_user.trips.build
  end

  def create
    @trip = current_user.trips.build(trip_params)

    if @trip.save
      redirect_to trip_path(@trip), notice: I18n.t("flash.trips.created")
    else
      flash.now[:alert] = I18n.t("flash.trips.invalid")
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @trip.update(trip_params)
      if params[:source] == "memo"
        redirect_to trip_path(@trip, tab: "memo"), notice: I18n.t("flash.trips.memo_saved")
      else
        redirect_to trip_path(@trip), notice: I18n.t("flash.trips.updated")
      end
    else
      flash.now[:alert] = I18n.t("flash.trips.invalid")
      if params[:source] == "memo"
        @activities = @trip.activities.ordered_for_timeline
        @packing_items = @trip.packing_items.ordered_for_list
        @packing_item = @trip.packing_items.build
        @default_tab = "memo"
        prepare_itinerary
        prepare_packing_items_by_category
        render :show, status: :unprocessable_entity
      else
        render :edit, status: :unprocessable_entity
      end
    end
  end

  def destroy
    @trip.destroy
    redirect_to trips_path, alert: I18n.t("flash.trips.deleted")
  end

  private

  def set_trip
    @trip = current_user.trips.find(params[:id])
  end

  def trip_params
    params.require(:trip).permit(:title, :destination, :start_date, :end_date, :color, :notes)
  end
end
