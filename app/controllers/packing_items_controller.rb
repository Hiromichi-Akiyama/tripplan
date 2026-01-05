class PackingItemsController < ApplicationController

  before_action :authenticate_user!
  before_action :set_trip
  before_action :set_packing_item, only: %i[update destroy]

  def create
    @packing_item = @trip.packing_items.build(packing_item_create_params)

    if @packing_item.save
      redirect_to trip_path(@trip), notice: "持ち物を作成しました"
    else
      @activities = @trip.activities.ordered_for_timeline
      @packing_items = @trip.packing_items.ordered_for_list
      render "trips/show", status: :unprocessable_entity
    end
  end

  def update
    if @packing_item.update(packing_item_checked_params)
      redirect_to trip_path(@trip)
    else
      redirect_to trip_path(@trip), alert: "更新に失敗しました" 
    end
  end

  def destroy
    @packing_item.destroy
    redirect_to trip_path(@trip)
  end

  private

  def set_trip
    @trip = Trip.find_by_user_and_id(current_user, params[:trip_id])
  end

  def set_packing_item
    @packing_item = PackingItem.find_by_trip_and_id(@trip, params[:id])
  end

  def packing_item_create_params
    params.require(:packing_item).permit(:name, :category, :display_order)
  end

  def packing_item_checked_params
    params.require(:packing_item).permit(:checked)
  end

end
