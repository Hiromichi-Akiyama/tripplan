class ActivitiesController < ApplicationController

  before_action :authenticate_user!
  before_action :set_trip
  before_action :set_activity, only: %i[edit update destroy]

  def new
    @activity = @trip.activities.build
  end

  def create
    @activity = @trip.activities.build(activity_params)

    if @activity.save
      redirect_to trip_path(@trip), notice: "アクティビティを作成しました"
    else
      flash.now[:alert] = "入力内容にエラーがあります。確認してください。"
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @activity.update(activity_params)
      redirect_to trip_path(@trip), notice: "アクティビティを更新しました"
    else
      flash.now[:alert] = "入力内容にエラーがあります。確認してください。"
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @activity.destroy
    redirect_to trip_path(@trip), notice: "アクティビティを削除しました"
  end

  private

  def set_trip
    @trip = current_user.trips.find(params[:trip_id])
  end

  def set_activity
    @activity = @trip.activities.find(params[:id])
  end

  def activity_params
    params.require(:activity).permit(:title, :date, :start_time, :end_time, :location, :cost, :memo, :address, :url, :booking_code, :display_order)
  end

end
