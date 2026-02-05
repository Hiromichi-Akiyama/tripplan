class PackingItemsController < ApplicationController
  include ItineraryDataPreparable
  include PackingItemsGroupable

  before_action :authenticate_user!
  before_action :set_trip
  before_action :set_packing_item, only: %i[update destroy]

  def create
    @packing_item = @trip.build_packing_item(packing_item_create_params)

    if @packing_item.save
      redirect_to trip_path(@trip, tab: Trip::TAB_PACKING), notice: I18n.t("flash.packing_items.created")
    else
      flash.now[:alert] = I18n.t("flash.packing_items.invalid")
      @activities = @trip.activities_for_timeline
      @packing_items = @trip.packing_items_for_list
      @default_tab = Trip::TAB_PACKING
      prepare_itinerary
      prepare_packing_items_by_category
      render "trips/show", status: :unprocessable_content
    end
  end

  def update
    if @packing_item.update(packing_item_checked_params)
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            helpers.dom_id(@packing_item),
            partial: "packing_items/row",
            locals: { packing_item: @packing_item }
          )
        end
        format.html { redirect_to trip_path(@trip, tab: Trip::TAB_PACKING) }
      end
    else
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            helpers.dom_id(@packing_item),
            partial: "packing_items/row",
            locals: { packing_item: @packing_item }
          ), status: :unprocessable_content
        end
        format.html { redirect_to trip_path(@trip, tab: Trip::TAB_PACKING), alert: I18n.t("flash.packing_items.update_failed") }
      end
    end
  end

  def destroy
    @packing_item.destroy
    redirect_to trip_path(@trip, tab: Trip::TAB_PACKING), alert: I18n.t("flash.packing_items.deleted")
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
