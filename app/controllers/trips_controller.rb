class TripsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_trip, only: %i[show edit update destroy]

  def index
    @active_tab = Trip::TABS.include?(params[:tab]) ? params[:tab] : "all"
    @trips = current_user.trips.for_tab(@active_tab)
  end

  def show
    @activities = @trip.activities.ordered_for_timeline
  end

  def new
    @trip = current_user.trips.build
  end

  def create
    @trip = current_user.trips.build(trip_params)

    if @trip.save
      redirect_to trip_path(@trip), notice: "旅行を作成しました"
    else
      flash.now[:alert] = "入力内容にエラーがあります。確認してください。"
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @trip.update(trip_params)
      redirect_to trip_path(@trip), notice: "旅行を更新しました"
    else
      flash.now[:alert] = "入力内容にエラーがあります。確認してください。"
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @trip.destroy
    redirect_to trips_path, notice: "旅行を削除しました"
  end

  private

  def set_trip
    @trip = current_user.trips.find(params[:id])
  end

  def trip_params
    params.require(:trip).permit(:title, :destination, :start_date, :end_date, :color, :notes)
  end
end