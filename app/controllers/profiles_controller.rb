class ProfilesController < ApplicationController
  before_action :authenticate_user!

  def edit
    @user = current_user
  end

  def update
    @user = current_user
    if @user.update_profile(profile_params)
      redirect_to edit_profile_path, notice: I18n.t("flash.profiles.updated")
    else
      flash.now[:alert] = I18n.t("flash.profiles.invalid")
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    params.require(:user).permit(:name, :email)
  end
end
