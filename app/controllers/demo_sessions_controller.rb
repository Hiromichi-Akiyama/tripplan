class DemoSessionsController < ApplicationController
  def destroy
    unless demo_user?
      redirect_to root_path
      return
    end

    demo_user = current_user
    demo_user_id = session[:demo_user_id]

    sign_out(:user)
    demo_user.destroy!
    session.delete(:demo_user_id)
    redirect_to root_path, notice: "デモを終了しました"
  rescue StandardError => e
    Rails.logger.error(e.full_message)
    message = "デモの終了に失敗しました"
    if Rails.env.development?
      message = "デモ終了失敗: #{e.class} #{e.message}"
    end
    redirect_to root_path, alert: message
  end

  def create
    if user_signed_in?
      redirect_to trips_path
      return
    end

    user = nil

    ActiveRecord::Base.transaction do
      user = User.create!(
        name: "デモユーザー",
        email: "demo+#{SecureRandom.hex(8)}@example.com",
        password: SecureRandom.base58(16)
      )
      Demo::Provisioner.call!(user)
    end

    sign_in(user)
    session[:demo_user_id] = user.id
    redirect_to trips_path, notice: "ログインしました"
  rescue StandardError => e
    Rails.logger.error(e.full_message)
    message = "デモの起動に失敗しました"
    if Rails.env.development?
      message = "デモ起動失敗: #{e.class} #{e.message}"
    end
    redirect_to root_path, alert: message
  end
end
