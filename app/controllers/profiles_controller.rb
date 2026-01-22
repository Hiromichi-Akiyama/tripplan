class ProfilesController < ApplicationController
  before_action :authenticate_user!

  def edit
    @user = current_user
  end

  def update
    @user = current_user
    if @user.update_profile(profile_params)
      redirect_to edit_profile_path, notice: "プロフィールを更新しました"
    else
      flash.now[:alert] = "入力内容にエラーがあります。確認してください。"
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    params.require(:user).permit(:name, :email)
  end
end
