class ActivitiesController < ApplicationController

  before_action :authenticate_user!
  before_action :set_trip
  before_action :set_activity, only: %i[show edit update destroy]

  def new
    @activity = @trip.activities.build(date: params[:date])
  end

  def show
  end

  def create
    @activity = @trip.activities.build(activity_params)

    if @activity.save
      redirect_to trip_path(@trip), notice: "旅程を作成しました"
    else
      flash.now[:alert] = "入力内容にエラーがあります。確認してください。"
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @activity.update(activity_params)
      redirect_to trip_path(@trip), notice: "旅程を更新しました"
    else
      flash.now[:alert] = "入力内容にエラーがあります。確認してください。"
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @activity.destroy
    redirect_to trip_path(@trip), notice: "旅程を削除しました"
  end

  private

  def set_trip
    @trip = Trip.find_by_user_and_id(current_user, params[:trip_id])
  end

  def set_activity
    @activity = Activity.find_by_trip_and_id(@trip, params[:id])
  end

  def activity_params
    params.require(:activity).permit(:title, :date, :start_time, :end_time, :location, :cost, :memo, :address, :url, :booking_code, :display_order)
  end

end
